import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import { errorHandler, NotFoundError } from "@gabo-test/common";
import cookieSession from "cookie-session";

const app = express();

// Trust traffic through proxy
app.set('trust proxy', true);
app.use(json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}));

// Middleware to show incoming requests
if(process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
  });
}

app.get("*", () => { throw new NotFoundError() });

app.use(errorHandler);

export { app };