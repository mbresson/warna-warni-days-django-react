import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useAuth, AuthStateAuthenticated } from "../common/AuthProvider";
import MonthDaysDisplay from "../components/MonthDaysDisplay";

const getDays = async (username: string): Promise<undefined> => {
  const response = await fetch(`/api/users/${username}/days/`);

  return await response.json();
};

const Index: React.FC<{}> = () => {
  const auth = useAuth() as AuthStateAuthenticated;
  const [days, setDays] = useState([]);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  useEffect(() => {
    getDays(auth.username).then((days) => {
      setDays(days);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <h2 className="main-title">Welcome {auth.username}</h2>

      <MonthDaysDisplay
        allUserDays={days}
        month={currentMonth + 1}
        year={currentYear}
      />
    </>
  );
};

export default Index;
