import { Prisma } from '@prisma/client';
import AppError from '../../../error/app.error';
import { Payload, Result } from '../../../types/types';
import { manager } from '../../../utils/prisma.manager';

export class ReportService {
  async getPlansByPriorityReport(
    payload: Payload,
    active: Boolean = false,
  ): Promise<Result<any[]>> {
    try {
      const plans = await manager.client.$queryRaw<any[]>(
        Prisma.sql`SELECT p.id, p.name, Count(*) as 'count' 
        FROM monitoring_db.monitoringplan m 
        inner join monitoring_db.prioritytype p  
        on m.priorityTypeId = p.id
        inner join monitoring_db.doctor d 
        on d.userId = ${payload.id}
        where m.doctorId = d.id and 
        m.endDate >= ${(active) ? new Date() : ''}
        group by m.priorityTypeId`
      );

      const count = await manager.client.monitoringPlan.count({
        where: {
          doctor: { userId: payload.id },
          ...(active ? {
            OR: {
              endDate: { gte: new Date() },
              startDate: { lte: new Date() },
            },
          } : {}),
        },
        select: {
          _all: true,
        },
      });

      return Promise.resolve({ success: true, data: plans, params: { total: count._all } });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener el reporte.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getPlansByEmergencyReport(
    payload: Payload,
    active: Boolean = false,
  ): Promise<Result<any[]>> {
    try {
      const plans = await manager.client.$queryRaw<any[]>(
        Prisma.sql`SELECT e.id, e.name, Count(*) as 'count' 
        FROM monitoring_db.monitoringplan m 
        inner join monitoring_db.emergencytype e  
        on m.emergencyTypeId = e.id
        inner join monitoring_db.doctor d 
        on d.userId = ${payload.id}
        where m.doctorId = d.id and 
        m.endDate >= ${(active) ? new Date() : ''}
        group by m.emergencyTypeId`
      );
      const count = await manager.client.monitoringPlan.count({
        where: {
          doctor: { userId: payload.id },
          ...(active ? {
            OR: {
              endDate: { gte: new Date() },
              startDate: { lte: new Date() },
            },
          } : {}),
        },
        select: {
          _all: true,
        },
      });

      return Promise.resolve({ success: true, data: plans, params: { total: count._all } });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener el reporte.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }
}
