import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleGetAlertsFromMonitoringPlan,
  handleGetAlertsFromPatient,
  handleGetAlertsFromReport,
  handleGetSelfAlerts,
} from '../controller/alert.controller';

const router = Router();

// Query
router.get(
  '/self',
  authenticateToken,
  authenticateRole([Role.PATIENT]),
  handleGetSelfAlerts,
);

router.get(
  '/report/:reportId',
  authenticateToken,
  authenticateRole([Role.PATIENT, Role.DOCTOR]),
  handleGetAlertsFromReport,
);

router.get(
  '/plan/:planId',
  authenticateToken,
  authenticateRole([Role.PATIENT, Role.DOCTOR]),
  handleGetAlertsFromMonitoringPlan,
);

router.get(
  '/patient/:patientId',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleGetAlertsFromPatient,
);

router.get(
  '/',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleGetSelfAlerts,
);

export { router as AlertApi };
