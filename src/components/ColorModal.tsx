import Color from "color";
import React, { useReducer, useState } from "react";
import { PaletteColorState } from "../state/PaletteColorState";
import { tryParseColor } from "../util/tryParseColor";
import { GenerateModal } from "./GenerateModal";

export interface ColorModalProps {
  color: PaletteColorState;
  onClose: () => void;
  onSave: (color: PaletteColorState) => void;
}

interface ColorEditState {
  colors: Record<string, Color | undefined>;
  values: Record<string, string>;
}

type ColorEditAction =
  | {
      type: "setColor";
      key: string;
      value: string;
    }
  | {
      type: "reset";
      colors: Record<string, Color>;
    };

export function ColorModal({ color, onClose, onSave }: ColorModalProps) {
  const [showGenerate, setShowGenerate] = useState(false);

  const [editState, dispatch] = useReducer(
    (state: ColorEditState, action: ColorEditAction): ColorEditState => {
      switch (action.type) {
        case "reset":
          return {
            colors: { ...action.colors },
            values: Object.fromEntries(
              Object.entries(action.colors).map(([k, v]) => [
                k,
                v.hex().toString(),
              ])
            ),
          };

        case "setColor":
          return {
            colors: {
              ...state.colors,
              [action.key]: tryParseColor(action.value),
            },
            values: {
              ...state.values,
              [action.key]: action.value,
            },
          };
      }
      return state;
    },
    {
      colors: { ...color.stops },
      values: Object.fromEntries(
        Object.entries(color.stops).map(([k, v]) => [k, v.hex().toString()])
      ),
    }
  );

  function reset(colors: Record<string, Color>) {
    dispatch({
      type: "reset",
      colors,
    });
    setShowGenerate(false);
  }

  function save() {
    if (!editState.colors["500"]) {
      return;
    }
    const ret: PaletteColorState = {
      name: color.name,
      stops: {},
      value: editState.colors["500"],
    };
    for (const [key, value] of Object.entries(editState.colors)) {
      if (!value) {
        return;
      }
      ret.stops[key] = value;
    }
    onSave(ret);
  }

  function setColor(key: string, value: string) {
    dispatch({
      type: "setColor",
      key,
      value,
    });
  }

  return (
    <>
      <div className="box-modal bg-default stack-col">
        <div className="p-lg stack-col">
          <div className="stack-row col-gap-lg">
            <div
              className="square-xh"
              style={{ backgroundColor: color.value.toString() }}
            ></div>
            <div className="stack-col stack-equal-lengths">
              <div>{color.name}</div>
              <div>
                <input
                  type="text"
                  onChange={(e) => setColor("500", e.target.value)}
                  value={color.value.hex().toString()}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grow-1 stack-col box-scroll-y row-gap-md px-lg">
          {Object.entries(editState.colors)
            .sort(([a], [b]) =>
              a.padStart(5, "0").localeCompare(b.padStart(5, "0"))
            )
            .map(([key, stop]) => (
              <div
                className="shrink-0 stack-row col-gap-lg stack-row-center"
                key={key}
              >
                <div
                  className="square-xl"
                  key={key}
                  style={{ backgroundColor: stop?.toString() }}
                ></div>
                <div>{key}</div>
                <div>
                  <input
                    onChange={(e) => setColor(key, e.target.value)}
                    type="text"
                    value={editState.values[key]}
                  />
                </div>
              </div>
            ))}
        </div>
        <div className="stack-row shrink-0 stack-col-space-between">
          <button
            className="shrink-1 stack-row stack-align-center p-lg clickable bg-hover"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="shrink-1 stack-row stack-align-center p-lg clickable bg-hover">
            Draw chips
          </button>
          <button
            className="shrink-1 stack-row stack-align-center p-lg clickable bg-hover"
            onClick={() => setShowGenerate(true)}
          >
            Generate
          </button>
          <button
            className="shrink-1 stack-row stack-align-center p-lg clickable bg-hover"
            onClick={save}
          >
            Save
          </button>
        </div>
      </div>
      {showGenerate && (
        <GenerateModal
          center={color.value}
          onCancel={() => setShowGenerate(false)}
          onSave={reset}
        />
      )}
    </>
  );
}
