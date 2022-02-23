import { Message } from "../messages";
import debug from "./debug";

const trace = debug("msg:host");

export function sendToUI(message: Message): void {
  trace("%o", message);
  figma.ui.postMessage(message);
}
