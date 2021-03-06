import {
  Doctor, Patient, Role, User,
} from '.prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import AppError from '../../../error/app.error';
import { Result, UserTokens } from '../../../types/types';
import { manager } from '../../../utils/prisma.manager';
import { tokenManager } from '../../../utils/token.manager';
import { MailingService } from '../../mail/service/mail.service';
import { MedicalCenterValidator } from '../../medicalCenter/validator/medical.center.validator';
import { UserService } from '../../user/service/user.service';
import { UserValidator } from '../../user/validator/user.validator';

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

      const res = await userService.create({ user, patient, doctor });

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
          message: 'El m??dico es requerido.',
          statusCode: 400,
        }));
      }

      // Check if medical center exist
      if (!doctor.medicalCenterId) {
        return Promise.reject(new AppError({
          message: 'No se incluyo un id de centro m??dico',
          statusCode: 400,
        }));
      }
      await MedicalCenterValidator.checkIfCenterExist(doctor.medicalCenterId);

      // Parse date
      const date = new Date(doctor.birthdate);
      if (Number.isNaN(date.getTime())) {
        return Promise.reject(new AppError({
          message: 'La fecha de nacimiento es inv??lida.',
          statusCode: 400,
        }));
      }
      doctor.birthdate = date;

      const registerRes = await this.register({ user, doctor });

      // Create tokens
      const userTokens = await tokenManager.createTokens(user);

      // Save user tokens
      await manager.client.refreshToken.create({
        data: {
          token: userTokens.token,
          refreshToken: userTokens.refreshToken,
        },
      });

      // Create response object
      const res = {
        ...registerRes.data!,
        token: userTokens.token,
        refreshToken: userTokens.refreshToken,
      };

      return Promise.resolve({ success: true, data: res });
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
      if (Number.isNaN(date.getTime())) {
        return Promise.reject(new AppError({
          message: 'La fecha de nacimiento es inv??lida.',
          statusCode: 400,
        }));
      }
      patient.birthdate = date;

      // Register patient
      const registerRes = await this.register({ user, patient });

      return Promise.resolve({ success: true, data: registerRes.data });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Error al registrar paciente.',
        statusCode: 500,
      }));
    }
  }

  async login(identification: string, password: string, role: Role): Promise<Result<User>> {
    try {
      const user = await manager.client.user.findUnique({
        where: { identification },
        include: { patient: true, doctor: true },
      });

      if (user?.role !== role) {
        return Promise.reject(new AppError({
          message: 'El usuario no tiene el rol requerido.',
          statusCode: 400,
        }));
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return Promise.reject(new AppError({
          message: 'La contrase??a es incorrecta.',
          statusCode: 400,
        }));
      }

      const userTokens = await tokenManager.createTokens(user);

      await manager.client.refreshToken.create({
        data: {
          token: userTokens.token,
          refreshToken: userTokens.refreshToken,
        },
      });

      const res = {
        ...user,
        token: userTokens.token,
        refreshToken: userTokens.refreshToken,
      };

      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Error al iniciar sesi??n.',
        statusCode: 500,
      }));
    }
  }

  async logout(refreshToken: string): Promise<Result<String>> {
    try {
      await manager.client.refreshToken.delete({ where: { refreshToken } });

      return Promise.resolve({ success: true, data: 'Sesi??n cerrada correctamente!' });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Error al cerrar sesi??n.',
        statusCode: 500,
      }));
    }
  }

  async refreshToken(userTokens: UserTokens): Promise<Result<UserTokens>> {
    try {
      const tokens = await manager.client.refreshToken.findUnique({
        where: { refreshToken: userTokens.refreshToken },
      });

      if (!tokens) {
        return Promise.reject(new AppError({
          message: 'El token de refresco no existe.',
          statusCode: 404,
        }));
      }

      const refreshed = await tokenManager.refreshToken(userTokens.refreshToken);

      await manager.client.refreshToken.update({
        where: { refreshToken: userTokens.refreshToken },
        data: { token: refreshed },
      });

      userTokens.token = refreshed;

      return Promise.resolve({ success: true, data: userTokens });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Error al refrescar token.',
        statusCode: 500,
      }));
    }
  }

  async recoverPassword(birthdate: Date, identification: string): Promise<Result<string>> {
    try {
      const user = await UserValidator.checkIfUserExistByIdentification(identification);

      // Validate birthdate
      const date = new Date(birthdate);
      if (Number.isNaN(date.getTime())) {
        return Promise.reject(new AppError({
          message: 'La fecha de nacimiento es inv??lida.',
          statusCode: 400,
        }));
      }
      let fullname = '';

      switch (user.role) {
        case Role.DOCTOR: {
          if (user.doctor?.birthdate.getTime() !== date.getTime()) {
            return Promise.reject(new AppError({
              message: 'No se encontr?? un usuario con la fecha de nacimiento ingresada',
              statusCode: 400,
            }));
          }
          const { doctor } = user;
          fullname = `${doctor.firstName.split(' ')[0]} ${doctor.lastName.split(' ')[0]}`;
          break;
        }
        case Role.PATIENT: {
          if (user.patient?.birthdate.getTime() !== date.getTime()) {
            return Promise.reject(new AppError({
              message: 'No se encontr?? un usuario con la fecha de nacimiento ingresada',
              statusCode: 400,
            }));
          }
          const { patient } = user;
          fullname = `${patient.firstName.split(' ')[0]} ${patient.lastName.split(' ')[0]}`;
          break;
        }
      }

      const tempPass = randomBytes(6).toString('hex');
      const hashedPass = await bcrypt.hash(tempPass, 10);

      await MailingService.getConnection().sendRecoverPasswordMail(
        user.email,
        tempPass,
        fullname,
      );

      await manager.client.user.update({
        where: { identification },
        data: {
          password: hashedPass,
        },
      });

      return Promise.resolve({
        success: true,
        data: `Se ha enviado la nueva contrase??a al correo ${user.email}`,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Error al recuperar contrase??a.',
        statusCode: 500,
      }));
    }
  }

  async updatePassword(
    identification: string,
    newPassword: string,
    oldPassword: string,
  ): Promise<Result<string>> {
    try {
      const user = await UserValidator.checkIfUserExistByIdentification(identification);

      // Validate old password
      const isValid = await bcrypt.compare(oldPassword, user.password);

      if (!isValid) {
        return Promise.reject(new AppError({
          message: 'La contrase??a antigua ingresada es incorrecta.',
          statusCode: 400,
        }));
      }

      const hashedNewPass = await bcrypt.hash(newPassword, 10);

      await manager.client.user.update({
        where: { identification },
        data: {
          password: hashedNewPass,
        },
      });

      return Promise.resolve({
        success: true,
        data: 'Se ha actualizado la contrase??a',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Error al recuperar contrase??a.',
        statusCode: 500,
      }));
    }
  }
}
