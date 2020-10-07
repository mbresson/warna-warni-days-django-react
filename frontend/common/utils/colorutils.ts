import { HexRRGGBB } from "../types";

export type RGB = [number, number, number];

export const hexToRGB = (color: HexRRGGBB): RGB => {
  const redPart = color.substr(1, 2);
  const greenPart = color.substr(3, 2);
  const bluePart = color.substr(5, 2);

  return [
    parseInt(redPart, 16),
    parseInt(greenPart, 16),
    parseInt(bluePart, 16),
  ];
};

export enum Brightness {
  Light,
  Dark,
}

export const computeBrightness = ([red, green, blue]: RGB): Brightness => {
  // adapted from https://github.com/bgrins/TinyColor
  // with a different dark/light threshold (192 instead of 128) due to personal taste

  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness < 192 ? Brightness.Dark : Brightness.Light;
};
