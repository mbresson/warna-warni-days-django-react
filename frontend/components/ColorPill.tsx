import React, { useState } from "react";
import {
  computeBrightness,
  hexToRGB,
  Brightness,
} from "common/utils/colorutils";
import { HexRRGGBB } from "common/types";
import { SliderPicker } from "react-color";

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
