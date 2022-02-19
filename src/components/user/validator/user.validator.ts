import { Role } from '@prisma/client';
import AppError from '../../../error/app.error';
import { manager } from '../../../utils/prisma.manager';

export class UserValidator {
  static async checkIfUserExist(id: number, role?: Role) {
    try {
      const data = await manager.client.user.findUnique({
        where: { id, ...(role ? { role } : {}) },
        include: { doctor: true, patient: true },
      });
      return Promise.resolve(data!);
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Ocurrio un error al validar el usuario',
        statusCode: 500,
      }));
    }
  }

  static async checkIfUserExistByIdentification(identification: string, role?: Role) {
    try {
      const data = await manager.client.user.findUnique({
        where: { identification, ...(role ? { role } : {}) },
        include: { doctor: true, patient: true },
      });
      return Promise.resolve(data!);
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Ocurrio un error al validar el usuario',
        statusCode: 500,
      }));
    }
  }
}
