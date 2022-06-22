import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@gabo-test/common";
import { body } from "express-validator";

const router = express.Router();

router.post("/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body('price').isFloat({ gt: 0 }).withMessage("Price must be provided and must be greater than 0")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.sendStatus(201);
  }
);

export { router as newTicketRouter };