import clsx from "clsx";
import Color from "color";
import React, { useEffect, useState } from "react";
import { useEvent } from "../hooks/useEvent";
import { ColorSpaceName, ColorSpaces } from "../util/ColorSpace";
import { deepEqualDispatch } from "../util/deepEqualDispatch";
import { ComponentSlider } from "./ComponentSlider";
import { setArrayIndex } from "./setArrayIndex";

export interface AdjustColorProps {
  className?: string;
  color: Color;
  mode: ColorSpaceName;
  onChange?: (value: Color) => void;
}

export function AdjustColor({
  className,
  color,
  mode,
  onChange,
}: AdjustColorProps) {
  const [components, _setComponents] = useState<number[]>(
    color[mode]().array()
  );
  const setComponents = deepEqualDispatch(_setComponents);

  useEffect(() => {
    setComponents(color[mode]().array());
  }, [color, mode]);

  useEvent(onChange, (raise) => raise(Color[mode](...components)), [
    components,
  ]);

  function setComponent(index: number, value: number) {
    setComponents((prev) => setArrayIndex(prev, index, value));
  }

  return (
    <div className={clsx("stack-col row-gap-md stack-row-fill", className)}>
      {ColorSpaces[mode].map((x, i) => (
        <ComponentSlider
          color={color}
          colorMax={Color[mode](...setArrayIndex(components, i, x.range))}
          colorMin={Color[mode](...setArrayIndex(components, i, 0))}
          key={`${mode}${i}`}
          label={x.label.slice(0, 1).toLocaleUpperCase() + x.label.slice(1)}
          onChange={(v) => setComponent(i, v)}
          max={x.range}
          value={components[i]}
        />
      ))}
    </div>
  );
}
