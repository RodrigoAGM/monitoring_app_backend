import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../service/monitoring.service';

const monitoringService = new MonitoringService();

export async function handleGetSelfPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.user;
    const active = req.query.active === 'true';
    const data = await monitoringService.getSelfPlans(payload, active);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetPatientHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.user;
    const { patientId } = req.params;
    const active = req.query.active === 'true';
    const self = req.query.self === 'true';
    const data = await monitoringService.getPatientHistory(
      payload,
      Number(patientId),
      active,
      self,
    );
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.user;
    const { id } = req.params;
    const data = await monitoringService.getPlan(payload, Number(id));
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
