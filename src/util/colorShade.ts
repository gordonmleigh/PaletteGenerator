import Color from "color";

export function colorShade(color: Color, ratio: number): Color {
  return color.darken(1 - ratio);
}
