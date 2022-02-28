import { MessageType } from "../util/messages";
import { sendToUI } from "../util/sendToUI";
import { PaintStyles } from "./PaintStyles";
import { serializePalette } from "./serializePalette";

export function getPaletteCommand() {
  sendToUI({
    type: MessageType.SendPalette,
    palette: serializePalette(new PaintStyles().getPalette()),
  });
}
