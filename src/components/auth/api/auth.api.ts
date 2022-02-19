import { Role } from '.prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../../../middleware/jwt.middleware';
import { authenticateRole } from '../../../middleware/role.middleware';
import {
  handleDoctorSignIn,
  handlePatientSignIn,
  handleAdminSignIn,
  handleRefreshToken,
  handleRegisterDoctor,
  handleRegisterPatient,
  handleSignOut,
} from '../controller/auth.controller';

const router = Router();

// SignUp
router.post(
  '/signup/patient',
  authenticateToken,
  authenticateRole([Role.ADMIN, Role.DOCTOR]),
  handleRegisterPatient
);
router.post(
  '/signup/doctor',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  handleRegisterDoctor,
);

// SignIn
router.post('/signin/patient', handlePatientSignIn);
router.post('/signin/doctor', handleDoctorSignIn);
router.post('/signin/admin', handleAdminSignIn);

// SignOut
router.delete('/signout/:refreshToken', handleSignOut);

// Token
router.post('/token/refresh', handleRefreshToken);

export { router as authApi };
