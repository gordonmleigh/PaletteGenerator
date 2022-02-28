import clsx from "clsx";
import Color from "color";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { serializePaletteColor } from "../host/serializePalette";
import { calculateLightenRatio } from "../util/calculateLightenRatio";
import { ColorSpaceName } from "../util/ColorSpace";
import { formatPercentage } from "../util/formatPercentage";
import { generateStops } from "../util/generateStops";
import { MessageType } from "../util/messages";
import { PaletteColor } from "../util/PaletteColor";
import { sendToHost } from "../util/sendToHost";
import { tryParseColor } from "../util/tryParseColor";
import { AdjustColor } from "./AdjustColor";
import { ColorPlot } from "./ColorPlot";
import { ComponentSlider } from "./ComponentSlider";

export interface GenerateModalProps {
  color: PaletteColor;
  onCancel: () => void;
  onSave: (color: PaletteColor) => void;
}

enum ColorTab {
  Stops,
  Color,
  Options,
  Draw,
}

interface ColorStopState {
  key: string;
  value: Color;
}

interface GenerateModalState {
  addStop950: boolean;
  addStop990: boolean;
  adjustEnabled: boolean;
  center: Color;
  centerText: string;
  lightenRatio: number;
  name: string;
  stops: ColorStopState[];
}

type GenerateModalAction =
  | { type: "reinit"; color: PaletteColor }
  | { type: "setCenter"; value: Color }
  | { type: "setCenterText"; value: string }
  | {
      type: "setGenerateOptions";
      addStop950?: boolean;
      addStop990?: boolean;
      adjustEnabled?: boolean;
      lightenRatio?: number;
    }
  | { type: "setName"; name: string };

