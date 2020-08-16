import { Response } from 'express';
import mongoose, { Error } from 'mongoose';

export class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(422).send({ code: 422, error: error.message });
    } else {
      res.status(500).send({ code: 500, error: 'Something went wrong!' });
    }
  }
}
