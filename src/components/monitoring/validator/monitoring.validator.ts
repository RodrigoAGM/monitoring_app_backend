import { MonitoringPlan } from '@prisma/client';
import AppError from '../../../error/app.error';
import { manager } from '../../../utils/prisma.manager';

export class MonitoringPlanValidator {
  static async checkIfPlanExist(id: number): Promise<MonitoringPlan> {
    try {
      const data = await manager.client.monitoringPlan.findFirst({ where: { id } });
      return Promise.resolve(data!);
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Ocurrio un al obetener el plan de monitoreo',
        statusCode: 500,
      }));
    }
  }

  static async checkIfPlanExistWithDoctor(id: number, doctorId: number): Promise<MonitoringPlan> {
    try {
      const data = await manager.client.monitoringPlan.findFirst({
        where: { id },
        include: { doctor: true },
      });

      if (data?.doctor.userId !== doctorId) {
        return Promise.reject(new AppError({
          message: 'No tienes permiso para modificar este plan.',
          statusCode: 403,
        }));
      }

      return Promise.resolve(data!);
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Ocurrio un al obetener el plan de monitoreo',
        statusCode: 500,
      }));
    }
  }

  static async checkIfPlanExistWithPatient(id: number, patientId: number): Promise<MonitoringPlan> {
    try {
      const data = await manager.client.monitoringPlan.findFirst({
        where: {
          id,
          patient: { userId: patientId },
        },
        include: { patient: true },
      });

      return Promise.resolve(data!);
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({
        message: 'Ocurrio un error al obetener el plan de monitoreo',
        statusCode: 500,
      }));
    }
  }

  static async validateDates(startDate: any, endDate: any) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (Number.isNaN(start.getTime())) {
        return Promise.reject(new AppError({
          message: 'La fecha de inicio es inválida.',
          statusCode: 400,
        }));
      }

      if (Number.isNaN(end.getTime())) {
        return Promise.reject(new AppError({
          message: 'La fecha de fin es inválida.',
          statusCode: 400,
        }));
      }

      if (start.getTime() < Date.now()) {
        return Promise.reject(new AppError({
          message: 'La fecha de inicio no puede ser anterior a la fecha actual.',
          statusCode: 400,
        }));
      }

      if (end.getTime() <= start.getTime()) {
        return Promise.reject(new AppError({
          message: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
          statusCode: 400,
        }));
      }
      Promise.resolve(true);
    } catch (error) {
      return Promise.reject(new AppError({
        message: 'Ocurrio un al obetener el plan de monitoreo',
        statusCode: 500,
      }));
    }
  }
}
