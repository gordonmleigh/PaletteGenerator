import { Message } from "../messages";
import debug from "./debug";

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
