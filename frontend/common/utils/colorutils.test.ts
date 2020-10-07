import { HexRRGGBB } from "../types";

import { Brightness, computeBrightness, hexToRGB, RGB } from "./colorutils";

describe("hexToRGB", () => {
  test("converts #RRGGBB hexadecimal format to RGB array", () => {
    const hexColorsToExpectedRGB: [HexRRGGBB, RGB][] = [
      ["#000000", [0, 0, 0]],
      ["#123456", [18, 52, 86]],
      ["#FFFFFF", [255, 255, 255]],
    ];

    for (let [hexColor, expectedRGB] of hexColorsToExpectedRGB) {
      const rgb = hexToRGB(hexColor);

      expect(rgb).toEqual(expectedRGB);
    }
  });
});

describe("computeBrightness", () => {
  test("correctly finds if a color is rather light or rather dark", () => {
    const colorsToExpectedBrightness: [RGB, Brightness][] = [
      [[0, 0, 0], Brightness.Dark],
      [[255, 255, 255], Brightness.Light],
    ];

    for (let [rgbColor, expectedBrightness] of colorsToExpectedBrightness) {
      const brightness = computeBrightness(rgbColor);

      expect(brightness).toEqual(expectedBrightness);
    }
  });
});
