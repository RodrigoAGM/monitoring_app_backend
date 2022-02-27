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
    const active = req.query.active ? req.query.active === 'true' : undefined;

    let parsedFrom;
    if (req.query.from) {
      const { from } = req.query;
      parsedFrom = Number.isNaN(Number(from)) ? from.toString() : Number(from);
    }

    const data = await reportService.getPlansByPriorityReport(payload, active, parsedFrom);
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
    const active = req.query.active ? req.query.active === 'true' : undefined;

    let parsedFrom;
    if (req.query.from) {
      const { from } = req.query;
      parsedFrom = Number.isNaN(Number(from)) ? from.toString() : Number(from);
    }

    const data = await reportService.getPlansByEmergencyReport(payload, active, parsedFrom);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetPatientsByEmergency(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.user;
    const active = req.query.active ? req.query.active === 'true' : undefined;
    const emergencyId = Number(req.params.emergencyId);

    let parsedFrom;
    if (req.query.from) {
      const { from } = req.query;
      parsedFrom = Number.isNaN(Number(from)) ? from.toString() : Number(from);
    }

    const data = await reportService.getPatientsByEmergency(
      payload, emergencyId, active, parsedFrom
    );
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetPatientsByPriority(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.user;
    const active = req.query.active ? req.query.active === 'true' : undefined;
    const priorityId = Number(req.params.priorityId);

    let parsedFrom;
    if (req.query.from) {
      const { from } = req.query;
      parsedFrom = Number.isNaN(Number(from)) ? from.toString() : Number(from);
    }

    const data = await reportService.getPatientsByPriority(
      payload, priorityId, active, parsedFrom
    );
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetDailyReportDayResume(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.user;
    const active = req.query.active ? req.query.active === 'true' : undefined;

    let parsedFrom;
    if (req.query.from) {
      const { from } = req.query;
      parsedFrom = Number.isNaN(Number(from)) ? from.toString() : Number(from);
    }

    const data = await reportService.getDailyReportDayResume(payload, active, parsedFrom);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetPatientsByStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.user;
    const active = req.query.active ? req.query.active === 'true' : undefined;

    let parsedFrom;
    let parsedTo;
    if (req.query.from) {
      const { from } = req.query;
      parsedFrom = Number.isNaN(Number(from)) ? from.toString() : Number(from);
    }
    if (req.query.to) {
      const { to } = req.query;
      parsedTo = Number.isNaN(Number(to)) ? to.toString() : Number(to);
    }

    const data = await reportService.getPatientsByStatus(
      payload, active, parsedFrom, parsedTo
    );
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}
