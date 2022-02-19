import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleCreateMedicalCenter,
  handleDeleteMedicalCenter,
  handleGetAllMedicalCenter,
  handleGetMedicalCenter,
  handleUpdateMedicalCenter,
} from '../controller/medical.center.controller';

const router = Router();

// Query
router.get(
  '/:id',
  authenticateToken,
  handleGetMedicalCenter,
);

router.get(
  '/',
  authenticateToken,
  handleGetAllMedicalCenter,
);

router.delete(
  '/:id',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleDeleteMedicalCenter,
);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleCreateMedicalCenter,
);

router.put(
  '/:id',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleUpdateMedicalCenter,
);

export { router as medicalCenterApi };
