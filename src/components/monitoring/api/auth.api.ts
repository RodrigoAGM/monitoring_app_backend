import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
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

export { router as monitoringApi };
