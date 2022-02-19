import { EmergencyType } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import AppError from '../../../error/app.error';
import { CRUDService } from '../../../interface/crud.service.interface';
import { Result } from '../../../types/types';
import { manager } from '../../../utils/prisma.manager';
import { EmergencyTypeValidator } from '../validator/emergency.type.validator';

export class EmergencyTypeService implements CRUDService<EmergencyType> {
  async get(id: number): Promise<Result<EmergencyType>> {
    try {
      const emergencyType = await manager.client.emergencyType.findUnique({
        where: { id },
      });

      if (emergencyType == null) {
        const error = new AppError({ message: 'Tipo de emergencia no encontrado.', statusCode: 404 });
        return Promise.reject(error);
      }

      return Promise.resolve({ success: true, data: emergencyType });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener el tipo de emergencia.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getAll(): Promise<Result<EmergencyType[]>> {
    try {
      const emergencies = await manager.client.emergencyType.findMany();

      return Promise.resolve({ success: true, data: emergencies });
    } catch (error) {
      const message = 'Error al obtener los tipos de emergencia.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async create(name: string): Promise<Result<EmergencyType>> {
    try {
      const res = await manager.client.emergencyType.create({
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

      const message = 'Error al crear el tipo de emergencia.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async delete(id: number): Promise<Result<Boolean>> {
    try {
      await manager.client.emergencyType.delete({ where: { id } });
      return Promise.resolve({ success: true, data: true });
    } catch (error) {
      const message = 'Error al eliminar el tipo de emergencia.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async update(id: number, name: string): Promise<Result<EmergencyType>> {
    try {
      // Check if emergency type exist
      await EmergencyTypeValidator.checkIfEmergencyExist(id);

      const emergencyType = await manager.client.emergencyType.update({
        data: { name },
        where: { id },
      });

      return Promise.resolve({ success: true, data: emergencyType });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al actualizar el tipo de emergencia.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }
}
