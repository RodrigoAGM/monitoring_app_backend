import { Response, NextFunction, Request } from 'express';
import { EmergencyTypeService } from '../service/emergency.type.service';

const service = new EmergencyTypeService();

export async function handleGetEmergencyType(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const data = await service.get(Number(id));
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetAllEmergencyType(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getAll();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleCreateEmergencyType(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;

    const data = await service.create(name);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateEmergencyType(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const data = await service.update(Number(id), name);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteEmergencyType(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const data = await service.delete(Number(id));
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}
