import request from "supertest";
import { app } from "../../app";
import { signUp } from "../../test/setup";

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
    .set('Cookie', signUp())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("return error if an invalid title is provided", async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signUp())
    .send({
      title: "",
      price: 10
    }).expect(400);
});

it("returns error if an invalid price is provided", async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signUp())
    .send({
      title: "Title",
      price: -10
    }).expect(400);
});

it("creates a ticket with valid inputs", async () => {
  // TODO: Check if a ticket was created
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signUp())
    .send({
      title: "New ticket",
      price: 10
    }).expect(201);
});