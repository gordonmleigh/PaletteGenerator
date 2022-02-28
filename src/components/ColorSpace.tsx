import Color from "color";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useEventListener } from "../hooks/useEventListener";

export interface ColorSpaceProps {
  children?: React.ReactNode;
  height?: number;
  hue: number;
  mode?: "hsv" | "hsl";
  width?: number;
}

export function ColorSpace({
  children,
  hue,
  mode = "hsv",
  height: propHeight,
  width: propWidth,
}: ColorSpaceProps) {
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const hsv = mode === "hsv";

  function measure() {
    if (!containerRef.current) {
      return;
    }
    setHeight(containerRef.current.clientHeight);
    setWidth(containerRef.current.clientWidth);
  }

  useLayoutEffect(() => {
    measure();
  }, []);

  useEventListener("resize", () => measure());

  useLayoutEffect(() => {
    if (!canvasRef || !height || !width) {
      return;
    }
    const context = canvasRef.getContext("2d");
    if (!context) {
      return;
    }
    const imgData = context.getImageData(0, 0, width, height);
    const pixels = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;

        const color = hsv
          ? Color.hsv(hue, (100 * x) / width, (100 * y) / height)
          : Color.hsl(hue, (100 * x) / width, (100 * y) / height);

        const rgb = color.rgb().object();
        pixels[offset] = rgb.r;
        pixels[offset + 1] = rgb.g;
        pixels[offset + 2] = rgb.b;
        pixels[offset + 3] = 255;
      }
    }
    context.putImageData(imgData, 0, 0);
  }, [canvasRef, height, hsv, hue, width]);

  return (
    <div
      ref={containerRef}
      style={{ height: propHeight, position: "relative", width: propWidth }}
    >
      <canvas ref={setCanvasRef} height={height} width={width} />
      {children}
    </div>
  );
}
