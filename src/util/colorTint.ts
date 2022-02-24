import Color from "color";

const white = Color("#fff");

export function colorTint(
  color: Color,
  ratio: number,
  { lightenRatio = 1 }: { lightenRatio?: number } = {}
): Color {
  const hsl = color.lightness(
    color.lightness() + (100 - color.lightness()) * ratio
  );
  const rgb = color.mix(white, ratio);
  return rgb.mix(hsl, lightenRatio);
}
