import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleGetPatientsByEmergency,
  handleGetPatientsByPriority,
  handleGetPlansByEmergencyReport,
  handleGetPlansByPriorityReport,
} from '../controller/report.controller';

const router = Router();

// Get reports
router.get(
  '/priority',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleGetPlansByPriorityReport,
);

router.get(
  '/emergency',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleGetPlansByEmergencyReport,
);

// Get patients
router.get(
  '/patient/priority/:priorityId',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleGetPatientsByPriority,
);

router.get(
  '/patient/emergency/:emergencyId',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleGetPatientsByEmergency,
);

export { router as reportApi };
