import { Response } from 'express';
import mongoose, { Error } from 'mongoose';
import { CUSTOM_VALIDATION } from '@src/models/user';

export class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter(
        (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
      );

      if (duplicatedKindErrors.length) {
        res.status(409).send({ code: 409, error: error.message });
      } else {
        res.status(422).send({ code: 422, error: error.message });
      }
    } else {
      res.status(500).send({ code: 500, error: 'Something went wrong!' });
    }
  }
}
