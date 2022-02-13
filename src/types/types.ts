import { Role } from '.prisma/client';

export type Result<T> = {
  error?: Error;
  success: boolean;
  data?: T;
  params?: any;
}

// Interface used to parse payload from token
export type Payload = {
  id: number,
  identification: string,
  role: Role,
  iat?: number,
  exp?: number
}

export type UserTokens = {
  token: string;
  refreshToken: string;
}
