import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
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

export { router as monitoringApi };
