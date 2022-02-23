import debug from "./debug";
import { denormaliseRgb } from "./denormaliseRgb";

const trace = debug("command:getPaletteStyles");

export interface PaletteColour {
  [stop: string]: RGB;
}

export interface Palette {
  [name: string]: PaletteColour;
}

const STYLE_REGEXP = /^(.+)\/(\d+)$/;

export function getPaletteStyles(): Palette {
  const styles = figma.getLocalPaintStyles();
  const palette: Palette = {};

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
    const [, group, stop] = match;
    trace("found %s %s = %o", group, stop, paint.color);
    const colour = palette[group] ?? {};
    colour[stop] = denormaliseRgb(paint.color);
    palette[group] = colour;
  }

  return palette;
}
