import React from "react";

import { SORTED_MONTHS, Month1To12 } from "../common/dateutils";

const enumerateMonthOptions = (
  startDate: Date,
  endDate: Date
): { year: number; month: Month1To12 }[] => {
  const options: { year: number; month: Month1To12 }[] = [];

  const datePlusOneMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  };

  for (
    let date = startDate;
    date.getTime() <= endDate.getTime();
    date = datePlusOneMonth(date)
  ) {
    options.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });
  }

  return options;
};

type Properties = {
  startDate: Date;
  endDate: Date;
  selectedYear: number;
  selectedMonth: Month1To12;
  onMonthYearChange: (month: Month1To12, year: number) => void;
};

const MonthDisplayControls: React.FC<Properties> = (props) => {
  const monthOptions = enumerateMonthOptions(props.startDate, props.endDate);

  if (monthOptions.length == 0) {
    return null;
  } else if (monthOptions.length == 1) {
    return (
      <h3 className="text-2xl text-center mb-8">
        {SORTED_MONTHS[monthOptions[0].month - 1]} {monthOptions[0].year}
      </h3>
    );
  }

  const previousMonthEnabled =
    props.selectedYear > monthOptions[0].year ||
    props.selectedMonth > monthOptions[0].month;

  const nextMonthEnabled =
    props.selectedYear < monthOptions[monthOptions.length - 1].year ||
    props.selectedMonth < monthOptions[monthOptions.length - 1].month;

  const onClickPreviousMonth = () => {
    const month = props.selectedMonth > 1 ? props.selectedMonth - 1 : 12;
    const year = month == 12 ? props.selectedYear - 1 : props.selectedYear;

    props.onMonthYearChange(month, year);
  };

  const onClickNextMonth = () => {
    const month = props.selectedMonth < 12 ? props.selectedMonth + 1 : 1;
    const year = month == 1 ? props.selectedYear + 1 : props.selectedYear;

    props.onMonthYearChange(month, year);
  };

  const onSelectMonth = (event) => {
    const optionKey = event.target.value;
    const year = parseInt(optionKey.substr(0, 4), 10);
    const month = parseInt(optionKey.substr(5, 2), 10);

    props.onMonthYearChange(month, year);
  };

  const formatYYYYMM = (year: number, month: Month1To12) => {
    return `${year}-${month < 10 ? "0" + month : month}`;
  };

  return (
    <div className="text-center mb-8 choice-group">
      <button
        className="big choice"
        disabled={!previousMonthEnabled}
        onClick={onClickPreviousMonth}
      >
        &lt;
      </button>
      <select
        style={{ textAlignLast: "center" }}
        className="big appearance-none choice text-center max-w-sm"
        value={formatYYYYMM(props.selectedYear, props.selectedMonth)}
        onChange={onSelectMonth}
      >
        {monthOptions.map(({ year, month }) => {
          const optionKey = formatYYYYMM(year, month);

          return (
            <option key={optionKey} value={optionKey}>
              {SORTED_MONTHS[month - 1]} {year}
            </option>
          );
        })}
      </select>
      <button
        className="big choice"
        disabled={!nextMonthEnabled}
        onClick={onClickNextMonth}
      >
        &gt;
      </button>
    </div>
  );
};

export default MonthDisplayControls;
