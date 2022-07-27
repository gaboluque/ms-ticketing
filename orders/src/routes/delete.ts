import express from "express";

const router = express.Router();

router.delete("/api/orders/:orderId", (req, res) => {
  res.send("Hello World!");
});

export { router as deleteOrderRouter };