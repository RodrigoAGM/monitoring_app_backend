import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleCreateEmergencyType,
  handleDeleteEmergencyType,
  handleGetAllEmergencyType,
  handleGetEmergencyType,
  handleUpdateEmergencyType,
} from '../controller/emergency.type.controller';

const router = Router();

// Query
router.get(
  '/:id',
  authenticateToken,
  handleGetEmergencyType,
);

router.get(
  '/',
  authenticateToken,
  handleGetAllEmergencyType,
);

router.delete(
  '/:id',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleDeleteEmergencyType,
);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleCreateEmergencyType,
);

router.put(
  '/:id',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleUpdateEmergencyType,
);

export { router as emergencyTypeApi };
