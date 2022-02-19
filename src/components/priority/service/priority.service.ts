import { PriorityType } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import AppError from '../../../error/app.error';
import { CRUDService } from '../../../interface/crud.service.interface';
import { Result } from '../../../types/types';
import { manager } from '../../../utils/prisma.manager';
import { PriorityTypeValidator } from '../validator/priority.validator';

export class PriorityTypeService implements CRUDService<PriorityType> {
  async get(id: number): Promise<Result<PriorityType>> {
    try {
      const priority = await manager.client.priorityType.findUnique({
        where: { id },
      });

      if (priority == null) {
        const error = new AppError({ message: 'Prioridad no encontrada.', statusCode: 404 });
        return Promise.reject(error);
      }

      return Promise.resolve({ success: true, data: priority });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener la prioridad.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getAll(): Promise<Result<PriorityType[]>> {
    try {
      const priorities = await manager.client.priorityType.findMany();

      return Promise.resolve({ success: true, data: priorities });
    } catch (error) {
      const message = 'Error al obtener las prioridades.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async create(name: string): Promise<Result<PriorityType>> {
    try {
      const res = await manager.client.priorityType.create({
        data: { name },
      });
      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        return Promise.reject(new AppError({
          message: 'Es necesario completar los campos obligatorios.',
          statusCode: 400,
        }));
      }

      const message = 'Error al crear la prioridad.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async delete(id: number): Promise<Result<Boolean>> {
    try {
      // Check if priority type exist
      await PriorityTypeValidator.checkIfPriorityExist(id);

      await manager.client.priorityType.delete({ where: { id } });
      return Promise.resolve({ success: true, data: true });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al eliminar la prioridad.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async update(id: number, name: string): Promise<Result<PriorityType>> {
    try {
      // Check if priority type exist
      await PriorityTypeValidator.checkIfPriorityExist(id);

      const priority = await manager.client.priorityType.update({
        data: { name },
        where: { id },
      });

      return Promise.resolve({ success: true, data: priority });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al actualizar la prioridad.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }
}
