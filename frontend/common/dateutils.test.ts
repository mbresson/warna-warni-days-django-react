import {
  findSundayInFirstWeekOfMonth,
  findLastSundayInMonth,
} from "./dateutils";

enum Months {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

const toYYYYMMDD = (date: Date): string => {
  return date.toISOString().substr(0, 10);
};

describe("findSundayInFirstWeekOfMonth", () => {
  test("finds 01/MM/YYYY when the first day of the month is exactly Sunday", () => {
    // 1st March 2020 is a Sunday
    const dateOfSunday = findSundayInFirstWeekOfMonth(2020, Months.March);

    const expectedDate = "2020-03-01";

    expect(toYYYYMMDD(dateOfSunday)).toEqual(expectedDate);
  });

  test("finds DD/(MM-1)/YYYY when the first day of the month is not Sunday", () => {
    const yearsMonthsToExpectedDate: [number, number, string][] = [
      [2020, Months.September, "2020-08-30"], // 1st September 2020 = Tuesday
      [2020, Months.August, "2020-07-26"], // 1st August 2020 = Saturday
      [2020, Months.June, "2020-05-31"], // 1st June 2020 = Monday
    ];

    for (let [year, month, expectedDate] of yearsMonthsToExpectedDate) {
      const dateOfSunday = findSundayInFirstWeekOfMonth(year, month);

      expect(toYYYYMMDD(dateOfSunday)).toEqual(expectedDate);
    }
  });
});

describe("findLastSundayInMonth", () => {
  test("finds (last day in month)/MM/YYYY when the last day of the month is exactly Sunday", () => {
    // 31st May 2020 is a Sunday
    const dateOfSunday = findLastSundayInMonth(2020, Months.May);

    const expectedDate = "2020-05-31";

    expect(toYYYYMMDD(dateOfSunday)).toEqual(expectedDate);
  });

  test("finds DD/MM/YYYY when the last day of the month is not Sunday", () => {
    const yearsMonthsToExpectedDate: [number, number, string][] = [
      [2020, Months.October, "2020-10-25"], // 31st October 2020 = Saturday
      [2020, Months.November, "2020-11-29"], // 30st November 2020 = Monday
      [2020, Months.December, "2020-12-27"], // 31st December 2020 = Thursday
    ];

    for (let [year, month, expectedDate] of yearsMonthsToExpectedDate) {
      const dateOfSunday = findLastSundayInMonth(year, month);

      expect(toYYYYMMDD(dateOfSunday)).toEqual(expectedDate);
    }
  });
});
