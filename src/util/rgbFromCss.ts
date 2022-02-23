import Color from "color";

export function rgbFromCss(css: string): RGB {
  const color = Color(css);
  return {
    r: color.red() / 255,
    g: color.green() / 255,
    b: color.blue() / 255,
  };
}
