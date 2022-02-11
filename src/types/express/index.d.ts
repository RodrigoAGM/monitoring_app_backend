import { Payload } from '../types';

/* eslint-disable no-unused-vars */
declare global {
  namespace Express {
    interface Request {
      user: Payload
    }
  }
}
