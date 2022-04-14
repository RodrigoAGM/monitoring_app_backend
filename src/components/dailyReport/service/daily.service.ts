import { AlertType, DailyReport } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import AppError from '../../../error/app.error';
import { Payload, Result } from '../../../types/types';
import { clearData } from '../../../utils/clear.response';
import { getDateOnly } from '../../../utils/date.utils';
import { manager } from '../../../utils/prisma.manager';
import { MonitoringPlanValidator } from '../../monitoring/validator/monitoring.validator';
import { UserValidator } from '../../user/validator/user.validator';
import { DailyReportValidator } from '../validator/daily.validator';

export class DailyReporService {
  async createReport(
    currentDate: Date,
    payload: Payload,
    planId: number,
    data: DailyReport,
  ): Promise<Result<DailyReport>> {
    try {
      // Validate date
      let date = new Date(currentDate);
      if (Number.isNaN(date.getTime())) {
        return Promise.reject(new AppError({
          message: 'La fecha ingresada es inválida.',
          statusCode: 400,
        }));
      }

      const current = getDateOnly(new Date());
      date = getDateOnly(date);

      if (date.getTime() > current.getTime()) {
        return Promise.reject(new AppError({
          message: 'No se puede crear un reporte para una fecha futura.',
          statusCode: 400,
        }));
      }
      if (date.getTime() < current.getTime()) {
        return Promise.reject(new AppError({
          message: 'No se puede crear un reporte para una fecha pasada.',
          statusCode: 400,
        }));
      }

      // Check if plan exist
      const plan = await MonitoringPlanValidator.checkIfPlanExistWithPatient(
        planId, payload.id
      );

      // Check if plan is still active
      if (date.getTime() > plan.endDate.getTime() || date.getTime() < plan.startDate.getTime()) {
        return Promise.reject(new AppError({
          message: 'No es posible crear un reporte de un plan inactivo.',
          statusCode: 400,
        }));
      }

      // Validate if already registered
      await DailyReportValidator.checkIfAlreadyReported(date, planId);

      // Check possible alerts
      const alerts: { alertType: AlertType }[] = [];

      if (data.heartRate && Number(data.heartRate) > 100) {
        alerts.push({ alertType: AlertType.RITMO_CARDIACO });
      }

      if (data.saturation && Number(data.saturation) < 95) {
        alerts.push({ alertType: AlertType.SATURACION });
      }

      if (data.temperature && Number(data.temperature) > 37) {
        alerts.push({ alertType: AlertType.TEMPERATURA });
      }

      const res = await manager.client.dailyReport.create({
        data: {
          heartRate: data.heartRate,
          saturation: data.saturation,
          temperature: data.temperature,
          discomfort: data.discomfort,
          monitoringPlan: { connect: { id: planId } },
          createdAt: date,
          alerts: {
            createMany: {
              data: alerts,
            },
          },
        },
      });

      const cleared = clearData(res);
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
