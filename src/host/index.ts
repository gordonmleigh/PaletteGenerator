import { createOrUpdatePaintStyle } from "../util/createOrUpdatePaintStyle";
import { getPaletteStyles } from "../util/getPaletteStyles";
import { Message, MessageType, UpdatePaletteMessage } from "../util/messages";
import { sendToUI } from "../util/sendToUI";

figma.showUI(__html__, {
  height: 25 * 16,
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

function getPaletteCommand() {
  sendToUI({
    type: MessageType.SendPalette,
    palette: getPaletteStyles(),
  });
}

function updatePaletteCommand(msg: UpdatePaletteMessage) {
  const styles = figma.getLocalPaintStyles();

  if (msg.delete) {
    for (const deleteKey of msg.delete) {
      const style = styles.find((x) => x.name === deleteKey);
      style?.remove();
    }
  }
  if (msg.update) {
    for (const [key, value] of Object.entries(msg.update)) {
      createOrUpdatePaintStyle(key, value);
    }
  }
  getPaletteCommand();
}
