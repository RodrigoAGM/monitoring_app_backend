import { NextFunction, Request, Response } from 'express';
import { DailyReporService } from '../service/daily.service';

const dailyReporService = new DailyReporService();

export async function handleCreateDailyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    const currentDate = req.body.currentDate ?? undefined;
    const payload = req.user;
    const planId = Number(req.params.planId);

    const response = await dailyReporService.createReport(currentDate, payload, planId, data);
    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
}

export async function handleGetDailyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const selectedDate = req.body.currentDate ?? undefined;
    const payload = req.user;
    const planId = Number(req.params.planId);

    const response = await dailyReporService.getSelfDailyReport(selectedDate, payload, planId);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

export async function handleGetDailyReportFromPatient(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const selectedDate = req.body.currentDate ?? undefined;
    const planId = Number(req.params.planId);
    const patientId = Number(req.params.patientId);

    const response = await dailyReporService.getDailyReportFromPatient(
      selectedDate, planId, patientId
    );
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}
