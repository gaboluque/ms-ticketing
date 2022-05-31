import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {  

  if(error instanceof CustomError) {
    return res.status(error.statusCode).json({ errors: error.serializeErrors() });
  }

  res.status(400).send({
    errors: [ { message: "Something went wrong!" } ]
  });
}