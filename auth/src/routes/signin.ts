import express, { Request, Response } from 'express';
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest";
import { User } from "../models/user";
import { BadRequestError } from "../errors/badRequestError";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../../config";

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError('Invalid credentials');

    const passwordsMatch = await Password.compare(existingUser.password, password);
    if(!passwordsMatch) throw new BadRequestError('Invalid credentials');


    // Generate JWT
    const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, JWT_KEY);

    // Store it on session object
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };