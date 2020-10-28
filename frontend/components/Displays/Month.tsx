import React, { useEffect, useState } from "react";

import { DateYYYYMMDD, DayData } from "common/types";
import {
  datePlusOneWeek,
  findMondayAsFirstWeekdayInMonthFirstWeek,
  findSundayAsFirstWeekdayInMonthFirstWeek,
  Month1To12,
  dateToLocalYYYYMMDD,
  SORTED_WEEKDAYS_SHORT_LONG,
  WEEKDAYS_SHORT_LONG_STARTING_FROM_MONDAY,
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
  weekFirstDay: "monday" | "sunday";
};

const Month: React.FC<Properties> = (props) => {
  const [dayFormDate, setDayFormDate] = useState<DateYYYYMMDD | null>(null);

  const firstDayOfFirstWeek =
    props.weekFirstDay == "monday"
      ? findMondayAsFirstWeekdayInMonthFirstWeek(props.year, props.month)
      : findSundayAsFirstWeekdayInMonthFirstWeek(props.year, props.month);

  const weeks = enumerateWeeksDaysInMonth(
    firstDayOfFirstWeek,
    props.month,
    props.year
  );

  useEffect(() => {
    const todayKey = dateToLocalYYYYMMDD(props.today);
    const isEvening = new Date().getHours() > 16;
    if (!props.days[todayKey] && isEvening) {
      setDayFormDate(todayKey);
    }
  }, [props.today]);

  const today = dateToLocalYYYYMMDD(props.today);

  const monthPrefix = dateToLocalYYYYMMDD(
    new Date(props.year, props.month - 1, 1)
  ).substr(0, 7);

  const weekdays_short_long =
    props.weekFirstDay == "sunday"
      ? SORTED_WEEKDAYS_SHORT_LONG
      : WEEKDAYS_SHORT_LONG_STARTING_FROM_MONDAY;

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
            {weekdays_short_long.map(([short, long]) => (
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
