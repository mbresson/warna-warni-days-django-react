import React, { useEffect, useState } from "react";

import { getDays } from "common/apis/days";
import { useAuth, AuthStateAuthenticated } from "common/AuthProvider";
import { DateYYYYMMDD, DayData } from "common/types";
import { dateToLocalYYYYMMDD, yyyyMMDDToDate } from "common/utils/dateutils";
import { DayTile } from "../Days/DayTile";
import DayFormModal from "../Modals/DayFormModal";

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

type DataStateError = {
  state: "error";
  error: string;
};

type DataStateReady = {
  state: "ready";
  days: Record<DateYYYYMMDD, DayData>;
};

type DataStateLoading = {
  state: "loading";
};

type DataState = DataStateReady | DataStateLoading | DataStateError;

type Properties = {
  date: Date;
  numDays: number;
  today: Date;
};

const LastNDaysDisplay: React.FC<Properties> = (props) => {
  const [data, setData] = useState<DataState>({ state: "loading" });
  const [dayFormDate, setDayFormDate] = useState<DateYYYYMMDD | null>(null);
  const auth = useAuth() as AuthStateAuthenticated;

  const fetchData = () => {
    const before = new Date(
      props.date.getFullYear(),
      props.date.getMonth(),
      props.date.getDate() + 1
    );

    getDays(auth.username, {
      before,
      limit: props.numDays,
      order: "desc",
    }).then((response) => {
      if (response.state == "failed") {
        setData({
          state: "error",
          error: response.error,
        });
        return;
      }

      const daysByDate = {};
      for (let day of response.days) {
        daysByDate[day.date] = day;
      }

      setData({
        state: "ready",
        days: daysByDate,
      });
    });
  };

  useEffect(fetchData, [props.date, props.numDays]);

  if (data.state == "loading") {
    return <h3 className="text-2xl text-center">Loading...</h3>;
  } else if (data.state == "error") {
    return <h3 className="text-2xl text-center bad-feeling">{data.error}</h3>;
  }

  const lastTenDates = enumerateLastNDatesDescOrder(props.date, props.numDays);

  const today = dateToLocalYYYYMMDD(props.today);

  return (
    <>
      {dayFormDate ? (
        <DayFormModal
          onCancel={() => setDayFormDate(null)}
          onSaved={() => {
            fetchData();
            setDayFormDate(null);
          }}
          date={yyyyMMDDToDate(dayFormDate)}
          day={data.days[dayFormDate]}
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
                setDayFormDate(dateKey);
              }}
            >
              <div className="w-full sm:w-3/4 mx-auto my-1">
                <DayTile
                  date={date}
                  day={data.days[dateKey]}
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
