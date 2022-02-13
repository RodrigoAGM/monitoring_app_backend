import { Doctor, Patient, User } from '.prisma/client';
import AppError from '../../../error/app.error';
import { CRUDService } from '../../../interface/crud.service.interface';
import { Result } from '../../../types/types';
import { manager } from '../../../utils/prisma.manager';
import { mapToCreateUserQuery } from '../mapper/user.mapper';

export class UserService implements CRUDService<User> {
  async get(id: number): Promise<Result<User>> {
    try {
      const user = await manager.client.user.findUnique({
        where: { id },
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

  async update(id: number, data: User): Promise<Result<User>> {
    try {
      const user = await manager.client.user.update({
        data,
        where: { id },
      });

      return Promise.resolve({ success: true, data: user });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
