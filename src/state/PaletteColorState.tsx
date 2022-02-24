import Color from "color";

export interface PaletteColorState {
  name: string;
  stops: Record<string, Color>;
  value: Color;
}
