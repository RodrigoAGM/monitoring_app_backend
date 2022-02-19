import {
  Doctor,
  Patient,
  Role,
  User,
} from '.prisma/client';
import AppError from '../../../error/app.error';
import { CRUDService } from '../../../interface/crud.service.interface';
import { Payload, Result } from '../../../types/types';
import { clearData } from '../../../utils/clear.response';
import { manager } from '../../../utils/prisma.manager';
import { FullUser } from '../interface/user.interface';
import { mapToCreateUserQuery, mapToUpdateFullUserQuery, mapToUpdateUserQuery } from '../mapper/user.mapper';
import { UserValidator } from '../validator/user.validator';

export class UserService implements CRUDService<User> {
  async get(id: number): Promise<Result<User>> {
    try {
      const user = await manager.client.user.findUnique({
        where: { id },
        include: { patient: true, doctor: { include: { medicalCenter: true } } },
      });

      if (user == null) {
        const error = new AppError({ message: 'Usuario no encontrado.', statusCode: 404 });
        return Promise.reject(error);
      }

      return Promise.resolve({ success: true, data: user });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getAll(): Promise<Result<User[]>> {
    try {
      const user = await manager.client.user.findMany();

      return Promise.resolve({ success: true, data: user });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(data: {
    user: User,
    patient?: Patient,
    doctor?: Doctor,
  }): Promise<Result<User>> {
    try {
      const user = await manager.client.user.create({
        data: mapToCreateUserQuery(
          data.user, data.patient, data.doctor
        ),
        include: { patient: true, doctor: { include: { medicalCenter: true } } },
      });

      return Promise.resolve({ success: true, data: user });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(id: number): Promise<Result<Boolean>> {
    try {
      await manager.client.user.delete({ where: { id } });

      return Promise.resolve({ success: true, data: true });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: number, data: any): Promise<Result<User>> {
    try {
      const user = await manager.client.user.update({
        data,
        where: { id },
        include: { patient: true, doctor: { include: { medicalCenter: true } } },
      });

      return Promise.resolve({ success: true, data: user });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  }

  async getByIdentification(identification: string, role?: Role): Promise<Result<User>> {
    try {
      const user = await UserValidator.checkIfUserExistByIdentification(identification, role);

      if (user == null) {
        const error = new AppError({ message: 'Usuario no encontrado.', statusCode: 404 });
        return Promise.reject(error);
      }

      return Promise.resolve({ success: true, data: user });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Ocurrió un error interno.',
        statusCode: 500,
      }));
    }
  }

  async updateUser(id: number, user: FullUser, payload: Payload): Promise<Result<User>> {
    try {
      const userData = await UserValidator.checkIfUserExist(id);

      if (userData == null) {
        const error = new AppError({ message: 'Usuario no encontrado.', statusCode: 404 });
        return Promise.reject(error);
      }

      // Validate permission
      switch (payload.role) {
        case Role.PATIENT: {
          if (id !== payload.id) {
            const error = new AppError({
              message: 'No tienes permiso para modificar este usuario.',
              statusCode: 403,
            });
            return Promise.reject(error);
          }
          break;
        }
        case Role.DOCTOR: {
          if (userData.role !== Role.PATIENT && id !== payload.id) {
            const error = new AppError({
              message: 'No tienes permiso para modificar este usuario.',
              statusCode: 403,
            });
            return Promise.reject(error);
          }
          break;
        }
      }

      // Remove unnecessary data
      switch (userData.role) {
        case Role.ADMIN: {
          delete user.doctor;
          delete user.patient;
          break;
        }
        case Role.PATIENT: {
          delete user.doctor;
          break;
        }
        case Role.DOCTOR: {
          delete user.patient;
          break;
        }
      }

      const query = (payload.role === Role.ADMIN) ? mapToUpdateFullUserQuery : mapToUpdateUserQuery;

      const res = await this.update(id, query(user, user.patient, user.doctor,));

      const clearRes = clearData(res);
      return Promise.resolve({ success: true, clearRes });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Ocurrió un error interno.',
        statusCode: 500,
      }));
    }
  }
}
