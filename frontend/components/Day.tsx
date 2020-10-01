import React from "react";
import { DateYYYYMMDD, HexRRGGBB } from "../common/types";
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

const FilledDay: React.FC<{ monthDay: number; color: HexRRGGBB }> = (props) => {
  const brightness = computeBrightness(hexToRGB(props.color));

  return (
    <div
      style={{ background: props.color }}
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

export const Day: React.FC<{ date: DateYYYYMMDD; color?: HexRRGGBB }> = (
  props
) => {
  const day = parseInt(props.date.substring(8), 10);

  if (!props.color) {
    return <EmptyDay monthDay={day} />;
  }

  return <FilledDay color={props.color} monthDay={day} />;
};
