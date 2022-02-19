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
        },
        findUnique: {
          User: () => new AppError({ message: 'El usuario no existe.', statusCode: 404 }),
          RefreshToken: () => new AppError({ message: 'El token de refresco no existe.', statusCode: 404 }),
          EmergencyType: () => new AppError({ message: 'El tipo de emergencia no existe.', statusCode: 404 }),
        },
      },
    });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}

export const manager = PrismaManager.Instance;
