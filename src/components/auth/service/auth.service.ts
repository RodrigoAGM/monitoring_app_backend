import {
  Doctor, Patient, Role, User,
} from '.prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import bcrypt from 'bcrypt';
import AppError from '../../../error/app.error';
import { Result } from '../../../types/types';
import { UserService } from '../../user/service/user.service';

const userService = new UserService();

export class AuthService {
  private async register({
    user, patient, doctor,
  }: {
    user: User, patient?: Patient, doctor?: Doctor
  }): Promise<Result<User>> {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;

      // Set role
      user.role = patient ? Role.PATIENT : Role.DOCTOR;

      const res = await userService.create({ user, doctor });

      return Promise.resolve({ success: true, data: res.data });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return Promise.reject(new AppError({
            message: 'El dni ingresado ya se encuentra registrado.',
            statusCode: 400,
          }));
        }
      }
      if (error instanceof PrismaClientValidationError) {
        return Promise.reject(new AppError({
          message: 'Es necesario completar los campos obligatorios.',
          statusCode: 400,
        }));
      }

      const message = `Error al registrar ${patient ? 'paciente' : 'doctor'}.`;
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async registerDoctor(user: User, doctor: Doctor): Promise<Result<User>> {
    try {
      if (!doctor) {
        return Promise.reject(new AppError({
          message: 'El médico es requerido.',
          statusCode: 400,
        }));
      }

      // Parse date
      const date = new Date(doctor.birthdate);
      doctor.birthdate = date;

      const res = await this.register({ user, doctor });

      return Promise.resolve({ success: true, data: res.data });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Error al registrar paciente.',
        statusCode: 500,
      }));
    }
  }

  async registerPatient(user: User, patient: Patient): Promise<Result<User>> {
    try {
      if (!patient) {
        return Promise.reject(new AppError({
          message: 'El paciente es requerido.',
          statusCode: 400,
        }));
      }

      // Parse date
      const date = new Date(patient.birthdate);
      patient.birthdate = date;

      const res = await this.register({ user, patient });

      return Promise.resolve({ success: true, data: res.data });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Error al registrar paciente.',
        statusCode: 500,
      }));
    }
  }
}
