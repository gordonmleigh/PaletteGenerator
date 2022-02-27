import Color from "color";
import { colorToPointRgb } from "./colorToPointRgb";
import debug from "./debug";

const trace = debug("getColorRatio");

export function getColorRatio(
  x: Color,
  y: Color,
  mid: Color
): number | undefined {
  const xp = colorToPointRgb(x);
  const yp = colorToPointRgb(y);
  const mp = colorToPointRgb(mid);

  const xy = yp.map((d, i) => d - xp[i]);
  const xm = mp.map((d, i) => d - xp[i]);
  const my = yp.map((d, i) => d - mp[i]);

  const lxy = Math.sqrt(xy.reduce((a, x) => a + x ** 2, 0));
  const lxm = Math.sqrt(xm.reduce((a, x) => a + x ** 2, 0));
  const lmy = Math.sqrt(my.reduce((a, x) => a + x ** 2, 0));

  const delta = Math.abs(lxm + lmy - lxy) / lxy;
  if (delta > 0.001) {
    // points aren't on the same line (accounting for rounding errors)
    trace("delta is %o so ignoring", delta);
    return;
  }

  return lxm / lxy;
}
