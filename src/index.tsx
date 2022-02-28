import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { GenerateModal } from "./components/GenerateModal";
import { useEventListener } from "./hooks/useEventListener";
import {
  deserializePalette,
  serializePaletteColor,
} from "./host/serializePalette";
import "./styles.scss";
import { Message, MessageType, PluginMessage } from "./util/messages";
import { Palette } from "./util/Palette";
import { PaletteColor } from "./util/PaletteColor";
import { sendToHost } from "./util/sendToHost";

function App() {
  const [palette, setPalette] = useState<Palette>();
  const [selectedColor, setSelectedColor] = useState<number>();

  useEventListener("message", (e: MessageEvent<PluginMessage<Message>>) => {
    const msg = e.data.pluginMessage;
    switch (msg.type) {
      case MessageType.SendPalette:
        setPalette(deserializePalette(msg.palette));
        break;
    }
  });

  useEffect(() => {
    sendToHost({
      type: MessageType.RequestPalette,
    });
  }, []);

  function save(prev: PaletteColor | undefined, next: PaletteColor) {
    const deletes: string[] = [];

    if (prev) {
      for (const key in prev.stops) {
        if (next.name !== prev.name || !next.stops[key]) {
          deletes.push(`${prev.name}.${key}`);
        }
      }
    }

    sendToHost({
      type: MessageType.UpdatePalette,
      delete: deletes,
      update: serializePaletteColor(next),
    });
    setSelectedColor(undefined);
  }

  return (
    <>
      <div className="box-modal box-scroll-y stack-col py-md">
        {palette &&
          palette.colors.map(({ name, stops: stopMap, center }, i) => {
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
                  style={{ backgroundColor: center.toString() }}
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
                  <div className="stack-row stack-col-center col-gap-sm">
                    <div>{name}</div>
                    <div className="type-color-minor">({stopCount})</div>
                  </div>
                  <div className="stack-row stack-align-center">
                    {center.hex().toString()}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {palette && selectedColor !== undefined && (
        <GenerateModal
          color={palette.colors[selectedColor]}
          onCancel={() => setSelectedColor(undefined)}
          onSave={(next) => save(palette.colors[selectedColor], next)}
        />
      )}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("app-root"));
