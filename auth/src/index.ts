import express from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(json());

// Create middleware to show incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});

app.use(signupRouter);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening in port 3000");
});