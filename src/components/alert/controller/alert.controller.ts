import { Request, Response, NextFunction } from 'express';
import { AlertService } from '../service/alert.service';

const service = new AlertService();

export async function handleGetSelfAlerts(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.user;

    const response = await service.getSelfAlerts(payload);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

export async function handleGetAlertsFromReport(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.user;
    const { reportId } = req.params;

    const response = await service.getAlertsFromReport(payload, Number(reportId));
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

export async function handleGetAlertsFromMonitoringPlan(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const payload = req.user;
    const { planId } = req.params;

    const response = await service.getAlertsFromMonitoringPlan(payload, Number(planId));
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

export async function handleGetAlertsFromPatient(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const payload = req.user;
    const { patientId } = req.params;

    const response = await service.getAlertsFromPatient(payload, Number(patientId));
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}
