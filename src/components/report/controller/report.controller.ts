import { NextFunction, Request, Response } from 'express';
import { ReportService } from '../service/report.service';

const reportService = new ReportService();

export async function handleGetPlansByPriorityReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.user;
    const active = req.query.active === 'true';

    const data = await reportService.getPlansByPriorityReport(payload, active);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetPlansByEmergencyReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.user;
    const active = req.query.active === 'true';

    const data = await reportService.getPlansByEmergencyReport(payload, active);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}
