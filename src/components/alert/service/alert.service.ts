import { DailyReport } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import AppError from '../../../error/app.error';
import { Payload, Result } from '../../../types/types';
import { clearData } from '../../../utils/clear.response';
import { getDateOnly } from '../../../utils/date.utils';
import { manager } from '../../../utils/prisma.manager';
import { MonitoringPlanValidator } from '../../monitoring/validator/monitoring.validator';
import { UserValidator } from '../../user/validator/user.validator';

export class AlertService {
  async getSelfDailyReport(
    selectedDate: Date,
    payload: Payload,
    planId: number,
  ): Promise<Result<DailyReport>> {
    try {
      // Validate date
      let date = new Date(selectedDate);
      if (Number.isNaN(date.getTime())) {
        return Promise.reject(new AppError({
          message: 'La fecha ingresada es inválida.',
          statusCode: 400,
        }));
      }

      date = getDateOnly(date);
      if (date.getTime() > (new Date()).getTime()) {
        return Promise.reject(new AppError({
          message: 'No se puede obetener el reporte de una fecha futura.',
          statusCode: 400,
        }));
      }

      // Check if plan exist
      await MonitoringPlanValidator.checkIfPlanExistWithPatient(
        planId, payload.id
      );

      const data = await manager.client.dailyReport.findFirst({
        where: {
          monitoringPlanId: planId,
          createdAt: date,
        },
      });

      if (data == null) {
        return Promise.reject(new AppError({
          message: 'No se encontró un reporte para la fecha indicada.',
          statusCode: 404,
        }));
      }

      const cleared = clearData(data);
      return Promise.resolve({ success: true, data: cleared });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        return Promise.reject(new AppError({
          message: 'Es necesario completar los campos obligatorios.',
          statusCode: 400,
        }));
      }
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }

  async getDailyReportFromPatient(
    selectedDate: Date,
    planId: number,
    patientId: number,
  ): Promise<Result<DailyReport>> {
    try {
      // Validate date
      let date = new Date(selectedDate);
      if (Number.isNaN(date.getTime())) {
        return Promise.reject(new AppError({
          message: 'La fecha ingresada es inválida.',
          statusCode: 400,
        }));
      }

      date = getDateOnly(date);
      if (date.getTime() > (new Date()).getTime()) {
        return Promise.reject(new AppError({
          message: 'No se puede obetener el reporte de una fecha futura.',
          statusCode: 400,
        }));
      }

      // Check if patient exist
      await UserValidator.checkIfPatientExist(patientId);

      // Check if plan exist
      await MonitoringPlanValidator.checkIfPlanExistWithPatient(
        planId, patientId
      );

      const data = await manager.client.dailyReport.findFirst({
        where: {
          monitoringPlanId: planId,
          createdAt: date,
        },
      });

      if (data == null) {
        return Promise.reject(new AppError({
          message: 'El paciente aún no ha emitido un reporte para la fecha indicada.',
          statusCode: 404,
        }));
      }

      const cleared = clearData(data);
      return Promise.resolve({ success: true, data: cleared });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }
}
