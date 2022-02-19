import { MedicalCenter } from '@prisma/client';
import AppError from '../../../error/app.error';
import { manager } from '../../../utils/prisma.manager';

export class MedicalCenterValidator {
  static async checkIfCenterExist(id: number): Promise<MedicalCenter> {
    try {
      const data = await manager.client.medicalCenter.findUnique({ where: { id } });
      return Promise.resolve(data!);
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }
}
