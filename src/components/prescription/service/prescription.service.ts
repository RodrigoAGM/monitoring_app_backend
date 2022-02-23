import { Prescription, Role } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import AppError from '../../../error/app.error';
import { Payload, Result } from '../../../types/types';
import { clearData } from '../../../utils/clear.response';
import { manager } from '../../../utils/prisma.manager';
import { MonitoringPlanValidator } from '../../monitoring/validator/monitoring.validator';

export class PrescriptionService {
  async get(id: number, payload: Payload): Promise<Result<Prescription>> {
    try {
      const prescription = await manager.client.prescription.findFirst({
        where: {
          id,
          ...(payload.role === Role.PATIENT ? {
            monitoringPlan: {
              patient: {
                userId: payload.id,
              },
            },
          } : {}),
        },
      });

      const cleared = clearData(prescription);

      return Promise.resolve({
        success: true,
        data: cleared,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener la receta.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getSelf(payload: Payload): Promise<Result<Prescription[]>> {
    try {
      const prescription = await manager.client.prescription.findMany({
        where: {
          ...(payload.role === Role.PATIENT ? {
            monitoringPlan: {
              patient: {
                userId: payload.id,
              },
            },
          } : {}),
          ...(payload.role === Role.DOCTOR ? {
            monitoringPlan: {
              doctor: {
                userId: payload.id,
              },
            },
          } : {}),
        },
      });

      const cleared = clearData(prescription);

      return Promise.resolve({
        success: true,
        data: cleared,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener la receta.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getFromPlan(planId: number, payload: Payload): Promise<Result<Prescription>> {
    try {
      const prescription = await manager.client.prescription.findFirst({
        where: {
          monitoringPlan: {
            id: planId,
            ...(payload.role === Role.PATIENT ? {
              patient: { userId: payload.id },
            } : {}),
          },
        },
      });

      const cleared = clearData(prescription);

      return Promise.resolve({
        success: true,
        data: cleared,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener la receta.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async create(
    payload: Payload,
    planId: number,
    data: Prescription,
    medicines: string[],
  ): Promise<Result<Prescription>> {
    try {
      await MonitoringPlanValidator.checkIfPlanExistWithDoctor(planId, payload.id);

      const prescription = await manager.client.prescription.create({
        data: {
          code: data.code,
          instructions: data.instructions,
          monitoringPlan: { connect: { id: planId } },
          medicine1: medicines.at(0) ?? '',
          medicine2: medicines.at(1) ?? '',
          medicine3: medicines.at(2) ?? '',
          medicine4: medicines.at(3) ?? '',
          medicine5: medicines.at(4) ?? '',
        },
      });

      const cleared = clearData(prescription);

      return Promise.resolve({
        success: true,
        data: cleared,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return Promise.reject(new AppError({
            message: 'El código ingresado ya se encuentra registrado.',
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
      const message = 'Error al crear la receta.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }
}
