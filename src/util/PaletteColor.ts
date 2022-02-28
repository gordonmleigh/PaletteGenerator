import Color from "color";
import { PaletteColorMetadata } from "./PaletteColorMetadata";

export interface PaletteColor<ColorType = Color> {
  center: ColorType;
  meta?: PaletteColorMetadata;
  name: string;
  stops: Record<string, ColorType>;
}
