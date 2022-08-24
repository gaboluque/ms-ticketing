import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { signUp } from "../../test/setup";

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20
  });

  await ticket.save();

  return ticket;
}

const createOrder = async (userCookie: any[], ticketId: string) => {
  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", userCookie)
    .send({ ticketId });

  return body;
}

it("fetches orders for a particular user", async () => {
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();

  const userOne = signUp();
  const userTwo = signUp();

  const orderOne = await createOrder(userOne, ticketOne.id);
  const orderTwo = await createOrder(userTwo, ticketTwo.id);

  const { body: orders } = await request(app)
    .get("/api/orders")
    .set("Cookie", userOne);

  expect(orders).toHaveLength(1);
  expect(orders[0].id).toEqual(orderOne.id);
  expect(orders[0].ticket.id).toEqual(ticketOne.id);
});