import Color from "color";
import { Palette } from "../util/Palette";
import { PaletteColor } from "../util/PaletteColor";

export function deserializePalette(palette: Palette<string>): Palette<Color> {
  return {
    colors: palette.colors.map(deserializePaletteColor),
  };
}

export function deserializePaletteColor(
  color: PaletteColor<string>
): PaletteColor<Color> {
  return {
    ...color,
    center: Color(color.center),
    stops: Object.fromEntries(
      Object.entries(color.stops).map(([k, v]) => [k, Color(v)])
    ),
  };
}

export function serializePalette(palette: Palette<Color>): Palette<string> {
  return {
    colors: palette.colors.map(serializePaletteColor),
  };
}

export function serializePaletteColor(
  color: PaletteColor<Color>
): PaletteColor<string> {
  return {
    ...color,
    center: color.center.hex(),
    stops: Object.fromEntries(
      Object.entries(color.stops).map(([k, v]) => [k, v.hex()])
    ),
  };
}
