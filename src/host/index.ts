import { Message, MessageType } from "../util/messages";
import { getPaletteCommand } from "./getPaletteCommand";
import { updatePaletteCommand } from "./updatePaletteCommand";

figma.showUI(__html__, {
  height: 30 * 16,
  width: 30 * 16,
});

figma.ui.onmessage = (msg: Message) => {
  switch (msg.type) {
    case MessageType.RequestPalette:
      getPaletteCommand();
      break;

    case MessageType.UpdatePalette:
      updatePaletteCommand(msg);
      break;
  }
};
