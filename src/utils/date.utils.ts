import AppError from '../error/app.error';

export function getDateOnlyStr(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function getDateOnly(date: Date): Date {
  return new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`);
}

export function validateDate(value: Date | string | number): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw (new AppError({
      message: 'La fecha ingresada es inválida',
      statusCode: 404,
    }));
  }

  return date;
}
