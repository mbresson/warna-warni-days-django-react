import React from "react";
import { DateYYYYMMDD, DayData } from "../common/types";
import {
  hexToRGB,
  computeBrightness,
  Brightness,
} from "../common/utils/colorutils";

const EmptyDay: React.FC<{ monthDay: number; disabled: boolean }> = ({
  monthDay,
  disabled,
}) => {
  return (
    <div className="px-1 sm:py-1 sm:px-2 lg:py-4 lg:px-5 mx-auto table text-xl sm:text-2xl  border-2 border-transparent">
      <div
        className={
          "align-middle italic table-cell text-center " +
          (disabled ? "text-gray-500" : "text-black")
        }
      >
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
      className="px-1 sm:py-1 sm:px-2 lg:py-4 lg:px-5 mx-auto table text-xl sm:text-2xl rounded-full border-2 border-gray-200"
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

export const DayCircle: React.FC<{
  date: DateYYYYMMDD;
  day?: DayData;
  disabled?: boolean;
}> = (props) => {
  const monthDay = parseInt(props.date.substring(8), 10);

  if (!props.day || props.disabled) {
    return <EmptyDay monthDay={monthDay} disabled={props.disabled} />;
  }

  return <FilledDay day={props.day} monthDay={monthDay} />;
};

DayCircle.defaultProps = {
  disabled: false,
};
