import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import { currentUser, errorHandler, NotFoundError } from "@gabo-test/common";
import cookieSession from "cookie-session";
import { newTicketRouter } from "./routes/new";

const app = express();

// Trust traffic through proxy
app.set('trust proxy', true);
app.use(json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}));

app.use(currentUser);

// Middleware to show incoming requests
if(process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
  });
}

app.use(newTicketRouter);

app.get("*", () => { throw new NotFoundError() });

app.use(errorHandler);

export { app };