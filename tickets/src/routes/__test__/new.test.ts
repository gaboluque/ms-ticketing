import request from "supertest";
import { app } from "../../app";
import { signUp } from "../../test/setup";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../natsWrapper";

describe('POST - /api/tickets', () => {
  let cookies: string[];

  beforeEach(() => {
    cookies = signUp();
  });

  it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if user is signed in", async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).toEqual(401);
  });

  it("returns status not 401 if user is signed in", async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookies)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("return error if an invalid title is provided", async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookies)
      .send({
        title: "",
        price: 10
      }).expect(400);
  });

  it("returns error if an invalid price is provided", async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookies)
      .send({
        title: "Title",
        price: -10
      }).expect(400);
  });

  it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookies)
      .send({
        title: "New ticket",
        price: 10
      }).expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
    expect(tickets[0].title).toEqual("New ticket");
  });

  it("publishes ticket:created event", async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookies)
      .send({
        title: "New ticket",
        price: 10
      }).expect(201);

    expect(natsWrapper.client?.publish).toHaveBeenCalled();
  });
});