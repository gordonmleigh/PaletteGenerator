import Color from "color";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useEventListener } from "./hooks/useEventListener";
import { Message, MessageType, PluginMessage } from "./messages";
import "./styles.scss";
import { sendToHost } from "./util/sendToHost";

interface PaletteColorState {
  name: string;
  stops: Record<string, Color>;
  value: Color;
}

interface PaletteState {
  colors: PaletteColorState[];
}

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

  return (
    <div>
      <div className="stack-col py-md">
        {palette &&
          palette.colors.map(({ name, stops: stopMap, value }, i) => {
            const stops = Object.entries(stopMap);
            const stopCount =
              stops.length === 1 ? `1 stop` : `${stops.length} stops`;

            return (
              <div
                key={name}
                className="stack-row stack-stretch gap-md p-md px-lg bg-hover clickable"
                onClick={() => setSelectedColor(i)}
              >
                <div
                  className="square-hg stack-grow-0 stack-shrink-0"
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
                  <div className="stack-row stack-align-center gap-sm">
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
      {selectedColor !== undefined && (
        <div className="box-modal bg-default">
          <div className="stack-col stack-stretch">
            <div className="h-xl stack-row stack-stretch">
              <div className="grow-1"></div>
              <div className="shrink-1 w-xl">
                <i className="fa-solid fa-xmark" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app-root"));
