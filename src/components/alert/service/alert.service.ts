import { DailyReport, Role } from '@prisma/client';
import AppError from '../../../error/app.error';
import { Payload, Result } from '../../../types/types';
import { clearData } from '../../../utils/clear.response';
import { manager } from '../../../utils/prisma.manager';
import { DailyReportValidator } from '../../dailyReport/validator/daily.validator';
import { MonitoringPlanValidator } from '../../monitoring/validator/monitoring.validator';
import { UserValidator } from '../../user/validator/user.validator';

export class AlertService {
  async getSelfAlerts(
    payload: Payload,
  ): Promise<Result<DailyReport[]>> {
    try {
      const data = await manager.client.alert.findMany({
        where: {
          dailyReport: {
            monitoringPlan: {
              ...(payload.role === Role.DOCTOR ? {
                doctor: { userId: payload.id },
              } : {}),
              ...(payload.role === Role.PATIENT ? {
                patient: { userId: payload.id },
              } : {}),
            },
          },
        },
        include: {
          dailyReport: {
            include: {
              monitoringPlan: {
                select: {
                  emergencyType: true,
                  priority: true,
                  ...(payload.role === Role.DOCTOR ? {
                    patient: {
                      select: {
                        id: true, firstName: true, lastName: true, phone: true,
                      },
                    },
                  } : {}),
                  ...(payload.role === Role.PATIENT ? {
                    doctor: {
                      select: {
                        id: true, firstName: true, lastName: true, phone: true,
                      },
                    },
                  } : {}),
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const cleared = clearData(data);
      return Promise.resolve({ success: true, data: cleared });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }

  async getAlertsFromReport(
    payload: Payload,
    reportId: number
  ): Promise<Result<DailyReport[]>> {
    try {
      // Check if report exist
      if (payload.role === Role.DOCTOR) {
        await DailyReportValidator.checkIfExistWithDoctor(reportId, payload.id);
      } else {
        await DailyReportValidator.checkIfExistWithPatient(reportId, payload.id);
      }

      // Check if alerts exist
      const alerts = await manager.client.alert.findMany({
        where: {
          AND: {
            dailyReport: {
              monitoringPlan: {
                ...(payload.role === Role.DOCTOR ? {
                  doctor: { userId: payload.id },
                } : {}),
                ...(payload.role === Role.PATIENT ? {
                  patient: { userId: payload.id },
                } : {}),
              },
            },
            dailyReportId: reportId,
          },
        },
        include: {
          dailyReport: {
            include: {
              monitoringPlan: {
                select: {
                  emergencyType: true,
                  priority: true,
                  ...(payload.role === Role.DOCTOR ? {
                    patient: {
                      select: {
                        id: true, firstName: true, lastName: true, phone: true,
                      },
                    },
                  } : {}),
                  ...(payload.role === Role.PATIENT ? {
                    doctor: {
                      select: {
                        id: true, firstName: true, lastName: true, phone: true,
                      },
                    },
                  } : {}),
                },
              },
            },
          },
        },
      });

      const cleared = clearData(alerts ?? []);
      return Promise.resolve({ success: true, data: cleared });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }

  async getAlertsFromMonitoringPlan(
    payload: Payload,
    planId: number
  ): Promise<Result<DailyReport[]>> {
    try {
      // Check if monitoring plan exist
      if (payload.role === Role.DOCTOR) {
        await MonitoringPlanValidator.checkIfPlanExistWithDoctor(planId, payload.id);
      } else {
        await MonitoringPlanValidator.checkIfPlanExistWithPatient(planId, payload.id);
      }

      // Check if alerts exist
      const alerts = await manager.client.alert.findMany({
        where: {
          dailyReport: {
            monitoringPlan: {
              id: planId,
              ...(payload.role === Role.DOCTOR ? {
                doctor: { userId: payload.id },
              } : {}),
              ...(payload.role === Role.PATIENT ? {
                patient: { userId: payload.id },
              } : {}),
            },
          },
        },
        include: {
          dailyReport: {
            include: {
              monitoringPlan: {
                select: {
                  emergencyType: true,
                  priority: true,
                  ...(payload.role === Role.DOCTOR ? {
                    patient: {
                      select: {
                        id: true, firstName: true, lastName: true, phone: true,
                      },
                    },
                  } : {}),
                  ...(payload.role === Role.PATIENT ? {
                    doctor: {
                      select: {
                        id: true, firstName: true, lastName: true, phone: true,
                      },
                    },
                  } : {}),

                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const cleared = clearData(alerts ?? []);
      return Promise.resolve({ success: true, data: cleared });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }

  async getAlertsFromPatient(
    payload: Payload,
    patientId: number,
  ): Promise<Result<DailyReport>> {
    try {
      // Check if patient exist
      await UserValidator.checkIfPatientExist(patientId);

      const data = await manager.client.alert.findMany({
        where: {
          dailyReport: {
            monitoringPlan: {
              doctor: { userId: payload.id },
              patient: { userId: patientId },
            },
          },
        },
        include: {
          dailyReport: {
            include: {
              monitoringPlan: {
                select: {
                  emergencyType: true,
                  priority: true,
                  patient: {
                    select: {
                      id: true, firstName: true, lastName: true, phone: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const cleared = clearData(data ?? []);
      return Promise.resolve({ success: true, data: cleared });
    } catch (error) {
      if (error instanceof AppError) {
        return Promise.reject(error);
      }
      return Promise.reject(new AppError({ message: 'Ocurrio un error', statusCode: 500 }));
    }
  }
}
