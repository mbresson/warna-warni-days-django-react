import React, { useState } from "react";

import { DateYYYYMMDD, DayData } from "common/types";
import {
  datePlusOneWeek,
  findFirstDayInFirstWeekOfMonth,
  Month1To12,
  dateToLocalYYYYMMDD,
  SORTED_WEEKDAYS_SHORT_LONG,
  yyyyMMDDToDate,
} from "common/utils/dateutils";
import { DayCircle } from "../Days/DayCircle";
import DayFormModal from "../Modals/DayFormModal";

const ONE_SEVENTH = `${100 / 7}%`;

const enumerateWeeksDaysInMonth = (
  firstSunday: Date,
  month: Month1To12,
  year: number
): DateYYYYMMDD[][] => {
  const weeks: DateYYYYMMDD[][] = [];

  const endDate = new Date(year, month, 1);

  for (
    let sunday = firstSunday;
    sunday.getTime() < endDate.getTime();
    sunday = datePlusOneWeek(sunday)
  ) {
    const weekDays: DateYYYYMMDD[] = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const day = new Date(
        sunday.getFullYear(),
        sunday.getMonth(),
        sunday.getDate() + dayOffset
      );

      weekDays.push(dateToLocalYYYYMMDD(day));
    }

    weeks.push(weekDays);
  }

  return weeks;
};

type Properties = {
  today: Date;
  month: Month1To12;
  year: number;
  days: Record<DateYYYYMMDD, DayData>;
  onRefreshRequired: () => void;
};

const Month: React.FC<Properties> = (props) => {
  const [dayFormDate, setDayFormDate] = useState<DateYYYYMMDD | null>(null);

  const firstSunday = findFirstDayInFirstWeekOfMonth(props.year, props.month);

  const weeks = enumerateWeeksDaysInMonth(firstSunday, props.month, props.year);

  const today = dateToLocalYYYYMMDD(props.today);

  const monthPrefix = dateToLocalYYYYMMDD(
    new Date(props.year, props.month - 1, 1)
  ).substr(0, 7);

  return (
    <>
      {dayFormDate ? (
        <DayFormModal
          onCancel={() => setDayFormDate(null)}
          onSaved={() => {
            setDayFormDate(null);
            props.onRefreshRequired();
          }}
          date={yyyyMMDDToDate(dayFormDate)}
          day={props.days[dayFormDate]}
        />
      ) : null}

      <table className="w-full border-separate">
        <thead>
          <tr className="small-caps text-gray-900">
            {SORTED_WEEKDAYS_SHORT_LONG.map(([short, long]) => (
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
                  {dayKey.startsWith(monthPrefix) ? (
                    <div
                      className={
                        "cursor-pointer border-transparent border-2 hover:border-solid hover:border-gray-900  " +
                        (today == dayKey
                          ? " border-dashed border-gray-900"
                          : "")
                      }
                      onClick={() => {
                        setDayFormDate(dayKey);
                      }}
                    >
                      <DayCircle date={dayKey} day={props.days[dayKey]} />
                    </div>
                  ) : (
                    <div>
                      <DayCircle date={dayKey} disabled />
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Month;
