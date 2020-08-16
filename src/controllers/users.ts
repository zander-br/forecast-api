import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { User } from '@src/models/user';
import { BaseController } from '.';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();

      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }
}
