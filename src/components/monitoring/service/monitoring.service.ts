import { MonitoringPlan, Role } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import AppError from '../../../error/app.error';
import { CRUDService } from '../../../interface/crud.service.interface';
import { Payload, Result } from '../../../types/types';
import { clearData } from '../../../utils/clear.response';
import { getDateOnly } from '../../../utils/date.utils';
import { manager } from '../../../utils/prisma.manager';
import { EmergencyTypeValidator } from '../../emergencyType/validator/emergency.type.validator';
import { PriorityTypeValidator } from '../../priority/validator/priority.validator';
import { UserValidator } from '../../user/validator/user.validator';
import { MonitoringPlanValidator } from '../validator/monitoring.validator';

export class MonitoringService implements CRUDService<MonitoringPlan> {
  async get(id: number): Promise<Result<MonitoringPlan>> {
    try {
      const monitoring = await manager.client.monitoringPlan.findUnique({
        where: { id },
      });

      const res = clearData(monitoring);

      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener el plan de monitoreo.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getAll(): Promise<Result<MonitoringPlan[]>> {
    try {
      const plans = await manager.client.monitoringPlan.findMany({});

      const res = clearData(plans);

      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener los planes de monitoreo.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async create(data: MonitoringPlan): Promise<Result<MonitoringPlan>> {
    try {
      // Check if doctor exists
      if (!data.doctorId) {
        return Promise.reject(new AppError({
          message: 'No se incluyo un id de médico.',
          statusCode: 400,
        }));
      }
      const doctor = await UserValidator.checkIfDoctorExist(data.doctorId);

      // Check if patient exists
      if (!data.patientId) {
        return Promise.reject(new AppError({
          message: 'No se incluyo un id de paciente.',
          statusCode: 400,
        }));
      }
      const patient = await UserValidator.checkIfPatientExist(data.patientId);

      // Check if priority exists
      if (!data.priorityTypeId) {
        return Promise.reject(new AppError({
          message: 'No se incluyo un id de tipo de prioridad.',
          statusCode: 400,
        }));
      }
      await PriorityTypeValidator.checkIfPriorityExist(data.priorityTypeId);

      // Check if emergency exists
      if (!data.emergencyTypeId) {
        return Promise.reject(new AppError({
          message: 'No se incluyo un id de tipo de emergencia.',
          statusCode: 400,
        }));
      }
      await EmergencyTypeValidator.checkIfEmergencyExist(data.emergencyTypeId);

      // Validate dates
      await MonitoringPlanValidator.validateDates(data.startDate, data.endDate);
      data.startDate = getDateOnly(new Date(data.startDate));
      data.endDate = getDateOnly(new Date(data.endDate));

      const plan = await manager.client.monitoringPlan.create({
        data: {
          code: Number(data.code),
          endDate: data.endDate,
          startDate: data.startDate,
          patient: { connect: { id: patient.id } },
          doctor: { connect: { id: doctor.id } },
          priority: { connect: { id: data.priorityTypeId } },
          emergencyType: { connect: { id: data.emergencyTypeId } },
        },
      });

      return Promise.resolve({ success: true, data: plan });
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
      const message = 'Error al crear el plan de monitoreo.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async delete(id: number): Promise<Result<Boolean>> {
    try {
      await MonitoringPlanValidator.checkIfPlanExist(id);

      await manager.client.monitoringPlan.delete({ where: { id } });

      return Promise.resolve({ success: true, data: true });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al eliminar el plan de monitoreo.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async update(id: number, data: MonitoringPlan): Promise<Result<MonitoringPlan>> {
    try {
      const monitoring = await MonitoringPlanValidator.checkIfPlanExist(id);
      let doctor;
      let patient;

      // Check if doctor exists
      if (data.doctorId) {
        doctor = await UserValidator.checkIfDoctorExist(data.doctorId);
      }

      // Check if patient exists
      if (data.patientId) {
        patient = await UserValidator.checkIfPatientExist(data.patientId);
      }

      // Check if priority exists
      if (data.priorityTypeId) {
        await PriorityTypeValidator.checkIfPriorityExist(data.priorityTypeId);
      }

      // Check if emergency exists
      if (data.emergencyTypeId) {
        await EmergencyTypeValidator.checkIfEmergencyExist(data.emergencyTypeId);
      }

      // Validate dates
      data.startDate = data.startDate ? new Date(data.startDate) : monitoring.startDate;
      data.endDate = data.endDate ? new Date(data.endDate) : monitoring.endDate;
      await MonitoringPlanValidator.validateDates(data.startDate, data.endDate);

      const plan = await manager.client.monitoringPlan.update({
        data: {
          code: data.code,
          endDate: data.endDate,
          startDate: data.startDate,
          patientId: patient?.id,
          doctorId: doctor?.id,
          priorityTypeId: data.priorityTypeId,
          emergencyTypeId: data.emergencyTypeId,
        },
        where: { id },
      });

      return Promise.resolve({ success: true, data: plan });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al actualizar el plan de monitoreo.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getSelfPlans(payload: Payload, active: Boolean = false): Promise<Result<MonitoringPlan[]>> {
    try {
      const plans = await manager.client.monitoringPlan.findMany({
        where: {
          ...(payload.role === Role.PATIENT ? { patient: { userId: payload.id } } : {}),
          ...(payload.role === Role.DOCTOR ? { doctor: { userId: payload.id } } : {}),
          ...(active ? {
            OR: {
              endDate: { gte: new Date() },
              startDate: { lte: new Date() },
            },
          } : {}),
        },
        include: {
          doctor: true,
          patient: true,
          emergencyType: true,
          priority: true,
        },
      });

      return Promise.resolve({ success: true, data: plans });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al los planes de monitoreo.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getPlan(payload: Payload, id: number): Promise<Result<MonitoringPlan>> {
    try {
      const plan = await manager.client.monitoringPlan.findFirst({
        where: {
          id,
          ...(payload.role === Role.PATIENT ? { patient: { userId: payload.id } } : {}),
        },
        include: {
          doctor: true,
          patient: true,
          emergencyType: true,
          priority: true,
        },
      });

      const res = clearData(plan);

      return Promise.resolve({ success: true, data: res });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al obtener el plan de monitoreo.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }

  async getPatientHistory(
    payload: Payload,
    patientId: number,
    active: Boolean = false,
    self: Boolean = false,
  ): Promise<Result<MonitoringPlan[]>> {
    try {
      const plans = await manager.client.monitoringPlan.findMany({
        where: {
          patient: { userId: patientId },
          ...(self ? { doctor: { userId: payload.id } } : {}),
          ...(active ? {
            OR: {
              endDate: { gte: new Date() },
              startDate: { lte: new Date() },
            },
          } : {}),
        },
        include: {
          doctor: true,
          patient: true,
          emergencyType: true,
          priority: true,
        },
      });

      return Promise.resolve({ success: true, data: plans });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      const message = 'Error al los planes de monitoreo.';
      return Promise.reject(new AppError({ message, statusCode: 500 }));
    }
  }
}
