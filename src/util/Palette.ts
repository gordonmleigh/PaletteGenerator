import Color from "color";
import { PaletteColor } from "./PaletteColor";

export interface Palette<ColorType = Color> {
  colors: PaletteColor<ColorType>[];
}