export function GenerateModal({ color, onCancel, onSave }: GenerateModalProps) {
  const [hsv, setHsv] = useState(true);
  const [selectedTab, selectTab] = useState(ColorTab.Stops);
  const [colorMode, setColorMode] = useState<ColorSpaceName>("rgb");

  const [
    {
      addStop950,
      addStop990,
      adjustEnabled,
      center,
      centerText,
      lightenRatio,
      name,
      stops,
    },
    dispatch,
  ] = useReducer(reducer, color, (color) => ({
    addStop950: !!color.stops["950"],
    addStop990: !!color.stops["950"],
    adjustEnabled: false,
    center: color.center,
    centerText: color.center.hex(),
    lightenRatio: color.meta?.lightenRatio ?? calculateLightenRatio(color) ?? 1,
    name: color.name,
    stops: stopsToArray(color.stops),
  }));

  useEffect(() => {
    dispatch({
      type: "reinit",
      color,
    });
  }, [color]);

  const handleSave = useCallback(() => {
    onSave({
      center,
      meta: { lightenRatio },
      name,
      stops: stopsFromArray(stops),
    });
  }, [center, lightenRatio, name, onSave, stops]);

  const setCenter = useCallback((value: Color) => {
    dispatch({
      type: "setCenter",
      value,
    });
  }, []);

  const setCenterText = useCallback((value: string) => {
    dispatch({
      type: "setCenterText",
      value,
    });
  }, []);

  const setGenerateOptions = useCallback(
    (value: {
      addStop950?: boolean;
      addStop990?: boolean;
      adjustEnabled?: boolean;
      lightenRatio?: number;
    }) => {
      dispatch({
        type: "setGenerateOptions",
        ...value,
      });
    },
    []
  );

  const setName = useCallback((name: string) => {
    dispatch({
      type: "setName",
      name,
    });
  }, []);

  function drawChips() {
    sendToHost({
      type: MessageType.DrawChips,
      color: serializePaletteColor({
        ...color,
        center,
        stops: stopsFromArray(stops),
      }),
    });
  }

  return (
    <div className="box-modal bg-default stack-col">
      <div className="stack-row bb p-lg col-gap-lg stack-row-center">
        <div
          className="square-hg"
          style={{ backgroundColor: center.toString() }}
        />
        <div className="stack-col row-gap-sm">
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="Colour name"
            value={name}
          />
          <input
            type="text"
            onChange={(e) => setCenterText(e.target.value)}
            placeholder="Center colour"
            value={centerText}
          />
        </div>
      </div>
      <div className="stack-row bb py-md px-lg col-gap-xl">
        <div
          className={clsx("clickable", {
            "type-color-minor": selectedTab !== ColorTab.Stops,
          })}
          onClick={() => selectTab(ColorTab.Stops)}
        >
          Stops
        </div>
        <div
          className={clsx("clickable", {
            "type-color-minor": selectedTab !== ColorTab.Color,
          })}
          onClick={() => selectTab(ColorTab.Color)}
        >
          Color
        </div>
        <div
          className={clsx("clickable", {
            "type-color-minor": selectedTab !== ColorTab.Options,
          })}
          onClick={() => selectTab(ColorTab.Options)}
        >
          Options
        </div>
        <div
          className={clsx("clickable", {
            "type-color-minor": selectedTab !== ColorTab.Draw,
          })}
          onClick={() => selectTab(ColorTab.Draw)}
        >
          Draw
        </div>
      </div>
      {selectedTab === ColorTab.Stops ? (
        <div className="grow-1 p-lg stack-col stack-wrap bb row-gap-sm col-gap-sm basis-0">
          {stops.map(({ key, value: stop }) => (
            <div className="stack-row col-gap-md stack-row-center" key={key}>
              <div className="type-color-minor w-xl type-right">{key}</div>
              <div
                className="square-lg"
                style={{ backgroundColor: stop.toString() }}
              />
              <div>{stop.hex()}</div>
            </div>
          ))}
        </div>
      ) : selectedTab === ColorTab.Draw ? (
        <div className="grow-1 p-lg stack-col bb row-gap-sm col-gap-sm basis-0">
          <div>
            You can use this tool to draw paint chips on to your canvas.
          </div>
          <div className="stack-row stack-row-center stack-col-center">
            <div
              className="px-lg py-md bg-hover clickable type-bold"
              onClick={drawChips}
            >
              Draw chips
            </div>
          </div>
        </div>
      ) : !adjustEnabled ? (
        <div className="grow-1 p-lg stack-col row-gap-lg bb">
          <div>
            Editing is currently disabled. Enabling it will replace all existing
            stops with generated values.
          </div>
          <div className="stack-row col-gap-md stack-col-center stack-row-center">
            <input
              className="clickable"
              id="enableAdjust"
              type="checkbox"
              checked={adjustEnabled}
              onChange={(e) =>
                setGenerateOptions({ adjustEnabled: e.target.checked })
              }
            />
            <label className="clickable" htmlFor="enableAdjust">
              Enable
            </label>
          </div>
        </div>
      ) : selectedTab === ColorTab.Color ? (
        <div className="grow-1 stack-row row-gap-lg bb">
          <div className="stack-col row-gap-sm px-xl py-lg br">
            <div
              className={clsx("clickable", {
                "type-color-minor": colorMode !== "rgb",
              })}
              onClick={() => setColorMode("rgb")}
            >
              RGB
            </div>
            <div
              className={clsx("clickable", {
                "type-color-minor": colorMode !== "hsl",
              })}
              onClick={() => setColorMode("hsl")}
            >
              HSL
            </div>
            <div
              className={clsx("clickable", {
                "type-color-minor": colorMode !== "hsv",
              })}
              onClick={() => setColorMode("hsv")}
            >
              HSV
            </div>
          </div>
          <AdjustColor
            className="grow-1 p-lg"
            color={center}
            mode={colorMode}
            onChange={setCenter}
          />
        </div>
      ) : selectedTab === ColorTab.Options ? (
        <div className="grow-1 p-lg stack-col row-gap-lg bb">
          <div className="stack-col row-gap-md stack-row-fill">
            <ComponentSlider
              formatValue={formatPercentage}
              label="Lighten ratio"
              max={1}
              min={0}
              onChange={(lightenRatio) => setGenerateOptions({ lightenRatio })}
              step={0.01}
              value={lightenRatio}
            />
            <div className="stack-row col-gap-md stack-col-center stack-row-center">
              <input
                className="clickable"
                id="stop95"
                type="checkbox"
                checked={addStop950}
                onChange={(e) =>
                  setGenerateOptions({ addStop950: e.target.checked })
                }
              />
              <label className="clickable" htmlFor="stop95">
                Include stop 950
              </label>
            </div>
            <div className="stack-row col-gap-md stack-col-center stack-row-center">
              <input
                className="clickable"
                id="stop99"
                type="checkbox"
                checked={addStop990}
                onChange={(e) =>
                  setGenerateOptions({ addStop990: e.target.checked })
                }
              />
              <label className="clickable" htmlFor="stop99">
                Include stop 990
              </label>
            </div>
          </div>
        </div>
      ) : undefined}
      <div className="stack-col row-gap-lg py-lg">
        <div className="stack-row stack-col-center col-gap-lg shrink-0">
          <div className="stack-col stack-col-end row-gap-md grow-1 shrink-0 basis-0">
            <div
              className={clsx("clickable", {
                "type-color-minor": !hsv,
              })}
              onClick={() => setHsv(true)}
            >
              HSV
            </div>
            <div
              className={clsx("clickable", {
                "type-color-minor": hsv,
              })}
              onClick={() => setHsv(false)}
            >
              HSL
            </div>
          </div>
          <ColorPlot
            hue={center.hue()}
            height={128}
            width={192}
            mode={hsv ? "hsv" : "hsl"}
            colors={stops.map(({ value }) => value)}
          />
          <div className="grow-1 shrink-0 basis-0"></div>
        </div>
        <div className="stack-row stack-row-center stack-col-center shrink-0">
          {stops.map((x, i) => (
            <div
              key={`color-${i}`}
              className="square-xl"
              style={{ backgroundColor: x.toString() }}
            />
          ))}
        </div>
      </div>
      <div className="stack-row shrink-0 stack-col-space-between bt">
        <button
          className="shrink-1 stack-row stack-align-center p-lg clickable bg-hover"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="shrink-1 stack-row stack-align-center p-lg clickable bg-hover"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function reducer(
  state: GenerateModalState,
  action: GenerateModalAction
): GenerateModalState {
  switch (action.type) {
    case "reinit":
      return {
        ...state,
        center: action.color.center,
        centerText: action.color.center.hex(),
        lightenRatio:
          action.color.meta?.lightenRatio ??
          calculateLightenRatio(action.color) ??
          1,
        name: action.color.name,
        stops: stopsToArray(action.color.stops),
      };

    case "setCenter":
      return updateColorStops({
        ...state,
        adjustEnabled: true,
        center: action.value,
        centerText: action.value.hex(),
      });

    case "setCenterText":
      return updateColorStops({
        ...state,
        adjustEnabled: true,
        center: tryParseColor(action.value) ?? state.center,
        centerText: action.value,
      });

    case "setGenerateOptions":
      return updateColorStops({
        ...state,
        addStop950: action.addStop950 ?? state.addStop950,
        addStop990: action.addStop990 ?? state.addStop990,
        adjustEnabled: action.adjustEnabled ?? state.adjustEnabled,
        lightenRatio: action.lightenRatio ?? state.lightenRatio,
      });

    case "setName":
      return {
        ...state,
        name: action.name,
      };
  }
  return state;
}

function updateColorStops(state: GenerateModalState): GenerateModalState {
  if (state.adjustEnabled) {
    const stops = generateStops(state.center, {
      addStop950: state.addStop950,
      addStop990: state.addStop990,
      lightenRatio: state.lightenRatio,
    });
    state.stops = stopsToArray(stops);
  }
  return state;
}

function stopsToArray(stops: Record<string, Color>): ColorStopState[] {
  const array = Object.entries(stops);
  array.sort(([a], [b]) => a.localeCompare(b));
  return array.map(([key, value]) => ({ key, value }));
}

function stopsFromArray(stops: ColorStopState[]): Record<string, Color> {
  return Object.fromEntries(stops.map(({ key, value }) => [key, value]));
}
