import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { Beach } from '@src/models/beach';

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    const beach = new Beach(req.body);
    const result = await beach.save();

    res.status(201).send(result);
  }
}
