import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuth, AuthStateAuthenticated } from "common/AuthProvider";
import MonthDisplay from "components/Displays/MonthDisplay";
import LastNDaysDisplay from "components/Displays/LastNDaysDisplay";
import { ParsedUrlQuery } from "querystring";

enum DisplayModes {
  Month = "month display",
  LastTwoWeeks = "last two weeks",
}

const canonicalDisplayMode = (mode: DisplayModes): string => {
  return mode.replace(/ /g, "-");
};

const DisplayModeControls: React.FC<{
  displayMode: DisplayModes;
  onChange: (displayMode: DisplayModes) => void;
}> = ({ displayMode, onChange }) => {
  return (
    <div className="choice-group text-center my-2">
      <button
        className={
          "big choice " + (displayMode == DisplayModes.Month ? "active" : "")
        }
        onClick={() => {
          onChange(DisplayModes.Month);
        }}
      >
        {DisplayModes.Month}
      </button>

      <button
        className={
          "big choice " +
          (displayMode == DisplayModes.LastTwoWeeks ? "active" : "")
        }
        onClick={() => {
          onChange(DisplayModes.LastTwoWeeks);
        }}
      >
        {DisplayModes.LastTwoWeeks}
      </button>
    </div>
  );
};

const displayModeFromQuery = (query: ParsedUrlQuery): DisplayModes => {
  if (query.mode == canonicalDisplayMode(DisplayModes.LastTwoWeeks)) {
    return DisplayModes.LastTwoWeeks;
  }

  return DisplayModes.Month;
};

const Index: React.FC<{}> = () => {
  const today = new Date();

  const router = useRouter();

  const auth = useAuth();
  const [displayMode, setDisplayMode] = useState<DisplayModes>(
    displayModeFromQuery(router.query)
  );

  if (auth.state != "authenticated") {
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

      {displayMode == DisplayModes.Month ? (
        <MonthDisplay today={today} />
      ) : (
        <LastNDaysDisplay date={today} numDays={14} today={today} />
      )}

      <DisplayModeControls
        displayMode={displayMode}
        onChange={(displayMode) => {
          router.push("/?mode=" + canonicalDisplayMode(displayMode));
          setDisplayMode(displayMode);
        }}
      />
    </>
  );
};

export default Index;
