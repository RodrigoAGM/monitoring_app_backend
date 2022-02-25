import { Request, Response, NextFunction } from 'express';
import { PrescriptionService } from '../service/prescription.service';

const prescriptionService = new PrescriptionService();

export async function handleGetFromPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const planId = Number(req.params.planId);
    const payload = req.user;

    const data = await prescriptionService.getFromPlan(planId, payload);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleCreatePrescription(req: Request, res: Response, next: NextFunction) {
  try {
    const planId = Number(req.params.planId);
    const { body } = req;
    const medicines = req.body.medicines ?? [];
    const payload = req.user;

    const data = await prescriptionService.create(payload, planId, body, medicines);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetPrescription(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const payload = req.user;

    const data = await prescriptionService.get(id, payload);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

export async function handleGetSelfPrescription(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.user;
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
    const data = await prescriptionService.getSelf(payload, parsedFrom, parsedTo);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}
