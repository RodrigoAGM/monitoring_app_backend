import { Doctor, Role } from '.prisma/client';
import { NextFunction, Request, Response } from 'express';
import { clearData } from '../../../utils/clear.response';
import { AuthService } from '../service/auth.service';

const authService = new AuthService();

export async function handleRegisterPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.body;
    const { patient } = req.body;
    const data = await authService.registerPatient(user, patient);
    res.status(201).send(clearData(data));
  } catch (error) {
    next(error);
  }
}

export async function handleRegisterDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.body;
    const { doctor } = req.body;
    const doctorObj: Doctor = doctor;
    const data = await authService.registerDoctor(user, doctorObj);
    res.status(201).send(clearData(data));
  } catch (error) {
    next(error);
  }
}

export async function handlePatientSignIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { identification, password } = req.body;
    const data = await authService.login(identification, password, Role.PATIENT);
    res.status(200).send(clearData(data));
  } catch (error) {
    next(error);
  }
}

export async function handleDoctorSignIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { identification, password } = req.body;
    const data = await authService.login(identification, password, Role.DOCTOR);
    res.status(200).send(clearData(data));
  } catch (error) {
    next(error);
  }
}

export async function handleAdminSignIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { identification, password } = req.body;
    const data = await authService.login(identification, password, Role.ADMIN);
    res.status(200).send(clearData(data));
  } catch (error) {
    next(error);
  }
}

export async function handleSignOut(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.params;
    const data = await authService.logout(refreshToken);
    res.status(200).send(clearData(data));
  } catch (error) {
    next(error);
  }
}

export async function handleRefreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, refreshToken } = req.body;
    const data = await authService.refreshToken({ token, refreshToken });
    res.status(200).send(clearData(data));
  } catch (error) {
    next(error);
  }
}

export async function handleRecoverPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { identification, birthdate } = req.body;
    const data = await authService.recoverPassword(birthdate, identification);
    res.status(200).send(clearData(data));
  } catch (error) {
    next(error);
  }
}

export async function handleUpdatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { oldPassword, newPassword, identification } = req.body;

    const data = await authService.updatePassword(identification, newPassword, oldPassword);
    res.status(200).send(clearData(data));
  } catch (error) {
    next(error);
  }
}
