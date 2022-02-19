import { Response, NextFunction, Request } from 'express';
import { PriorityTypeService } from '../service/priority.service';

const service = new PriorityTypeService();

export async function handleGetPriorityType(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const data = await service.get(Number(id));
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetAllPriorityType(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getAll();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleCreatePriorityType(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;

    const data = await service.create(name);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdatePriorityType(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const data = await service.update(Number(id), name);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleDeletePriorityType(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const data = await service.delete(Number(id));
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}
