import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DayData, HexRRGGBB } from "../common/types";
import { PRESET_COLORS } from "../common/utils/colorutils";
import { dateToLocalYYYYMMDD } from "../common/utils/dateutils";
import { createDay, updateDay } from "../common/apis/days";
import { useAuth, AuthStateAuthenticated } from "../common/AuthProvider";
import { ColorPill, CustomizableColorPill } from "./ColorPill";
import { SliderPicker } from "react-color";

type Properties = {
  onCancel: () => void;
  onSaved: () => void;
  day?: DayData;
  date: Date;
};

const DayFormModal: React.FC<Properties> = (props) => {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);
  const [day, setDay] = useState<DayData>(props.day);
  const [customColor, setCustomColor] = useState<HexRRGGBB | null>(
    PRESET_COLORS.includes(props.day?.color) ? null : props.day?.color
  );
  const [error, setError] = useState("");
  const [queryInProgress, setQueryInProgress] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const auth = useAuth() as AuthStateAuthenticated;

  useEffect(() => {
    ref.current = document.querySelector("#portal-root");
    setMounted(true);
  });

  if (!mounted) {
    return null;
  }

  const isToday =
    dateToLocalYYYYMMDD(new Date()) == dateToLocalYYYYMMDD(props.date);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setQueryInProgress(true);

    if (props.day) {
      const response = await updateDay(auth.username, day);
      setQueryInProgress(false);

      if (response.state == "succeeded") {
        props.onSaved();
      } else {
        setError(response.error);
      }
    } else {
      const newDay = {
        ...day,
        date: dateToLocalYYYYMMDD(props.date),
      };
      const response = await createDay(auth.username, newDay);
      setQueryInProgress(false);

      if (response.state == "succeeded") {
        props.onSaved();
      } else {
        setError(response.error);
      }
    }
  };

  return createPortal(
    <>
      <div className="absolute top-0 left-0 w-screen min-h-screen bg-opacity-90 bg-gray-300 p-2 lg:p-16">
        <div
          style={{
            background: day?.color
              ? `radial-gradient(white, ${day.color})`
              : "white",
          }}
          className="p-4 border border-gray-500"
        >
          <form
            className="text-center border border-gray-500 bg-white p-6 w-full h-full"
            onSubmit={onSubmit}
          >
            <div>
              <h2 className="main-title">{props.date.toLocaleDateString()}</h2>

              <h3 className="text-2xl my-8">
                What color {isToday ? "is" : "was"} your day?
              </h3>

              {PRESET_COLORS.map((color) => (
                <div
                  key={color}
                  className={
                    "inline-block border-2 mx-1 p-1 cursor-pointer rounded-lg hover:border-black " +
                    (color == day?.color ? "border-black" : "border-gray-200")
                  }
                  onClick={() => {
                    setDay({
                      ...day,
                      color,
                    });
                  }}
                >
                  <ColorPill color={color} />
                </div>
              ))}

              <div
                className={
                  "relative inline-block border-2 mx-1 p-1 cursor-pointer rounded-lg hover:border-black z-20 " +
                  (day && customColor == day?.color
                    ? "border-black"
                    : "border-gray-200")
                }
                onClick={() => {
                  setPickerOpen(true);
                }}
              >
                <CustomizableColorPill color={customColor} />

                {pickerOpen && (
                  <div
                    style={{ left: "50%", transform: "translate(-50%, 0)" }}
                    className="absolute top-0 z-20 mt-16 w-64 h-auto border bg-white border-gray-500 p-8 box-content"
                  >
                    <SliderPicker
                      onChange={(color) => {
                        const hex = color.hex.toUpperCase();

                        if (day && customColor == day?.color) {
                          setDay({
                            ...day,
                            color: hex,
                          });
                        }
                        setCustomColor(hex);
                      }}
                      color={customColor}
                    />

                    <button
                      type="button"
                      className="mt-8 medium positive-feeling"
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.stopPropagation();
                        setPickerOpen(false);
                        setDay({
                          ...day,
                          color: customColor,
                        });
                      }}
                    >
                      Select
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-2xl my-8">
                <label htmlFor="notes">Do you want to leave some notes?</label>
              </h3>

              <textarea
                name="notes"
                id="notes"
                className="m-auto w-full lg:w-3/4 h-48 resize-none"
                onChange={(e) => {
                  setDay({
                    ...day,
                    notes: e.target.value,
                  });
                }}
              >
                {day?.notes}
              </textarea>
            </div>

            {error && <p className="bad-feeling text-2xl my-8">{error}</p>}

            <div className="mt-8">
              <button
                className="big positive-feeling"
                type="submit"
                disabled={queryInProgress}
              >
                {queryInProgress ? "loading..." : "Save"}
              </button>

              <strong className="mx-5 text-xl hidden sm:inline">or</strong>

              <button
                className="ml-4 sm:ml-0 big mixed-feeling"
                disabled={queryInProgress}
                onClick={props.onCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {pickerOpen && (
        <div
          className="fixed top-0 w-full h-full bg-opacity-90 bg-gray-300 z-10"
          onClick={() => {
            setPickerOpen(false);
          }}
        ></div>
      )}
    </>,
    ref.current
  );
};

export default DayFormModal;
