import React from "react";
import { DateYYYYMMDD, DayData } from "../common/types";
import { hexToRGB, computeBrightness, Brightness } from "../common/colorutils";

const EmptyDay: React.FC<{ monthDay: number }> = ({ monthDay }) => {
  return (
    <div className="py-1 px-2 lg:py-4 lg:px-5 mx-auto table text-2xl">
      <div className={"align-middle italic table-cell text-center"}>
        {monthDay}
      </div>
    </div>
  );
};

const FilledDay: React.FC<{ monthDay: number; day: DayData }> = (props) => {
  const brightness = computeBrightness(hexToRGB(props.day.color));

  return (
    <div
      style={{ background: props.day.color }}
      className="py-1 px-2 lg:py-4 lg:px-5 mx-auto table text-2xl rounded-full border-2 border-gray-200 "
    >
      <div
        className={
          "align-middle table-cell text-center " +
          (brightness == Brightness.Dark ? "text-white" : "text-black")
        }
      >
        {props.monthDay}
      </div>
    </div>
  );
};

export const Day: React.FC<{ date: DateYYYYMMDD; day?: DayData }> = (props) => {
  const monthDay = parseInt(props.date.substring(8), 10);

  if (!props.day) {
    return <EmptyDay monthDay={monthDay} />;
  }

  return <FilledDay day={props.day} monthDay={monthDay} />;
};
