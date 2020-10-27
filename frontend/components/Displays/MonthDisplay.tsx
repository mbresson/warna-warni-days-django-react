import React, { useEffect, useState } from "react";

import { getDays } from "common/apis/days";
import { useAuth, AuthStateAuthenticated } from "common/AuthProvider";
import { DateYYYYMMDD, DayData } from "common/types";
import { Month1To12 } from "common/utils/dateutils";
import Month from "./Month";
import MonthControls from "./MonthControls";

type DataStateLoading = {
  state: "loading";
};

type DataStateError = {
  state: "error";
  error: string;
};

type DataStateReady = {
  state: "ready";
  days: Record<DateYYYYMMDD, DayData>;
};

type DataState = DataStateReady | DataStateLoading | DataStateError;

type Properties = {
  today: Date;
};

const MonthDisplay: React.FC<Properties> = (props) => {
  const [[month, year], setMonthYear] = useState<[Month1To12, number]>([
    props.today.getMonth() + 1,
    props.today.getFullYear(),
  ]);

  const [data, setData] = useState<DataState>({ state: "loading" });
  const auth = useAuth() as AuthStateAuthenticated;

  const fetchData = () => {
    const after = new Date(year, month - 1, 0);
    const before = new Date(year, month, 1);

    getDays(auth.username, { after, before }).then((response) => {
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

  useEffect(fetchData, [month, year]);

  if (data.state == "loading") {
    return <h3 className="text-2xl text-center">Loading...</h3>;
  } else if (data.state == "error") {
    return <h3 className="text-2xl text-center bad-feeling">{data.error}</h3>;
  }

  return (
    <>
      <MonthControls
        startDate={auth.dateJoined}
        endDate={props.today}
        selectedYear={year}
        selectedMonth={month}
        onMonthYearChange={(month, year) => {
          setMonthYear([month, year]);
        }}
      />

      <Month
        days={data.days}
        month={month}
        year={year}
        today={props.today}
        onRefreshRequired={() => {
          fetchData();
        }}
        weekFirstDay={auth.preferredFirstWeekday}
      />
    </>
  );
};

export default MonthDisplay;
