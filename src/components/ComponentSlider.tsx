import clsx from "clsx";
import Color from "color";
import React, { useCallback } from "react";
import { useStyleSheet } from "../hooks/useStyleSheet";
import { useUniqueId } from "../hooks/useUniqueId";

export interface ComponentSliderProps {
  color?: Color;
  colorMax?: Color;
  colorMin?: Color;
  formatValue?: (value: number) => string;
  label?: string;
  onChange?: (value: number) => void;
  max?: number;
  min?: number;
  step?: number;
  value?: number;
}

const DefaultFormatValue: Required<ComponentSliderProps>["formatValue"] = (v) =>
  v.toFixed(0);

export function ComponentSlider({
  color,
  colorMax,
  colorMin,
  formatValue = DefaultFormatValue,
  label,
  max = 100,
  min = 0,
  onChange,
  step = 1,
  value,
}: ComponentSliderProps) {
  const id = useUniqueId();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange && onChange(+e.target.value),
    [onChange]
  );

  useStyleSheet(() => {
    if (!color || !colorMax || !colorMin || value === undefined) {
      return;
    }

    // the middle point is necessary to make sure the gradient goes via the
    // middle point
    const percent = ((100 * (value - min)) / (max - min)).toFixed(5);

    return `
      #${id}::-webkit-slider-runnable-track {
        background: linear-gradient(to right, ${colorMin.toString()}, ${color.toString()} ${percent}%, ${colorMax.toString()});
      }
      #${id}::-moz-range-track {
        background: linear-gradient(to right, ${colorMin.toString()}, ${color.toString()} ${percent}%, ${colorMax.toString()});
      }
      #${id}::-ms-track {
        background: linear-gradient(to right, ${colorMin.toString()}, ${color.toString()} ${percent}%, ${colorMax.toString()});
      }
      #${id}::-webkit-slider-thumb {
        background-color: ${color.toString()};
      }
      #${id}::-moz-range-thumb {
        background-color: ${color.toString()};
      }
      #${id}::-ms-thumb {
        background-color: ${color.toString()};
      }`;
  }, [color, colorMax, colorMin, id, value, min, max]);

  return (
    <div className="stack-row col-gap-md stack-equal-lengths">
      <label htmlFor={id} className="type-right">
        {label}
      </label>
      <input
        className={clsx("grow-3", {
          "color-range-input": colorMax && colorMin,
        })}
        id={id}
        type="range"
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        value={value}
      />
      <div className="type-color-minor">
        {value != undefined && formatValue(value)}
      </div>
    </div>
  );
}
