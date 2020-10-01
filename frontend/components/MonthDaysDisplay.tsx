import React from "react";

import { DateYYYYMMDD, DayData } from "../common/types";
import {
  datePlusOneWeek,
  findFirstDayInFirstWeekOfMonth,
  Month1To12,
  toLocalYYYYMMDD,
} from "../common/dateutils";
import { Day } from "./Day";

const WEEKDAYS_SHORT_LONG = [
  ["Sun", "Sunday"],
  ["Mon", "Monday"],
  ["Tue", "Tuesday"],
  ["Wed", "Wednesday"],
  ["Thu", "Thursday"],
  ["Fri", "Friday"],
  ["Sat", "Saturday"],
];

const ONE_SEVENTH = `${100 / 7}%`;

const enumerateWeeksDaysInMonth = (
  firstSunday: Date,
  month: Month1To12
): DateYYYYMMDD[][] => {
  const weeks: DateYYYYMMDD[][] = [];

  for (
    let sunday = firstSunday;
    sunday.getMonth() < month;
    sunday = datePlusOneWeek(sunday)
  ) {
    const weekDays: DateYYYYMMDD[] = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const day = new Date(
        sunday.getFullYear(),
        sunday.getMonth(),
        sunday.getDate() + dayOffset
      );

      weekDays.push(toLocalYYYYMMDD(day));
    }

    weeks.push(weekDays);
  }

  return weeks;
};

type Properties = {
  allUserDays: DayData[];
  month: Month1To12;
  year: number;
};

const MonthDaysDisplay: React.FC<Properties> = (props) => {
  const firstSunday = findFirstDayInFirstWeekOfMonth(props.year, props.month);

  const dateToColor = {};
  for (let day of props.allUserDays) {
    dateToColor[day.date] = day.color;
  }

  const weeks = enumerateWeeksDaysInMonth(firstSunday, props.month);

  const today = toLocalYYYYMMDD(new Date());

  return (
    <table className="w-full border-separate">
      <thead>
        <tr className="small-caps text-gray-900">
          {WEEKDAYS_SHORT_LONG.map(([short, long]) => (
            <th style={{ width: ONE_SEVENTH }} key={short}>
              <span className="lg:hidden">{short}</span>
              <span className="hidden lg:inline">{long}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex} style={{ boxShadow: "0 -1px #EEE" }}>
            {week.map((dayKey, dayIndex) => (
              <td key={dayIndex}>
                <div
                  className={
                    "cursor-pointer border-transparent border-2 hover:border-solid hover:border-gray-900  " +
                    (today == dayKey ? " border-dashed border-gray-900" : "")
                  }
                >
                  <Day date={dayKey} color={dateToColor[dayKey]} />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MonthDaysDisplay;
