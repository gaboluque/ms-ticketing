import express from "express";

const router = express.Router();

router.get("/api/orders", (req, res) => {
  res.send("Hello World!");
});

export { router as indexOrderRouter };