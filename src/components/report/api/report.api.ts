import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleGetPlansByEmergencyReport,
  handleGetPlansByPriorityReport,
} from '../controller/report.controller';

const router = Router();

// Get plans
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

export { router as reportApi };
