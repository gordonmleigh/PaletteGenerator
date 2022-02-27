import Color from "color";

export function colorToPointRgb(
  color: Color
): [r: number, g: number, b: number] {
  return [color.red(), color.green(), color.blue()];
}
