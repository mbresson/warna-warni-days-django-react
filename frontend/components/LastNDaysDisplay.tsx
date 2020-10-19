import React, { useState } from "react";

import { DateYYYYMMDD, DayData } from "../common/types";
import { dateToLocalYYYYMMDD, yyyyMMDDToDate } from "../common/utils/dateutils";
import { DayTile } from "./DayTile";
import DayFormModal from "./DayFormModal";

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
  onRefreshRequired: () => void;
};

const LastNDaysDisplay: React.FC<Properties> = (props) => {
  const lastTenDates = enumerateLastNDatesDescOrder(props.date, props.numDays);

  const today = dateToLocalYYYYMMDD(props.today);

  const [currentDayForm, setCurrentDayForm] = useState<DateYYYYMMDD | null>(
    null
  );

  return (
    <>
      {currentDayForm ? (
        <DayFormModal
          onCancel={() => setCurrentDayForm(null)}
          onSaved={() => {
            props.onRefreshRequired();
            setCurrentDayForm(null);
          }}
          date={yyyyMMDDToDate(currentDayForm)}
          day={props.allUserDays[currentDayForm]}
        />
      ) : null}
      <div>
        {lastTenDates.map((date) => {
          const dateKey = dateToLocalYYYYMMDD(date);

          return (
            <div
              key={dateKey}
              style={{ boxShadow: "0 1px #EEE" }}
              className={
                "w-full cursor-pointer border-transparent border-2 hover:border-solid hover:border-gray-900  " +
                (today == dateKey ? " border-dashed border-gray-900" : "")
              }
              onClick={() => {
                setCurrentDayForm(dateKey);
              }}
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
    </>
  );
};
export default LastNDaysDisplay;
