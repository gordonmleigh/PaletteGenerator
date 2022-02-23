import debug from "./debug";
import { Message } from "./messages";

const trace = debug("msg:host");

export function sendToUI(message: Message): void {
  trace("%o", message);
  figma.ui.postMessage(message);
}
