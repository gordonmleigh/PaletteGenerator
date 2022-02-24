import Color from "color";
import React, { useEffect, useMemo, useState } from "react";
import { generateStops } from "../util/generateStops";

export interface GenerateModalProps {
  center: Color;
  onCancel: () => void;
  onSave: (stops: Record<string, Color>) => void;
}

export function GenerateModal({
  center,
  onCancel,
  onSave,
}: GenerateModalProps) {
  const [lightenRatio, setLightenRatio] = useState(1);
  const [addStop950, setAddStop950] = useState(true);
  const [addStop990, setAddStop990] = useState(true);
  const [stops, setStops] = useState<Record<string, Color>>({});

  const sortedStops = useMemo(
    () =>
      Object.entries(stops)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, v]) => v),
    [stops]
  );

  useEffect(() => {
    setStops(
      generateStops(center, {
        addStop950,
        addStop990,
        lightenRatio,
      })
    );
  }, [addStop950, addStop990, center, lightenRatio]);

  return (
    <div className="box-modal bg-default stack-col">
      <div className="h-hg stack-row stack-row-center stack-col-center type-bold type-large">
        Generate Tints and Shades
      </div>
      <div className="grow-1 px-xl stack-col row-gap-lg">
        <div>
          Use this tool to replace the existing stops with a new set generated
          according to the settings below.
        </div>
        <div className="stack-col row-gap-md">
          <div className="stack-col row-gap-sm">
            <label htmlFor="lightenRange">Lighten ratio</label>
            <input
              id="lightenRange"
              type="range"
              onChange={(e) => setLightenRatio(+e.target.value)}
              min={0}
              max={1}
              step={0.01}
              value={lightenRatio}
            />
            <div>{lightenRatio.toFixed(2)}</div>
          </div>
          <div className="stack-row col-gap-md stack-row-center">
            <input
              id="stop95"
              type="checkbox"
              checked={addStop950}
              onChange={(e) => setAddStop950(e.target.checked)}
            />
            <label htmlFor="stop95">Include stop 950</label>
          </div>
          <div className="stack-row col-gap-md stack-row-center">
            <input
              id="stop99"
              type="checkbox"
              checked={addStop990}
              onChange={(e) => setAddStop990(e.target.checked)}
            />
            <label htmlFor="stop99">Include stop 990</label>
          </div>
        </div>
        <div className="stack-row stack-col-center">
          {sortedStops.map((x, i) => (
            <div
              key={`color-${i}`}
              className="square-xl"
              style={{ backgroundColor: x.toString() }}
            />
          ))}
        </div>
      </div>
      <div className="stack-row shrink-0 stack-col-space-between">
        <button
          className="shrink-1 stack-row stack-align-center p-lg clickable bg-hover"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="shrink-1 stack-row stack-align-center p-lg clickable bg-hover"
          onClick={() => onSave(stops)}
        >
          Generate
        </button>
      </div>
    </div>
  );
}
