import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./errors/notFoundError";
import cookieSession from "cookie-session";
import { DatabaseConnectionError } from "./errors/databaseConnectionError";

const app = express();

// Trust traffic through proxy
app.set('trust proxy', true);
app.use(json());

app.use(cookieSession({
  signed: false,
  secure: true,
}))

// Middleware to show incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});

app.use(signupRouter);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signoutRouter);

app.get("*", () => { throw new NotFoundError() });

app.use(errorHandler);

const start = async () => {
  if(!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log("Listening in port 3000");
  });
}

start();