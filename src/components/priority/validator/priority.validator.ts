import { PriorityType } from '@prisma/client';
import AppError from '../../../error/app.error';
import { manager } from '../../../utils/prisma.manager';

export class PriorityTypeValidator {
  static async checkIfPriorityExist(id: number): Promise<PriorityType> {
    try {
      const data = await manager.client.priorityType.findUnique({ where: { id } });
      return Promise.resolve(data!);
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }
}
