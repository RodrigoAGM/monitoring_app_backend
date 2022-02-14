import { Role } from '.prisma/client';
import { NextFunction, Request, Response } from 'express';
import { clearData } from '../../../utils/clear.response';
import { UserService } from '../service/user.service';

const userService = new UserService();

export async function handleGetSelf(req: Request, res: Response, next: NextFunction) {
  try {
    const { identification } = req.user;
    const data = await userService.getByIdentification(identification);
    res.status(200).send(clearData(data));
  } catch (error) {
    next(error);
  }
}

export async function handleFindPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const { identification } = req.params;
    const data = await userService.getByIdentification(identification, Role.PATIENT);
    res.status(200).send(clearData(data));
  } catch (error) {
    next(error);
  }
}
