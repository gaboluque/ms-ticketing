import express from "express";

const router = express.Router();

router.get("/api/orders/:orderId", (req, res) => {
  res.send("Hello World!");
});

export { router as showOrderRouter };