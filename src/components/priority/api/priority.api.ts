import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleCreatePriorityType,
  handleDeletePriorityType,
  handleGetAllPriorityType,
  handleGetPriorityType,
  handleUpdatePriorityType,
} from '../controller/priority.controller';

const router = Router();

// Query
router.get(
  '/:id',
  authenticateToken,
  handleGetPriorityType,
);

router.get(
  '/',
  authenticateToken,
  handleGetAllPriorityType,
);

router.delete(
  '/:id',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleDeletePriorityType,
);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleCreatePriorityType,
);

router.put(
  '/:id',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleUpdatePriorityType,
);

export { router as priorityTypeApi };
