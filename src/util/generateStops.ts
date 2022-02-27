import Color from "color";
import { colorShade } from "./colorShade";
import { colorTint } from "./colorTint";

export function generateStops(
  center: Color,
  {
    addStop950,
    addStop990,
    darkenRatio,
    lightenRatio = 1,
  }: {
    addStop950?: boolean;
    addStop990?: boolean;
    darkenRatio?: number;
    lightenRatio?: number;
  } = {}
): Record<string, Color> {
  const colors: Record<string, Color> = {};

  for (let i = 1; i <= 4; ++i) {
    colors[`${i}00`] = colorShade(center, 1 - i / 5, { darkenRatio });
  }

  colors["500"] = center;

  for (let i = 1; i <= 4; ++i) {
    colors[`${i + 5}00`] = colorTint(center, i / 5, { lightenRatio });
  }

  if (addStop950) {
    colors["950"] = colorTint(center, 0.95, { lightenRatio });
  }
  if (addStop990) {
    colors["990"] = colorTint(center, 0.99, { lightenRatio });
  }

  return colors;
}
