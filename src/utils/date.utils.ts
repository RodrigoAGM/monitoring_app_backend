export function getDateOnlyStr(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function getDateOnly(date: Date): Date {
  return new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`);
}
