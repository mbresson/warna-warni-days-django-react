export type Month1To12 = number;

export const findSundayInFirstWeekOfMonth = (
  year: number,
  month: Month1To12
): Date => {
  const firstDayOfMonth = new Date(year, month - 1, 1);

  return new Date(year, month - 1, 1 - firstDayOfMonth.getDay());
};

export const findLastSundayInMonth = (
  year: number,
  month: Month1To12
): Date => {
  const lastDayOfMonth = new Date(year, month, 0);

  return new Date(year, month, -lastDayOfMonth.getDay());
};
