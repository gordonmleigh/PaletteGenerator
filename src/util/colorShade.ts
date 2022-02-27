import Color from "color";

const black = Color("#000");

export function colorShade(
  color: Color,
  ratio: number,
  { darkenRatio = 1 }: { darkenRatio?: number } = {}
): Color {
  const hsl = color.darken(ratio);
  const rgb = color.mix(black, ratio);
  return rgb.mix(hsl, darkenRatio);
}
