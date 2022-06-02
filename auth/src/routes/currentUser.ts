import express from 'express';
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../../config";

const router = express.Router();

router.get('/api/users/current-user', (req, res) => {
  if(!req.session?.jwt) return res.send({ currentUser: null });

  try {
    const payload = jwt.verify(req.session.jwt, JWT_KEY);
    return res.send({ currentUser: payload });
  } catch (error) {
    return res.send({ currentUser: null });
  }

});

export { router as currentUserRouter };