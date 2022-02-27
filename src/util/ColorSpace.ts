export interface ColorComponent {
  label: string;
  range: number;
}

export const ColorSpaces: Record<"rgb" | "hsl" | "hsv", ColorComponent[]> = {
  rgb: [
    {
      label: "red",
      range: 255,
    },
    {
      label: "green",
      range: 255,
    },
    {
      label: "blue",
      range: 255,
    },
  ],
  hsl: [
    {
      label: "hue",
      range: 259,
    },
    {
      label: "saturation",
      range: 100,
    },
    {
      label: "lightness",
      range: 100,
    },
  ],
  hsv: [
    {
      label: "hue",
      range: 259,
    },
    {
      label: "saturation",
      range: 100,
    },
    {
      label: "value",
      range: 100,
    },
  ],
};

export type ColorSpaceName = keyof typeof ColorSpaces;
