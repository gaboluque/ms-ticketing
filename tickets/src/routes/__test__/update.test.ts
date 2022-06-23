import request from "supertest";
import { app } from "../../app";
import { signUp } from "../../test/setup";
import mongoose from "mongoose";

describe('PUT - /api/tickets/:ticketId', () => {
  let cookies: string[];
  const testId = new mongoose.Types.ObjectId().toHexString();

  const createTicket = (cookies?: string[]) => {
    return request(app)
      .post('/api/tickets')
      .set('Cookie', cookies || signUp())
      .send({
        title: "New ticket",
        price: 20
      });
  }

  beforeEach(() => {
    cookies = signUp();
  });

  it("returns 404 if ticket not found", async () => {
    await request(app)
      .put(`/api/tickets/${testId}`)
      .send({
        title: "New title",
        price: 20
      })
      .set('Cookie', cookies)
      .expect(404);
  });

  it("can only be accessed if user is signed in", async () => {
    const response = await request(app).put(`/api/tickets/${testId}`).send({});
    expect(response.status).toEqual(401);
  });

  it("can only be accessed if user owns the ticket", async () => {
    const response = await createTicket();

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', signUp())
      .send({
        title: "New new title",
        price: 20
      }).expect(401);
  });

  it("returns 400 if user provides invalid title or price", async () => {
    const newTicketResponse = await createTicket(cookies);
    await request(app)
      .put(`/api/tickets/${newTicketResponse.body.id}`)
      .set('Cookie', cookies)
      .send({
        title: "",
        price: 50
      }).expect(400);

    await request(app)
      .put(`/api/tickets/${newTicketResponse.body.id}`)
      .set('Cookie', cookies)
      .send({
        title: "New new title",
        price: -10
      }).expect(400);
  });

  it("updates the ticket provided valid inputs", async () => {
    const newTicketResponse = await createTicket(cookies);
    await request(app)
      .put(`/api/tickets/${newTicketResponse.body.id}`)
      .set('Cookie', cookies)
      .send({
        title: "New new title",
        price: 50
      }).expect(200);

    const response = await request(app)
      .get(`/api/tickets/${newTicketResponse.body.id}`)
      .send({});
    
    expect(response.body.title).toEqual("New new title");
    expect(response.body.price).toEqual(50);
  });

});