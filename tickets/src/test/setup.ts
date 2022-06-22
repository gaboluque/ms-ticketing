import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

export const signUp = () => {
  // Build JWT payload.
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com", // This is the email address that will be used to sign in.
  };

  // Create the JWT.
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const sessionJSON = JSON.stringify({ jwt: token });

  // Take JSON and encode it as base64.
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}; path=/; httponly`];
}