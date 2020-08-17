import { Response } from 'express';
import mongoose, { Error } from 'mongoose';
import { CUSTOM_VALIDATION } from '@src/models/user';

export interface CustomError {
  code: number;
  error: string;
}

export class BaseController {
  protected sendCreateUpdateErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientError = this.handleClientErrors(error);
      res.status(clientError.code).send(clientError);
    } else {
      res.status(500).send({ code: 500, error: 'Something went wrong!' });
    }
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError
  ): CustomError {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }

    return { code: 422, error: error.message };
  }
}
