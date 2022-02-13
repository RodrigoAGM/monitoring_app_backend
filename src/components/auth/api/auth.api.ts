import { Router } from 'express';
import {
  handleDoctorSignIn,
  handlePatientSignIn,
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

export { router as authApi };
