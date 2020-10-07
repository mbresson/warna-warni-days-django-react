import React from "react";

import { DateYYYYMMDD, DayData } from "../common/types";
import {
  dateToLocalYYYYMMDD,
  SORTED_WEEKDAYS_SHORT_LONG,
} from "../common/utils/dateutils";
import { DayTile } from "./DayTile";

const enumerateLastNDatesDescOrder = (endDate: Date, n: number): Date[] => {
  const dates: Date[] = [];

  for (let dateOffset = 0; dateOffset < n; dateOffset++) {
    dates.push(
      new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - dateOffset
      )
    );
  }

  return dates;
};

type Properties = {
  allUserDays: Record<DateYYYYMMDD, DayData>;
  date: Date;
  numDays: number;
  today: Date;
};

const LastNDaysDisplay: React.FC<Properties> = (props) => {
  const lastTenDates = enumerateLastNDatesDescOrder(props.date, props.numDays);

  const today = dateToLocalYYYYMMDD(props.today);

  const endMonth = props.date.getMonth();
  const endYear = props.date.getFullYear();

  return (
    <div>
      {lastTenDates.map((date) => {
        const dateKey = dateToLocalYYYYMMDD(date);

        const weekday = SORTED_WEEKDAYS_SHORT_LONG[date.getDay()][1];

        return (
          <div
            style={{ boxShadow: "0 -1px #EEE" }}
            key={dateKey}
            className={
              "w-full cursor-pointer border-transparent border-2 hover:border-solid hover:border-gray-900  " +
              (today == dateKey ? " border-dashed border-gray-900" : "")
            }
          >
            <div className="w-full sm:w-3/4 mx-auto my-1">
              <DayTile
                date={date}
                day={props.allUserDays[dateKey]}
                today={props.today}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default LastNDaysDisplay;
