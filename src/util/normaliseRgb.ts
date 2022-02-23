export function normaliseRgb(rgb: RGB): RGB {
  return {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255,
  };
}
