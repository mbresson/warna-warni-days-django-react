export type Month1To12 = number;

export const datePlusOneWeek = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
};

export const findFirstDayInFirstWeekOfMonth = (
  year: number,
  month: Month1To12
): Date => {
  // we consider Sunday as the first day of the week (not Monday as is the case in Europe)
  const firstDayOfMonth = new Date(year, month - 1, 1);

  return new Date(year, month - 1, 1 - firstDayOfMonth.getDay());
};

export const toLocalYYYYMMDD = (date: Date): string => {
  // we avoid toISOString() as it would convert the date to UTC, which may change the date

  const formatAs0D = (d: number) => ("0" + d).slice(-2);

  return (
    date.getFullYear() +
    "-" +
    formatAs0D(date.getMonth() + 1) +
    "-" +
    formatAs0D(date.getDate())
  );
};
