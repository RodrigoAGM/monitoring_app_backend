import { Router } from 'express';
import {
  handleDoctorSignIn,
  handlePatientSignIn,
  handleRefreshToken,
  handleRegisterDoctor,
  handleRegisterPatient,
  handleSignOut,
} from '../controller/auth.controller';

const router = Router();

// SignUp
router.post('/signup/patient', handleRegisterPatient);
router.post('/signup/doctor', handleRegisterDoctor);

// SignIn
router.post('/signin/patient', handlePatientSignIn);
router.post('/signin/doctor', handleDoctorSignIn);

// SignOut
router.delete('/signout/:refreshToken', handleSignOut);

// Token
router.post('/token/refresh', handleRefreshToken);

export { router as authApi };
