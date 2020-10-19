import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth, AuthStateAuthenticated } from "../common/AuthProvider";
import MonthDisplay from "../components/MonthDisplay";
import MonthDisplayControls from "../components/MonthDisplayControls";
import LastNDaysDisplay from "../components/LastNDaysDisplay";
import { DateYYYYMMDD, DayData } from "../common/types";
import { getDays } from "../common/apis/days";
import {
  dateToLocalYYYYMMDD,
  Month1To12,
  yyyyMMDDToDate,
} from "../common/utils/dateutils";
import { ParsedUrlQuery } from "querystring";

enum DisplayModes {
  Month = "month display",
  LastTwoWeeks = "last two weeks",
}

const canonicalDisplayMode = (mode: DisplayModes): string => {
  return mode.replace(/ /g, "-");
};

type DisplayModeMonth = {
  mode: DisplayModes.Month;
  year: number;
  month: Month1To12;
};

type DisplayModeLastTwoWeeks = {
  mode: DisplayModes.LastTwoWeeks;
};

type DisplayMode = DisplayModeMonth | DisplayModeLastTwoWeeks;

const DisplayModeControls: React.FC<{
  displayMode: DisplayMode;
  currentMonth: Month1To12;
  currentYear: number;
  onChange: (displayMode: DisplayMode) => void;
}> = ({ displayMode, onChange, currentMonth, currentYear }) => {
  return (
    <div className="choice-group text-center my-2">
      <button
        className={
          "big choice " +
          (displayMode.mode == DisplayModes.Month ? "active" : "")
        }
        onClick={() => {
          onChange({
            mode: DisplayModes.Month,
            month: currentMonth,
            year: currentYear,
          });
        }}
      >
        {DisplayModes.Month}
      </button>

      <button
        className={
          "big choice " +
          (displayMode.mode == DisplayModes.LastTwoWeeks ? "active" : "")
        }
        onClick={() => {
          onChange({
            mode: DisplayModes.LastTwoWeeks,
          });
        }}
      >
        {DisplayModes.LastTwoWeeks}
      </button>
    </div>
  );
};

const displayModeFromQuery = (
  query: ParsedUrlQuery,
  currentMonth: Month1To12,
  currentYear: number
): DisplayMode => {
  if (query.mode == canonicalDisplayMode(DisplayModes.LastTwoWeeks)) {
    return {
      mode: DisplayModes.LastTwoWeeks,
    };
  }

  return {
    mode: DisplayModes.Month,
    month: currentMonth,
    year: currentYear,
  };
};

type DataStateReady = {
  state: "ready";
  days: Record<DateYYYYMMDD, DayData>;
  firstDayDate: Date;
};

type DataStateLoading = {
  state: "loading";
};

type DataState = DataStateReady | DataStateLoading;

const Index: React.FC<{}> = () => {
  const today = new Date();
  const currentMonth: Month1To12 = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const router = useRouter();

  const auth = useAuth() as AuthStateAuthenticated;
  const [data, setData] = useState<DataState>({ state: "loading" });
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    displayModeFromQuery(router.query, currentMonth, currentYear)
  );

  const fetchData = () => {
    getDays(auth.username).then((daysList) => {
      let firstDateSoFar = dateToLocalYYYYMMDD(today);

      const daysByDate = {};
      for (let day of daysList) {
        if (day.date < firstDateSoFar) {
          firstDateSoFar = day.date;
        }

        daysByDate[day.date] = day;
      }

      setData({
        state: "ready",
        days: daysByDate,
        firstDayDate: yyyyMMDDToDate(firstDateSoFar),
      });
    });
  };

  useEffect(fetchData, []);

  if (data.state != "ready") {
    return null;
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <h2 className="main-title">
        Welcome, <em>{auth.username}</em>!
      </h2>

      {displayMode.mode == DisplayModes.Month ? (
        <>
          <MonthDisplayControls
            startDate={data.firstDayDate}
            endDate={today}
            selectedYear={displayMode.year}
            selectedMonth={displayMode.month}
            onMonthYearChange={(month, year) => {
              setDisplayMode({
                mode: DisplayModes.Month,
                month: month,
                year: year,
              });
            }}
          />

          <MonthDisplay
            allUserDays={data.days}
            month={displayMode.month}
            year={displayMode.year}
            today={today}
            onRefreshRequired={fetchData}
          />
        </>
      ) : (
        <LastNDaysDisplay
          allUserDays={data.days}
          date={today}
          numDays={14}
          today={today}
          onRefreshRequired={fetchData}
        />
      )}

      <DisplayModeControls
        displayMode={displayMode}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onChange={(displayMode) => {
          router.push("/?mode=" + canonicalDisplayMode(displayMode.mode));
          setDisplayMode(displayMode);
        }}
      />
    </>
  );
};

export default Index;
