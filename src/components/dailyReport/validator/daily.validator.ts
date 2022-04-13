import { DailyReport, Prisma } from '@prisma/client';
import AppError from '../../../error/app.error';
import { getDateOnlyStr } from '../../../utils/date.utils';
import { manager } from '../../../utils/prisma.manager';

export class DailyReportValidator {
  static async checkIfAlreadyReported(currentDate: Date, planId: number): Promise<Boolean> {
    try {
      const data = await manager.client.$queryRaw<DailyReport[] | null>(
        Prisma.sql`SELECT * FROM dailyreport d
         where DATE(d.createdAt) = ${getDateOnlyStr(currentDate)} and d.monitoringPlanId = ${planId};`
      );

      if (data == null || data.length === 0) {
        return Promise.resolve(false);
      }

      return Promise.reject(new AppError({
        message: 'Ya existe un reporte para esta fecha.',
        statusCode: 400,
      }));
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }

  static async checkIfExistWithDoctor(id: number, doctorId: number): Promise<DailyReport> {
    try {
      const data = await manager.client.dailyReport.findFirst({
        where: {
          id,
          monitoringPlan: { doctor: { userId: doctorId } },
        },
      });

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

  static async checkIfExistWithPatient(id: number, patientId: number): Promise<DailyReport> {
    try {
      const data = await manager.client.dailyReport.findFirst({
        where: {
          id,
          monitoringPlan: { patient: { userId: patientId } },
        },
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
}
