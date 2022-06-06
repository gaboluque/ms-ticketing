import express from "express";
import "./config";
import 'express-async-errors';
import { json } from "body-parser";
import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./errors/notFoundError";
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

app.use(signupRouter);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.get("*", () => { throw new NotFoundError() });

app.use(errorHandler);

export { app };