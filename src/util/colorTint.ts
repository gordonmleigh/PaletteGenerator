import Color from "color";

const white = Color("#fff");

export function colorTint(
  color: Color,
  ratio: number,
  { lightenRatio = 1 }: { lightenRatio?: number } = {}
): Color {
  return color.lighten(lightenRatio * ratio).mix(white, ratio);
}
