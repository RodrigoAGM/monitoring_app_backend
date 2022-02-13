import { Doctor } from '.prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../service/auth.service';

const patientService = new AuthService();

export async function handleRegisterPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.body;
    const { patient } = req.body;
    const data = await patientService.registerPatient(user, patient);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleRegisterDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.body;
    const { doctor } = req.body;
    const doctorObj: Doctor = doctor;
    const data = await patientService.registerDoctor(user, doctorObj);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
}
