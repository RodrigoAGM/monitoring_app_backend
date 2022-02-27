import { Prisma } from '@prisma/client';
import AppError from '../../../error/app.error';
import { Payload, Result } from '../../../types/types';
import { getDateOnlyStr } from '../../../utils/date.utils';
import { manager } from '../../../utils/prisma.manager';
import { EmergencyTypeValidator } from '../../emergencyType/validator/emergency.type.validator';
import { PriorityTypeValidator } from '../../priority/validator/priority.validator';
import { validateFromDate, validateToDate } from '../report.validator';

export class ReportService {
  async getPlansByPriorityReport(
    payload: Payload,
    active: Boolean = true,
    from?: string | number,
  ): Promise<Result<any[]>> {
    try {
      const currentDate = validateFromDate(from);

      let query;
      if (active) {
        query = Prisma.sql`SELECT p.id, p.name, Count(*) as 'count' 
        FROM monitoringplan m 
        inner join prioritytype p on m.priorityTypeId = p.id
        inner join doctor d on d.userId = ${payload.id}
        where m.doctorId = d.id and m.endDate >= ${currentDate}
        and m.startDate <= ${currentDate} group by m.priorityTypeId`;
      } else {
        query = Prisma.sql`SELECT p.id, p.name, Count(*) as 'count' 
        FROM monitoringplan m 
        inner join prioritytype p on m.priorityTypeId = p.id
        inner join doctor d on d.userId = ${payload.id}
        where m.doctorId = d.id group by m.priorityTypeId`;
      }

      const plans = await manager.client.$queryRaw<any[]>(query);

      const count = await manager.client.monitoringPlan.count({
        where: {
          doctor: { userId: payload.id },
          ...(active ? {
            AND: {
              endDate: { gte: currentDate },
              startDate: { lte: currentDate },
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
    active: Boolean = true,
    from?: string | number,
  ): Promise<Result<any[]>> {
    try {
      const currentDate = validateFromDate(from);

      let query;
      if (active) {
        query = Prisma.sql`SELECT e.id, e.name, Count(*) as 'count' 
        FROM monitoringplan m 
        inner join emergencytype e on m.emergencyTypeId = e.id
        inner join doctor d on d.userId = ${payload.id}
        where m.doctorId = d.id and m.endDate >= ${currentDate}
        and m.startDate <= ${currentDate} group by m.emergencyTypeId`;
      } else {
        query = Prisma.sql`SELECT e.id, e.name, Count(*) as 'count' 
        FROM monitoringplan m 
        inner join emergencytype e on m.emergencyTypeId = e.id 
        inner join doctor d on d.userId = ${payload.id} 
        where m.doctorId = d.id group by m.emergencyTypeId`;
      }

      const plans = await manager.client.$queryRaw<any[]>(query);
      const count = await manager.client.monitoringPlan.count({
        where: {
          doctor: { userId: payload.id },
          ...(active ? {
            AND: {
              endDate: { gte: currentDate },
              startDate: { lte: currentDate },
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

  async getPatientsByPriority(
    payload: Payload,
    priorityId: number,
    active: Boolean = true,
    from?: string | number,
  ): Promise<Result<any[]>> {
    try {
      await PriorityTypeValidator.checkIfPriorityExist(priorityId);

      const currentDate = validateFromDate(from);

      const patients = await manager.client.monitoringPlan.findMany({
        where: {
          doctor: { userId: payload.id },
          ...(active ? {
            AND: {
              endDate: { gte: currentDate },
              startDate: { lte: currentDate },
            },
          } : {}),
          priorityTypeId: priorityId,
        },
        select: {
          patient: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
              user: { select: { identification: true, id: true } },
            },
          },
          priority: true,
          startDate: true,
          endDate: true,
        },
        orderBy: { startDate: 'desc' },
      });

      return Promise.resolve({ success: true, data: patients });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener los pacientes.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getPatientsByEmergency(
    payload: Payload,
    emergencyId: number,
    active: Boolean = true,
    from?: string | number,
  ): Promise<Result<any[]>> {
    try {
      await EmergencyTypeValidator.checkIfEmergencyExist(emergencyId);

      const currentDate = validateFromDate(from);

      const patients = await manager.client.monitoringPlan.findMany({
        where: {
          doctor: { userId: payload.id },
          ...(active ? {
            AND: {
              endDate: { gte: currentDate },
              startDate: { lte: currentDate },
            },
          } : {}),
          emergencyTypeId: emergencyId,
        },
        select: {
          patient: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
              user: { select: { identification: true, id: true } },
            },
          },
          emergencyType: true,
          startDate: true,
          endDate: true,
        },
        orderBy: { startDate: 'desc' },
      });

      return Promise.resolve({ success: true, data: patients });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener los pacientes.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getDailyReportDayResume(
    payload: Payload,
    active: Boolean = true,
    from?: string | number,
  ): Promise<Result<any[]>> {
    try {
      const currentDate = validateFromDate(from);
      const strDate = getDateOnlyStr(currentDate);

      let query;
      if (active) {
        query = Prisma.sql`select T.status, count(*) as 'total' from (
          SELECT m.id, m.patientId, t.db_date, patient.firstName, patient.lastName,
          case when(d.id is null) then 'NOT REPORTED' else 'REPORTED' end as 'status'
          FROM monitoringplan m 
          inner join doctor doc on doc.id = m.doctorId
          left join timedimension t on t.db_date = ${strDate}
          left join dailyreport d on d.monitoringPlanId = m.id and DATE(d.createdAt) = t.db_date
          right join patient on patient.id = m.patientId
          where t.db_date between m.startDate and m.endDate and doc.userId = ${payload.id}
          group by m.id, t.db_date) as T group by T.status`;
      } else {
        query = Prisma.sql`select T.status, count(*) as 'total' from (
          SELECT m.id, m.patientId, t.db_date, patient.firstName, patient.lastName,
          case when(d.id is null) then 'NOT REPORTED' else 'REPORTED' end as 'status'
          FROM monitoringplan m 
          inner join doctor doc on doc.id = m.doctorId
          left join timedimension t on t.db_date = ${strDate}
          left join dailyreport d on d.monitoringPlanId = m.id and DATE(d.createdAt) = t.db_date
          right join patient on patient.id = m.patientId
          and doc.userId = ${payload.id}
          group by m.id, t.db_date) as T group by T.status`;
      }

      const resume = await manager.client.$queryRaw<any[]>(query);

      return Promise.resolve({ success: true, data: resume });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener el reporte.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getPatientsByStatus(
    payload: Payload,
    active: Boolean = true,
    from?: string | number,
    to?: string | number,
  ): Promise<Result<any[]>> {
    try {
      const fromDate = validateFromDate(from);
      const toDate = validateToDate(to, fromDate);

      const fromDateStr = getDateOnlyStr(fromDate);
      const toDateStr = getDateOnlyStr(toDate);

      let query;
      if (active) {
        query = Prisma.sql`SELECT m.id as 'monitoringPlanId', m.patientId, patient.userId,
        t.db_date as 'date', patient.firstName, patient.lastName,
        case when(d.id is null) then 'NOT REPORTED' else 'REPORTED' end as 'status'
        FROM monitoringplan m 
        inner join doctor doc on doc.id = m.doctorId
        left join timedimension t on t.db_date between ${fromDateStr} and ${toDateStr}
        left join dailyreport d on d.monitoringPlanId = m.id and DATE(d.createdAt) = t.db_date
        right join patient on patient.id = m.patientId
        where t.db_date between m.startDate and m.endDate and doc.userId = ${payload.id}
        group by m.id, t.db_date
        order by date asc, monitoringPlanId asc`;
      } else {
        query = Prisma.sql`SELECT m.id as 'monitoringPlanId', m.patientId, patient.userId,
        t.db_date as 'date', patient.firstName, patient.lastName,
        case when(d.id is null) then 'NOT REPORTED' else 'REPORTED' end as 'status'
        FROM monitoringplan m 
        inner join doctor doc on doc.id = m.doctorId
        left join timedimension t on t.db_date between ${fromDateStr} and ${toDateStr}
        left join dailyreport d on d.monitoringPlanId = m.id and DATE(d.createdAt) = t.db_date
        right join patient on patient.id = m.patientId
        where doc.userId = ${payload.id}
        group by m.id, t.db_date
        order by date asc, monitoringPlanId asc`;
      }

      const resume = await manager.client.$queryRaw<any[]>(query);

      return Promise.resolve({ success: true, data: resume });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener el reporte.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }
}
