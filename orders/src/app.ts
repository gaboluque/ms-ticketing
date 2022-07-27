import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import { currentUser, errorHandler, NotFoundError } from "@gluque/node-utils";
import cookieSession from "cookie-session";
import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

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
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
  });
}

app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.get("*", () => {
  throw new NotFoundError()
});

app.use(errorHandler);

export { app };