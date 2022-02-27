import { colorTint } from "./colorTint";
import { getColorRatio } from "./getColorRatio";
import { PaletteColor } from "./PaletteColor";

export function calculateLightenRatio(color: PaletteColor): number | undefined {
  const center = color.center;
  const stop600 = color.stops["600"];
  if (!stop600) {
    return;
  }

  const l0 = colorTint(center, 0.2, { lightenRatio: 0 });
  const l1 = colorTint(center, 0.2, { lightenRatio: 1 });
  return getColorRatio(l0, l1, stop600);
}
