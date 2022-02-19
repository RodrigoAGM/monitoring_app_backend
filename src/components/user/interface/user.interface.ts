import { Doctor, Patient, User } from '@prisma/client';

export interface FullUser extends User {
  patient?: Patient,
  doctor?: Doctor,
}
