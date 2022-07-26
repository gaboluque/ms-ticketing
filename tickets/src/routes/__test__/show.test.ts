import request from "supertest";
import { app } from "../../app";
import { signUp } from "../../test/setup";
import mongoose from "mongoose";

describe('GET - /api/tickets/:ticketId', () => {

  it("returns 404 if ticket not found", async () => {
    await request(app)
      .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
      .expect(404);
  });

  it("returns ticket if found", async () => {
    const cookie = signUp();
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: "New ticket",
        price: 20
      })
      .expect(201);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send({});

    expect(ticketResponse.status).toEqual(200);
    expect(ticketResponse.body.title).toEqual("New ticket");
    expect(ticketResponse.body.price).toEqual(20);
  });
});