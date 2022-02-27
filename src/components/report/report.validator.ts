import AppError from '../../error/app.error';
import { getDateOnly, validateDate } from '../../utils/date.utils';

export function validateFromDate(from: number | string | undefined): Date {
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  if (from) {
    let fromDate = validateDate(from);
    fromDate = getDateOnly(fromDate);

    if (fromDate.getTime() > currentDate.getTime()) {
      throw (new AppError({
        message: 'La fecha de fin no puede ser futura.',
        errorCode: 400,
      }));
    }
    currentDate = fromDate;
  }

  return currentDate;
}

export function validateToDate(to: number | string | undefined, from: Date): Date {
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  if (to) {
    let toDate = validateDate(to);
    toDate = getDateOnly(toDate);

    if (toDate.getTime() < from.getTime()) {
      throw (new AppError({
        message: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
        errorCode: 400,
      }));
    }
    currentDate = toDate;
  }

  return currentDate;
}
