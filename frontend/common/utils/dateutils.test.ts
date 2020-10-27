import {
  datePlusOneWeek,
  findMondayAsFirstWeekdayInMonthFirstWeek,
  findSundayAsFirstWeekdayInMonthFirstWeek,
  dateToLocalYYYYMMDD,
  yyyyMMDDToDate,
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

describe("datePlusOneWeek", () => {
  test("finds the date for the same weekday one week later", () => {
    const datesToExpectedDatePlus1Week: [Date, string][] = [
      [new Date(2020, 8, 29), "2020-10-06"],
      [new Date(2020, 11, 31), "2021-01-07"],
      [new Date(2020, 9, 8), "2020-10-15"],
    ];

    for (let [date, expectedDatePlus1Week] of datesToExpectedDatePlus1Week) {
      const datePlus1Week = datePlusOneWeek(date);

      expect(dateToLocalYYYYMMDD(datePlus1Week)).toEqual(expectedDatePlus1Week);
    }
  });
});

describe("findSundayAsFirstWeekdayInMonthFirstWeek", () => {
  test("finds 01/MM/YYYY when the first day of the month is exactly Sunday", () => {
    // 1st March 2020 is a Sunday
    const dateOfSunday = findSundayAsFirstWeekdayInMonthFirstWeek(
      2020,
      Months.March
    );

    const expectedDate = "2020-03-01";

    expect(dateToLocalYYYYMMDD(dateOfSunday)).toEqual(expectedDate);
  });

  test("finds DD/(MM-1)/YYYY when the first day of the month is not Sunday", () => {
    const yearsMonthsToExpectedDate: [number, number, string][] = [
      [2020, Months.September, "2020-08-30"], // 1st September 2020 = Tuesday
      [2020, Months.August, "2020-07-26"], // 1st August 2020 = Saturday
      [2020, Months.June, "2020-05-31"], // 1st June 2020 = Monday
    ];

    for (let [year, month, expectedDate] of yearsMonthsToExpectedDate) {
      const dateOfSunday = findSundayAsFirstWeekdayInMonthFirstWeek(
        year,
        month
      );

      expect(dateToLocalYYYYMMDD(dateOfSunday)).toEqual(expectedDate);
    }
  });
});

describe("findMondayAsFirstWeekdayInMonthFirstWeek", () => {
  test("finds 01/MM/YYYY when the first day of the month is exactly Monday", () => {
    // 1st June 2020 is a Monday
    const dateOfMonday = findMondayAsFirstWeekdayInMonthFirstWeek(
      2020,
      Months.June
    );

    const expectedDate = "2020-06-01";

    expect(dateToLocalYYYYMMDD(dateOfMonday)).toEqual(expectedDate);
  });

  test("finds DD/(MM-1)/YYYY when the first day of the month is not Monday", () => {
    const yearsMonthsToExpectedDate: [number, number, string][] = [
      [2020, Months.October, "2020-09-28"], // 1st September 2020 = Thirsday
      [2020, Months.September, "2020-08-31"], // 1st September 2020 = Tuesday
      [2020, Months.August, "2020-07-27"], // 1st August 2020 = Saturday
      [2020, Months.March, "2020-02-24"], // 1st March 2020 = Sunday
    ];

    for (let [year, month, expectedDate] of yearsMonthsToExpectedDate) {
      const dateOfMonday = findMondayAsFirstWeekdayInMonthFirstWeek(
        year,
        month
      );

      expect(dateToLocalYYYYMMDD(dateOfMonday)).toEqual(expectedDate);
    }
  });
});

describe("dateToLocalYYYYMMDD", () => {
  test("formats date as YYYY-MM-DD, local time", () => {
    const datesToExpectedYYYYMMDD: [Date, string][] = [
      [new Date(2012, 11, 31), "2012-12-31"],
      [new Date(2020, 0, 1), "2020-01-01"],
    ];

    for (let [date, expectedYYYYMMDD] of datesToExpectedYYYYMMDD) {
      const yyyyMMDD = dateToLocalYYYYMMDD(date);

      expect(yyyyMMDD).toEqual(expectedYYYYMMDD);
    }
  });
});

describe("yyyyMMDDToDate", () => {
  test("parses YYYY-MM-DD format to date, local time", () => {
    const yyyyMMDDToExpectedDates: [string, Date][] = [
      ["2012-12-31", new Date(2012, 11, 31)],
      ["2020-01-01", new Date(2020, 0, 1)],
    ];

    for (let [yyyyMMDD, expectedDate] of yyyyMMDDToExpectedDates) {
      const date = yyyyMMDDToDate(yyyyMMDD);

      expect(date.getTime()).toEqual(expectedDate.getTime());
    }
  });
});
