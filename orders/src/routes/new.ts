import express, { Request, Response } from "express";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@gluque/node-utils";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/orderCreatedPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId").isMongoId().withMessage("TicketId is invalid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find ticket in DB
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // Make sure ticket is not reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("Ticket is already reserved");

    // Calculate expiration date for order
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + EXPIRATION_WINDOW_SECONDS);

    // Build order and save to DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // Publish an event to notify the order was created
    await new OrderCreatedPublisher(natsWrapper.client!).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      }
    });


    // Send response
    res.status(201).send(order);

  }
);

export { router as newOrderRouter };