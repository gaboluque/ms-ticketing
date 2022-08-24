import request from 'supertest';
import { app } from '../../app';
import mongoose from "mongoose";
import { signUp } from "../../test/setup";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@gluque/node-utils";
import { natsWrapper } from "../../natsWrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signUp())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signUp())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signUp())
    .send({ ticketId: ticket.id })
    .expect(201);

  const order = await Order.findOne({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: ticket,
  });
  expect(order).toBeDefined();
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signUp())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client!.publish).toHaveBeenCalled();
});