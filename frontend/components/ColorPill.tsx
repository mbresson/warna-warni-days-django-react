import React, { useState } from "react";
import {
  computeBrightness,
  hexToRGB,
  Brightness,
} from "../common/utils/colorutils";
import { HexRRGGBB } from "../common/types";
import ColorPicker from "./ColorPicker";
import { RGBColor, SliderPicker } from "react-color";

export const ColorPill: React.FC<{ color: HexRRGGBB }> = ({ color }) => {
  const brightness = computeBrightness(hexToRGB(color));

  return (
    <div style={{ background: color }} className="py-4 px-12 table rounded-lg">
      <div
        className={
          "align-middle table-cell text-center text-sm " +
          (brightness == Brightness.Dark ? "text-gray-100" : "text-gray-900")
        }
      >
        {color}
      </div>
    </div>
  );
};

export const CustomizableColorPill: React.FC<{
  color?: HexRRGGBB;
}> = ({ color }) => {
  const brightness = color
    ? computeBrightness(hexToRGB(color))
    : Brightness.Light;

  return (
    <div className="relative">
      <div
        style={{ background: color || "white" }}
        className={"py-4 table rounded-lg " + (color ? "px-6" : "px-12")}
      >
        <div
          className={
            "align-middle table-cell text-center text-sm font-bold " +
            (brightness == Brightness.Dark ? "text-gray-100" : "text-gray-900")
          }
        >
          {color ? "custom: " + color : "custom"}
        </div>
      </div>
    </div>
  );
};

export const OldCustomizableColorPill: React.FC<{
  color?: HexRRGGBB;
  onChange: (color: HexRRGGBB) => void;
  onSelect: () => void;
}> = ({ color, onChange, onSelect }) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const brightness = color
    ? computeBrightness(hexToRGB(color))
    : Brightness.Light;

  return (
    <div className="relative">
      <div
        style={{ background: color || "white" }}
        className={"py-4 table rounded-lg " + (color ? "px-6" : "px-12")}
        onClick={() => {
          setPickerOpen(true);
        }}
      >
        <div
          className={
            "align-middle table-cell text-center text-sm font-bold " +
            (brightness == Brightness.Dark ? "text-gray-100" : "text-gray-900")
          }
        >
          {color ? "custom: " + color : "custom"}
        </div>
      </div>

      {pickerOpen && (
        <div
          style={{ left: "50%", transform: "translate(-50%, 0)" }}
          className="absolute top-0 mt-16 w-64 h-auto border bg-white border-gray-500 p-8 box-content"
        >
          <SliderPicker
            onChange={({ hex }) => {
              onChange(hex);
            }}
            color={color}
          />

          <button
            className="mt-8 medium positive-feeling"
            onClick={() => {
              setPickerOpen(false);
              onSelect();
            }}
          >
            Select
          </button>
        </div>
      )}
    </div>
  );
};

/*


        <ColorPicker
          onChange={(color) => {
            console.log("new color = ", color);
          }}
        />

                    <CustomizableColorPill
              onChange={(color) => {
                setCustomColor(color);
              }}
              color={customColor}
              onSelect={() => {
                setDay({
                  ...day,
                  color: customColor,
                });
              }}
            />
*/
