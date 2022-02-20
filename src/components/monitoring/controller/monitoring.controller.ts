import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../service/monitoring.service';

const monitoringService = new MonitoringService();

export async function handleGetSelfPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.user;
    const data = await monitoringService.getSelfPlans(payload);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetSelfPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.user;
    const { id } = req.params;
    const data = await monitoringService.getSelfPlan(payload, Number(id));
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleCreatePlan(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.user;
    const { body } = req;
    body.doctorId = payload.id;

    const data = await monitoringService.create(body);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}
