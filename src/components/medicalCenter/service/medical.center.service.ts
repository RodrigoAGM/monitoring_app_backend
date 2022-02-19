import { MedicalCenter } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import AppError from '../../../error/app.error';
import { CRUDService } from '../../../interface/crud.service.interface';
import { Result } from '../../../types/types';
import { manager } from '../../../utils/prisma.manager';
import { MedicalCenterValidator } from '../validator/medical.center.validator';

export class MedicalCenterService implements CRUDService<MedicalCenter> {
  async get(id: number): Promise<Result<MedicalCenter>> {
    try {
      const medicalCenter = await manager.client.medicalCenter.findUnique({
        where: { id },
      });

      if (medicalCenter == null) {
        const error = new AppError({ message: 'Centro médico no encontrado.', statusCode: 404 });
        return Promise.reject(error);
      }

      return Promise.resolve({ success: true, data: medicalCenter });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener el centro médico.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getAll(): Promise<Result<MedicalCenter[]>> {
    try {
      const emergencies = await manager.client.medicalCenter.findMany();

      return Promise.resolve({ success: true, data: emergencies });
    } catch (error) {
      const message = 'Error al obtener los centros médicos.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async create(data: MedicalCenter): Promise<Result<MedicalCenter>> {
    try {
      const res = await manager.client.medicalCenter.create({
        data: {
          name: data.name,
          address: data.address,
          category: data.category,
          district: data.district,
          province: data.province,
          region: data.region,
        },
      });
      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientValidationError) {
        return Promise.reject(new AppError({
          message: 'Es necesario completar los campos obligatorios.',
          statusCode: 400,
        }));
      }

      const message = 'Error al crear el centro médico.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async delete(id: number): Promise<Result<Boolean>> {
    try {
      // Check if medical center type exist
      await MedicalCenterValidator.checkIfCenterExist(id);

      await manager.client.medicalCenter.delete({ where: { id } });
      return Promise.resolve({ success: true, data: true });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al eliminar el centro médico.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async update(id: number, data: MedicalCenter): Promise<Result<MedicalCenter>> {
    try {
      // Check if medical center type exist
      await MedicalCenterValidator.checkIfCenterExist(id);

      const medicalCenter = await manager.client.medicalCenter.update({
        data: {
          name: data.name,
          address: data.address,
          category: data.category,
          district: data.district,
          province: data.province,
          region: data.region,
        },
        where: { id },
      });

      return Promise.resolve({ success: true, data: medicalCenter });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al actualizar el centro médico.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }
}
