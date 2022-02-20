import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleGetSelfPlans,
  handleGetSelfPlan,
  handleCreatePlan,
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
  '/self/:id',
  authenticateToken,
  authenticateRole([Role.DOCTOR, Role.PATIENT]),
  handleGetSelfPlan,
);

// Create
router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  handleCreatePlan,
);

export { router as monitoringApi };
