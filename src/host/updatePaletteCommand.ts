import { UpdatePaletteMessage } from "../util/messages";
import { getPaletteCommand } from "./getPaletteCommand";
import { PaintStyles } from "./PaintStyles";
import { deserializePaletteColor } from "./serializePalette";

export function updatePaletteCommand(msg: UpdatePaletteMessage) {
  const styles = new PaintStyles();
  const { prev, next } = msg;

  if (prev) {
    for (const deleteKey in prev.stops) {
      if (!msg.next || !(deleteKey in msg.next.stops)) {
        styles.delete(`${prev.name}/${deleteKey}`);
      }
    }
  }
  if (prev && next && prev.name !== next.name) {
    styles.renameGroup(prev.name, next.name);
  }
  if (next) {
    styles.updateColor(deserializePaletteColor(next));
  }
  getPaletteCommand();
}
