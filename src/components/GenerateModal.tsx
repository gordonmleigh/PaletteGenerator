import clsx from "clsx";
import Color from "color";
import React, { useEffect, useMemo, useState } from "react";
import { serializePaletteColor } from "../host/serializePalette";
import { calculateLightenRatio } from "../util/calculateLightenRatio";
import { ColorSpaceName } from "../util/ColorSpace";
import { formatPercentage } from "../util/formatPercentage";
import { generateStops } from "../util/generateStops";
import { MessageType } from "../util/messages";
import { PaletteColor } from "../util/PaletteColor";
import { sendToHost } from "../util/sendToHost";
import { AdjustColor } from "./AdjustColor";
import { ColorPlot } from "./ColorPlot";
import { ComponentSlider } from "./ComponentSlider";

export interface GenerateModalProps {
  color: PaletteColor;
  onCancel: () => void;
  onSave: (stops: Record<string, Color>) => void;
}

enum ColorTab {
  Stops,
  Color,
  Options,
  Draw,
}

export function GenerateModal({ color, onCancel, onSave }: GenerateModalProps) {
  const [adjustEnabled, setAdjustEnabled] = useState(false);
  const [lightenRatio, setLightenRatio] = useState(
    () => color.meta?.lightenRatio ?? calculateLightenRatio(color) ?? 1
  );
  const [addStop950, setAddStop950] = useState(!!color.stops["950"]);
  const [addStop990, setAddStop990] = useState(!!color.stops["990"]);
  const [hsv, setHsv] = useState(true);
  const [stops, setStops] = useState<Record<string, Color>>(color.stops ?? {});
  const [selectedTab, selectTab] = useState(ColorTab.Stops);
  const [colorMode, setColorMode] = useState<ColorSpaceName>("rgb");
  const [center, setCenter] = useState(color.center);

  const sortedStops = useMemo(
    () =>
      Object.entries(stops)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, v]) => v),
    [stops]
  );

  useEffect(() => {
    if (!adjustEnabled) {
      return;
    }
    setStops(
      generateStops(center, {
        addStop950,
        addStop990,
        lightenRatio,
      })
    );
  }, [addStop950, addStop990, adjustEnabled, center, lightenRatio]);

  function drawChips() {
    sendToHost({
      type: MessageType.DrawChips,
      color: serializePaletteColor(color),
    });
  }

  return (
    <div className="box-modal bg-default stack-col">
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
          {Object.entries(stops)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, stop]) => (
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
              onChange={(e) => setAdjustEnabled(e.target.checked)}
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
              onChange={setLightenRatio}
              step={0.01}
              value={lightenRatio}
            />
            <div className="stack-row col-gap-md stack-col-center stack-row-center">
              <input
                className="clickable"
                id="stop95"
                type="checkbox"
                checked={addStop950}
                onChange={(e) => setAddStop950(e.target.checked)}
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
                onChange={(e) => setAddStop990(e.target.checked)}
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
            colors={sortedStops}
          />
          <div className="grow-1 shrink-0 basis-0"></div>
        </div>
        <div className="stack-row stack-row-center stack-col-center shrink-0">
          {sortedStops.map((x, i) => (
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
          onClick={() => onSave(stops)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
