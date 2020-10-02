import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useAuth, AuthStateAuthenticated } from "../common/AuthProvider";
import MonthDaysDisplay from "../components/MonthDaysDisplay";
import LastSevenDaysDisplay from "../components/LastSevenDaysDisplay";
import { DateYYYYMMDD, DayData } from "../common/types";

const getDays = async (username: string): Promise<[DayData]> => {
  const response = await fetch(`/api/users/${username}/days/`);

  return await response.json();
};

enum DisplayMode {
  Month = "month",
  LastSevenDays = "last 7 days",
}

const Index: React.FC<{}> = () => {
  const auth = useAuth() as AuthStateAuthenticated;
  const [loading, setLoading] = useState<boolean>(true);
  const [days, setDays] = useState<Record<DateYYYYMMDD, DayData>>({});
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    DisplayMode.Month
  );

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  useEffect(() => {
    getDays(auth.username).then((daysList) => {
      const daysByDate = {};
      for (let day of daysList) {
        daysByDate[day.date] = day;
      }
      setDays(daysByDate);
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

      <h2 className="main-title">Welcome {auth.username}</h2>

      <div className="choice-group text-center mb-4">
        <h3>Display mode</h3>

        {Object.values(DisplayMode).map((option) => (
          <button
            className={"big choice " + (option == displayMode ? "active" : "")}
            onClick={() => {
              setDisplayMode(option);
            }}
            key={option}
          >
            {option}
          </button>
        ))}
      </div>

      {
        {
          [DisplayMode.Month]: (
            <MonthDaysDisplay
              allUserDays={days}
              month={currentMonth + 1}
              year={currentYear}
            />
          ),
          [DisplayMode.LastSevenDays]: (
            <LastSevenDaysDisplay allUserDays={days} date={today} />
          ),
        }[displayMode]
      }
    </>
  );
};

export default Index;
