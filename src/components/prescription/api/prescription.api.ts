import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleGetPrescription, handleGetSelfPrescription,
} from '../controller/prescription.controller';

const router = Router();

// Get prescription
router.get(
  '/self',
  authenticateToken,
  authenticateRole([Role.DOCTOR, Role.PATIENT]),
  handleGetSelfPrescription,
);
router.get(
  '/:id',
  authenticateToken,
  authenticateRole([Role.DOCTOR, Role.PATIENT]),
  handleGetPrescription,
);

export { router as prescriptionApi };
