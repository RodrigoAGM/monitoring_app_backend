import { EmergencyType } from '@prisma/client';
import AppError from '../../../error/app.error';
import { manager } from '../../../utils/prisma.manager';

export class EmergencyTypeValidator {
  static async checkIfEmergencyExist(id: number): Promise<EmergencyType> {
    try {
      const data = await manager.client.emergencyType.findUnique({ where: { id } });
      return Promise.resolve(data!);
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }
}
