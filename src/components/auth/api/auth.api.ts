import { Router } from 'express';
import { handleRegisterDoctor, handleRegisterPatient } from '../controller/auth.controller';

const router = Router();

// Register
router.post('/register/patient', handleRegisterPatient);
router.post('/register/doctor', handleRegisterDoctor);

export { router as authApi };
