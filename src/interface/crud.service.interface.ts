/* eslint-disable no-unused-vars */
import { Result } from '../types/types';

export interface CRUDService<T> {
  get(id: number): Promise<Result<T>>
  getAll(): Promise<Result<T[]>>
  create(data: any): Promise<Result<T>>
  delete(id: number): Promise<Result<Boolean>>
  update(id: number, data: any): Promise<Result<T>>
}
