/* eslint-disable no-return-assign */
import { PrismaClient } from '.prisma/client';
import AppError from '../error/app.error';

class PrismaManager {
  private static _instance: PrismaManager;

  client: PrismaClient;

  private constructor() {
    this.client = new PrismaClient({
      rejectOnNotFound: {
        findFirst: {
          User: () => new AppError({ message: 'El usuario no existe.', statusCode: 404 }),
          RefreshToken: () => new AppError({ message: 'El token de refresco no existe.', statusCode: 404 }),
          EmergencyType: () => new AppError({ message: 'El tipo de emergencia no existe.', statusCode: 404 }),
          PriorityType: () => new AppError({ message: 'El tipo de prioridad no existe.', statusCode: 404 }),
          MedicalCenter: () => new AppError({ message: 'El centro médico no existe.', statusCode: 404 }),
          MonitoringPlan: () => new AppError({ message: 'El plan de monitoreo no existe.', statusCode: 404 }),
          DailyReport: () => new AppError({ message: 'El reporte diario no existe.', statusCode: 404 }),
          Doctor: () => new AppError({ message: 'El médico no existe.', statusCode: 404 }),
          Patient: () => new AppError({ message: 'El paciente no existe.', statusCode: 404 }),
          Prescription: () => new AppError({ message: 'No se encontró receta médica.', statusCode: 404 }),
        },
        findUnique: {
          User: () => new AppError({ message: 'El usuario no existe.', statusCode: 404 }),
          RefreshToken: () => new AppError({ message: 'El token de refresco no existe.', statusCode: 404 }),
          EmergencyType: () => new AppError({ message: 'El tipo de emergencia no existe.', statusCode: 404 }),
          PriorityType: () => new AppError({ message: 'El tipo de prioridad no existe.', statusCode: 404 }),
          MedicalCenter: () => new AppError({ message: 'El centro médico no existe.', statusCode: 404 }),
          MonitoringPlan: () => new AppError({ message: 'El plan de monitoreo no existe.', statusCode: 404 }),
          DailyReport: () => new AppError({ message: 'El reporte diario no existe.', statusCode: 404 }),
          Doctor: () => new AppError({ message: 'El médico no existe.', statusCode: 404 }),
          Patient: () => new AppError({ message: 'El paciente no existe.', statusCode: 404 }),
          Prescription: () => new AppError({ message: 'No se encontró receta médica.', statusCode: 404 }),
        },
      },
    });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}

export const manager = PrismaManager.Instance;
