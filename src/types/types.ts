import { UserRole } from '../utils/enums';

export type Result<T> = {
  error?: Error;
  success: boolean;
  data?: T;
  params?: any;
}

// Interface used to parse payload from token
export type Payload = {
  id: number,
  username: string,
  role: UserRole,
  iat?: number,
  exp?: number
}
