import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(400).send(
      errors.array().map((e) => ({
        message: e.msg,
        field: e.param,
      }))
    );
    return;
  }

  next();
};
