import express from "express";
import { NotFoundError, OrderStatus, requireAuth } from "@gluque/node-utils";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/orderCancelledPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.delete("/api/orders/:orderId",
  requireAuth,
  async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order || order.userId !== req.currentUser!.id) throw new NotFoundError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event to notify the order was cancelled
    await new OrderCancelledPublisher(natsWrapper.client!).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      }
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };