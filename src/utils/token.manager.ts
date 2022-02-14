/* eslint-disable no-return-assign */
import { User } from '.prisma/client';
import jwt from 'jsonwebtoken';
import AppError from '../error/app.error';
import { Payload, UserTokens } from '../types/types';

export class TokenManager {
  private static _instance: TokenManager

  createTokens(user: User): Promise<UserTokens> {
    try {
      // Check if we have access and refresh token secret from env variables
      if (process.env.ACCESS_TOKEN_SECRET === undefined
        || process.env.REFRESH_TOKEN_SECRET === undefined) {
        // If undefined, write log with specific error and return generic error
        console.log('ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET has not been set correctly.');
        return Promise.reject(new AppError({ message: 'Something went wrong.', statusCode: 500 }));
      }

      const payload: Payload = {
        id: user.id,
        identification: user.identification,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

      return Promise.resolve({ token, refreshToken });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  verifyToken(token: string): Promise<Payload> {
    try {
      // Check if we have access token secret from env variables
      if (process.env.ACCESS_TOKEN_SECRET === undefined) {
        // If undefined, write log with specific error and return generic error
        console.log('ACCESS_TOKEN_SECRET has not been set correctly.');
        return Promise.reject(new AppError({ message: 'Something went wrong.', statusCode: 500 }));
      }

      // Verify if token is valid
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // If token is valid, decode it to get the payload
      const decoded = jwt.decode(token, { complete: true }) as { [key: string]: any };

      // Assign payload to return variable
      const payload = decoded.payload as Payload;

      return Promise.resolve(payload);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  verifyRefreshToken(refreshToken: string): Promise<Payload> {
    try {
      // Check if we have access token secret from env variables
      if (process.env.REFRESH_TOKEN_SECRET === undefined) {
        // If undefined, write log with specific error and return generic error
        console.log('REFRESH_TOKEN_SECRET has not been set correctly.');
        return Promise.reject(new AppError({ message: 'Something went wrong.', statusCode: 500 }));
      }

      // Verify if token is valid
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // If token is valid, decode it to get the payload
      const decoded = jwt.decode(refreshToken, { complete: true }) as { [key: string]: any };

      // Assign payload to return variable
      const payload = decoded.payload as Payload;

      return Promise.resolve(payload);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      // Validate if refresh token is valid
      const payload = await this.verifyRefreshToken(refreshToken);

      // Check if we have access and refresh token secret from env variables
      if (process.env.ACCESS_TOKEN_SECRET === undefined
        || process.env.REFRESH_TOKEN_SECRET === undefined) {
        // If undefined, write log with specific error and return generic error
        console.log('ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET has not been set correctly.');
        return Promise.reject(new AppError({ message: 'Something went wrong.', statusCode: 500 }));
      }
      // Create new payload to get new token
      const newPayload: Payload = {
        id: payload.id,
        role: payload.role,
        identification: payload.identification,
      };
      // Create new token
      const token = jwt.sign(newPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15h' });
      console.log(token);
      return Promise.resolve(token);
    } catch (error) {
      return Promise.reject(new AppError({
        message: 'El refresh token es inválido.',
        statusCode: 401,
      }));
    }
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}

export const tokenManager = TokenManager.Instance;
