import { Response, NextFunction, Request } from 'express';
import { MedicalCenterService } from '../service/medical.center.service';

const service = new MedicalCenterService();

export async function handleGetMedicalCenter(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const data = await service.get(Number(id));
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetAllMedicalCenter(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getAll();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleCreateMedicalCenter(req: Request, res: Response, next: NextFunction) {
  try {
    const center = req.body;

    const data = await service.create(center);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateMedicalCenter(req: Request, res: Response, next: NextFunction) {
  try {
    const center = req.body;
    const { id } = req.params;

    const data = await service.update(Number(id), center);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteMedicalCenter(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const data = await service.delete(Number(id));
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}
