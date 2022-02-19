import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleGetSelf,
  handleFindPatient,
  handleUpdateUser,
} from '../controller/user.controller';

const router = Router();

// Query
router.get('/self', authenticateToken, handleGetSelf);
router.get(
  '/patient/:identification',
  authenticateToken,
  authenticateRole([Role.ADMIN, Role.DOCTOR]),
  handleFindPatient
);

// Update
router.put('/:id', authenticateToken, handleUpdateUser);

export { router as userApi };
