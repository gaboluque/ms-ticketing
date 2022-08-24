import express from "express";
import { NotFoundError, requireAuth } from "@gluque/node-utils";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders/:orderId",
  requireAuth,
  async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order || order.userId !== req.currentUser!.id) throw new NotFoundError();


    res.send(order);
  }
);

export { router as showOrderRouter };