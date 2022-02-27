import { MessageType } from "../util/messages";
import { sendToUI } from "../util/sendToUI";
import { getPaletteStyles } from "./getPaletteStyles";
import { serializePalette } from "./serializePalette";

export function getPaletteCommand() {
  sendToUI({
    type: MessageType.SendPalette,
    palette: serializePalette(getPaletteStyles()),
  });
}
