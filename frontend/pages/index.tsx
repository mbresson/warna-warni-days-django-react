import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useAuth, AuthStateAuthenticated } from "../common/AuthProvider";
import MonthDisplay from "../components/MonthDisplay";
import MonthDisplayControls from "../components/MonthDisplayControls";
import LastNDaysDisplay from "../components/LastNDaysDisplay";
import { DateYYYYMMDD, DayData } from "../common/types";
import {
  dateToLocalYYYYMMDD,
  Month1To12,
  yyyyMMDDToDate,
} from "../common/dateutils";

const getDays = async (username: string): Promise<[DayData]> => {
  const response = await fetch(`/api/users/${username}/days/`);

  return await response.json();
};

enum DisplayModes {
  Month = "month display",
  LastTwoWeeks = "last two weeks",
}

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
    <div className="choice-group text-center">
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

const Index: React.FC<{}> = () => {
  const today = new Date();
  const currentMonth: Month1To12 = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const auth = useAuth() as AuthStateAuthenticated;
  const [loading, setLoading] = useState<boolean>(true);
  const [days, setDays] = useState<Record<DateYYYYMMDD, DayData>>({});
  const [firstDate, setFirstDate] = useState<DateYYYYMMDD>(
    dateToLocalYYYYMMDD(today)
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>({
    mode: DisplayModes.Month,
    month: currentMonth,
    year: currentYear,
  });

  useEffect(() => {
    getDays(auth.username).then((daysList) => {
      let firstDateSoFar = dateToLocalYYYYMMDD(today);

      const daysByDate = {};
      for (let day of daysList) {
        if (day.date < firstDateSoFar) {
          firstDateSoFar = day.date;
        }

        daysByDate[day.date] = day;
      }
      setDays(daysByDate);
      setFirstDate(firstDateSoFar);
      setLoading(false);
    });
  }, []);

  if (loading) {
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
            startDate={yyyyMMDDToDate(firstDate)}
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
            allUserDays={days}
            month={displayMode.month}
            year={displayMode.year}
            today={today}
          />
        </>
      ) : (
        <LastNDaysDisplay
          allUserDays={days}
          date={today}
          numDays={14}
          today={today}
        />
      )}

      <DisplayModeControls
        displayMode={displayMode}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onChange={setDisplayMode}
      />
    </>
  );
};

export default Index;
