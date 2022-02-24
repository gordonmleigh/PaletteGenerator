import Color from "color";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ColorModal } from "./components/ColorModal";
import { useEventListener } from "./hooks/useEventListener";
import { PaletteColorState } from "./state/PaletteColorState";
import { PaletteState } from "./state/PaletteState";
import "./styles.scss";
import { Message, MessageType, PluginMessage } from "./util/messages";
import { sendToHost } from "./util/sendToHost";

function App() {
  const [palette, setPalette] = useState<PaletteState>();
  const [selectedColor, setSelectedColor] = useState<number>();

  useEventListener("message", (e: MessageEvent<PluginMessage<Message>>) => {
    const msg = e.data.pluginMessage;
    switch (msg.type) {
      case MessageType.SendPalette:
        const colors = Object.entries(msg.palette).map(([name, value]) => ({
          name,
          stops: Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, Color(v)])
          ),
          value: Color(value["500"]),
        }));
        colors.sort((a, b) => a.name.localeCompare(b.name));
        setPalette({ colors });
        break;
    }
  });

  useEffect(() => {
    sendToHost({
      type: MessageType.RequestPalette,
    });
  }, []);

  function save(color: PaletteColorState) {
    const existing = palette?.colors.find((x) => x.name === color.name);
    if (!existing) {
      return;
    }
    const deletes: string[] = [];

    for (const key in existing.stops) {
      if (!color.stops[key]) {
        deletes.push(`${color.name}/${key}`);
      }
    }

    sendToHost({
      type: MessageType.UpdatePalette,
      delete: deletes,
      update: Object.fromEntries(
        Object.entries(color.stops).map(([k, v]) => [
          `${color.name}/${k}`,
          v.unitObject(),
        ])
      ),
    });
    setSelectedColor(undefined);
  }

  return (
    <>
      <div className="box-modal box-scroll-y stack-col py-md">
        {palette &&
          palette.colors.map(({ name, stops: stopMap, value }, i) => {
            const stops = Object.entries(stopMap);
            const stopCount =
              stops.length === 1 ? `1 stop` : `${stops.length} stops`;

            return (
              <div
                key={name}
                className="stack-row col-gap-md p-md px-lg bg-hover clickable"
                onClick={() => setSelectedColor(i)}
              >
                <div
                  className="square-hg grow-0 shrink-0"
                  style={{ backgroundColor: value.toString() }}
                />
                <div className="stack-col stack-equal-lengths">
                  <div className="stack-row">
                    {stops
                      .sort(([a], [b]) =>
                        a.padStart(5, "0").localeCompare(b.padStart(5, "0"))
                      )
                      .map(([key, stop]) => (
                        <div
                          className="square-md"
                          key={key}
                          style={{ backgroundColor: stop.toString() }}
                        ></div>
                      ))}
                  </div>
                  <div className="stack-row stack-row-center col-gap-sm">
                    <div>{name}</div>
                    <div className="type-color-minor">({stopCount})</div>
                  </div>
                  <div className="stack-row stack-align-center">
                    {value.hex().toString()}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {palette && selectedColor !== undefined && (
        <ColorModal
          color={palette.colors[selectedColor]}
          onClose={() => setSelectedColor(undefined)}
          onSave={save}
        />
      )}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("app-root"));
