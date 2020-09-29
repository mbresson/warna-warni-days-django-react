import React from "react";

import { Day } from "../common/types";
import {
  Month1To12,
  findSundayInFirstWeekOfMonth,
  findLastSundayInMonth,
} from "../common/dateutils";

type Properties = {
  allUserDays: Day[];
  month: Month1To12;
  year: number;
};

const MonthDaysDisplay: React.FC<Properties> = (props) => {
  const sundayOfFirstWeek = findSundayInFirstWeekOfMonth(
    props.year,
    props.month
  );
  const lastSundayInMonth = findLastSundayInMonth(props.year, props.month);

  const dateToColor = {};
  for (let day of props.allUserDays) {
    dateToColor[day.date] = day.color;
  }

  const weeks: string[][] = [];

  for (
    let sunday = sundayOfFirstWeek;
    sunday.getTime() != lastSundayInMonth.getTime();
    sunday = new Date(
      sunday.getFullYear(),
      sunday.getMonth(),
      sunday.getDate() + 7
    )
  ) {
    const week: string[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const day = new Date(
        sunday.getFullYear(),
        sunday.getMonth(),
        sunday.getDate() + dayIndex
      );

      const dayKey = day.toISOString().substr(0, 10);

      week.push(dayKey);
    }
    weeks.push(week);
  }

  // loop, week = tr
  return (
    <table>
      <thead>
        <tr>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
          <th>Sunday</th>
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((dayKey, dayIndex) => (
              <td key={dayIndex}>
                {dateToColor[dayKey] ? (
                  <div style={{ color: dateToColor[dayKey] }}>
                    {dateToColor[dayKey]}
                  </div>
                ) : (
                  "NO DAY"
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MonthDaysDisplay;
