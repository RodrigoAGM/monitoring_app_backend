import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleCreateDailyReport,
  handleGetDailyReport,
  handleGetDailyReportFromPatient,
} from '../../dailyReport/controller/daily.controller';
import { handleCreatePrescription, handleGetFromPlan } from '../../prescription/controller/prescription.controller';
import {
  handleGetSelfPlans,
  handleGetPlan,
  handleCreatePlan,
  handleGetPatientHistory,
} from '../controller/monitoring.controller';

const router = Router();

// Get plans
router.get(
  '/self',
  authenticateToken,
  authenticateRole([Role.DOCTOR, Role.PATIENT]),
  handleGetSelfPlans,
);
router.get(
  '/:id',
  authenticateToken,
  authenticateRole([Role.DOCTOR, Role.PATIENT]),
  handleGetPlan,
);
router.get(
  '/patient/:patientId',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleGetPatientHistory,
);

// Create
router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleCreatePlan,
);

// Prescriptions
router.get(
  '/:planId/prescription',
  authenticateToken,
  authenticateRole([Role.DOCTOR, Role.PATIENT]),
  handleGetFromPlan,
);
router.post(
  '/:planId/prescription',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleCreatePrescription,
);

// DailyReport
router.post(
  '/:planId/daily',
  authenticateToken,
  authenticateRole([Role.PATIENT]),
  handleCreateDailyReport,
);

router.post(
  '/:planId/daily/self',
  authenticateToken,
  authenticateRole([Role.PATIENT]),
  handleGetDailyReport,
);

router.post(
  '/:planId/daily/patient/:patientId',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleGetDailyReportFromPatient,
);

export { router as monitoringApi };
