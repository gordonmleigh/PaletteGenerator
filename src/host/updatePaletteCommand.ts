import { UpdatePaletteMessage } from "../util/messages";
import { getPaletteCommand } from "./getPaletteCommand";
import { deserializePaletteColor } from "./serializePalette";
import { updatePaletteStyles } from "./updatePaletteStyles";

export function updatePaletteCommand(msg: UpdatePaletteMessage) {
  const styles = figma.getLocalPaintStyles();

  if (msg.delete) {
    for (const deleteKey of msg.delete) {
      const style = styles.find((x) => x.name === deleteKey);
      style?.remove();
    }
  }
  if (msg.update) {
    updatePaletteStyles(deserializePaletteColor(msg.update));
  }
  getPaletteCommand();
}
