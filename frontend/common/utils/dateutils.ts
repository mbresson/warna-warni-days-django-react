import { DateYYYYMMDD } from "../types";

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

export const dateToLocalYYYYMMDD = (date: Date): DateYYYYMMDD => {
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

export const yyyyMMDDToDate = (yyyyMMDD: DateYYYYMMDD): Date => {
  const year = parseInt(yyyyMMDD.substr(0, 4), 10);
  const month = parseInt(yyyyMMDD.substr(5, 2), 10) - 1;
  const day = parseInt(yyyyMMDD.substr(8, 2), 10);

  return new Date(year, month, day);
};

export const SORTED_WEEKDAYS_SHORT_LONG = [
  ["Sun", "Sunday"],
  ["Mon", "Monday"],
  ["Tue", "Tuesday"],
  ["Wed", "Wednesday"],
  ["Thu", "Thursday"],
  ["Fri", "Friday"],
  ["Sat", "Saturday"],
];

export const SORTED_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
