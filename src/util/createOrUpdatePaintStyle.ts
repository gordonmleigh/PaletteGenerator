import { rgbFromCss } from "./rgbFromCss";

export function createOrUpdatePaintStyle(
  name: string,
  ...colors: (RGB | string)[]
): PaintStyle {
  let style = figma.getLocalPaintStyles().find((x) => x.name === name);
  if (!style) {
    style = figma.createPaintStyle();
    style.name = name;
  }
  style.paints = colors.map(
    (color): Paint => ({
      color: typeof color === "string" ? rgbFromCss(color) : color,
      type: "SOLID",
    })
  );
  return style;
}
