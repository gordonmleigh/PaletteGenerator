import debug from "./debug";
import { Message } from "./messages";

const trace = debug("msg:ui");

export function sendToHost(message: Message): void {
  trace("%o", message);
  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
}
