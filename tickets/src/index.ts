import { DatabaseConnectionError } from "@gluque/node-utils";
import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./natsWrapper";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL must be defined');

  try {
    await natsWrapper.connect("ticketing", "ticketing-publisher", "http://nats-srv:4222");

    natsWrapper.client!.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    })

    process.on("SIGINT", () => natsWrapper.client!.close());
    process.on("SIGTERM", () => natsWrapper.client!.close());

    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log("Listening in port 3000");
  });
}

start();