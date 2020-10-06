import React from "react";
import { SORTED_WEEKDAYS_SHORT_LONG } from "../common/dateutils";
import { DayData } from "../common/types";
import { hexToRGB, computeBrightness, Brightness } from "../common/colorutils";

const prettyDate = (date: Date, today: Date): string => {
  const difference = Math.abs(today.getTime() - date.getTime());
  const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));

  switch (daysDifference) {
    case 0:
      return "Today";
    case 1:
      return "Yesterday";
    default:
      if (daysDifference < 4) {
        return SORTED_WEEKDAYS_SHORT_LONG[date.getDay()][1];
      }
      return date.toLocaleDateString();
  }
};

const EmptyDay: React.FC<{ date: Date; today: Date }> = ({ date, today }) => {
  return (
    <div className="table w-full">
      <div className="w-full h-12 table-cell align-middle text-center text-xl sm:text-2xl border-2 border-transparent">
        {prettyDate(date, today)}
      </div>
    </div>
  );
};

const FilledDay: React.FC<{ day: DayData; date: Date; today: Date }> = (
  props
) => {
  const brightness = computeBrightness(hexToRGB(props.day.color));

  return (
    <div className="table w-full">
      <div
        style={{ background: props.day.color }}
        className={
          "w-full h-12 table-cell align-middle text-center text-xl sm:text-2xl border-2 border-gray-800 " +
          (brightness == Brightness.Dark ? "text-white" : "text-black")
        }
      >
        {prettyDate(props.date, props.today)}
      </div>
    </div>
  );
};

export const DayTile: React.FC<{
  date: Date;
  day?: DayData;
  today: Date;
}> = (props) => {
  if (!props.day) {
    return <EmptyDay date={props.date} today={props.today} />;
  }

  return <FilledDay day={props.day} date={props.date} today={props.today} />;
};
