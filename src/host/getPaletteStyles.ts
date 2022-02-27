import Color from "color";
import debug from "../util/debug";
import { denormaliseRgb } from "../util/denormaliseRgb";
import { Palette } from "../util/Palette";
import { PaletteColor } from "../util/PaletteColor";
import {
  decodePaletteColorMetadataJson,
  PaletteColorMetadataKey,
} from "../util/PaletteColorMetadata";

const trace = debug("command:getPaletteStyles");

const STYLE_REGEXP = /^(.+)\/(\d+)$/;

export function getPaletteStyles(): Palette {
  const styles = figma.getLocalPaintStyles();
  const colors: Record<string, PaletteColor> = {};

  for (const style of styles) {
    if (style.paints.length !== 1) {
      continue;
    }
    const paint = style.paints[0];
    if (paint.type !== "SOLID") {
      continue;
    }
    const match = style.name.match(STYLE_REGEXP);
    if (!match) {
      continue;
    }
    const [, name, stop] = match;
    trace("found %s %s = %o", name, stop, paint.color);

    const color = colors[name] ?? {
      center: Color(),
      name,
      stops: {},
    };
    colors[name] = color;

    color.stops[stop] = Color.rgb(denormaliseRgb(paint.color));

    if (stop === "500") {
      color.center = color.stops["500"];
      const meta = style.getPluginData(PaletteColorMetadataKey);
      const result = decodePaletteColorMetadataJson(meta);

      if (result.ok) {
        color.meta = result.value;
      }
    }
  }

  return {
    colors: Object.values(colors)
      .filter((x) => x.stops["500"])
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}
