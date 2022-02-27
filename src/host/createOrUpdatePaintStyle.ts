import { rgbFromCss } from "../util/rgbFromCss";

export function createOrUpdatePaintStyle(
  name: string,
  colors: (RGB | string)[],
  opts?: { noUpdate?: boolean }
): PaintStyle {
  let created = false;
  let style = figma.getLocalPaintStyles().find((x) => x.name === name);
  if (!style) {
    created = true;
    style = figma.createPaintStyle();
    style.name = name;
  }
  if (created || !opts?.noUpdate) {
    style.paints = colors.map(
      (color): Paint => ({
        color: typeof color === "string" ? rgbFromCss(color) : color,
        type: "SOLID",
      })
    );
  }
  return style;
}
