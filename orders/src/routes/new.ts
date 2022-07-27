import express from "express";

const router = express.Router();

router.post("/api/orders", (req, res) => {
  res.send("Hello World!");
});

export { router as newOrderRouter };