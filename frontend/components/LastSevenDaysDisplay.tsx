import React from "react";

import { DateYYYYMMDD, DayData } from "../common/types";
import {
  toLocalYYYYMMDD,
  SORTED_WEEKDAYS_SHORT_LONG,
} from "../common/dateutils";
import { Day } from "./Day";

const enumerateLastSevenDatesAscOrder = (endDate: Date): Date[] => {
  const days: Date[] = [];

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const day = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - dayOffset
    );

    days.push(day);
  }

  return days;
};

const ONE_SEVENTH = `${100 / 7}%`;

type Properties = {
  allUserDays: Record<DateYYYYMMDD, DayData>;
  date: Date;
};

const LastSevenDaysDisplay: React.FC<Properties> = (props) => {
  const lastSevenDates = enumerateLastSevenDatesAscOrder(props.date);

  const weekdaysList = lastSevenDates.map((date) => {
    return SORTED_WEEKDAYS_SHORT_LONG[date.getDay()];
  });

  const today = toLocalYYYYMMDD(new Date());

  return (
    <table className="w-full border-separate">
      <thead>
        <tr className="small-caps text-gray-900">
          {weekdaysList.map(([short, long]) => (
            <th style={{ width: ONE_SEVENTH }} key={short}>
              <span className="lg:hidden">{short}</span>
              <span className="hidden lg:inline">{long}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr style={{ boxShadow: "0 -1px #EEE" }}>
          {lastSevenDates.map((date, dayIndex) => {
            const dayKey = toLocalYYYYMMDD(date);

            return (
              <td key={dayIndex}>
                <div
                  className={
                    "cursor-pointer border-transparent border-2 hover:border-solid hover:border-gray-900  " +
                    (today == dayKey ? " border-dashed border-gray-900" : "")
                  }
                >
                  <Day date={dayKey} day={props.allUserDays[dayKey]} />
                </div>
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default LastSevenDaysDisplay;
