import Color from "color";
import React from "react";
import { ColorSpace } from "./ColorSpace";

export interface ColorPlotProps {
  colors?: (string | Color)[];
  height?: number;
  hue: number;
  markerBorder?: number;
  markerSize?: number;
  mode?: "hsv" | "hsl";
  width?: number;
}

export function ColorPlot({
  colors,
  markerBorder = 2,
  markerSize = 10,
  ...props
}: ColorPlotProps) {
  const hsv = props.mode === "hsv";
  return (
    <ColorSpace {...props}>
      {colors?.map((x, i) => {
        const c = typeof x === "string" ? Color(x) : x;

        return (
          <div
            key={`color-${i}`}
            style={{
              backgroundColor: c.toString(),
              borderColor: "#fff",
              borderRadius: markerSize,
              borderStyle: "solid",
              borderWidth: markerBorder,
              boxShadow:
                "0 0 5px 2px rgba(0, 0, 0, .05), 1px 1px 3px 1px rgba(0, 0, 0, .15)",
              height: markerSize,
              left: hsv ? `${c.saturationv()}%` : `${c.saturationl()}%`,
              marginLeft: -markerSize / 2 - markerBorder,
              marginTop: -markerSize / 2 - markerBorder,
              position: "absolute",
              top: hsv ? `${c.value()}%` : `${c.lightness()}%`,
              width: markerSize,
            }}
          />
        );
      })}
    </ColorSpace>
  );
}
