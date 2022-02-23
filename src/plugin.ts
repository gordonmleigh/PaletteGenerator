import { Message, MessageType } from "./messages";
import { getPaletteStyles } from "./util/getPaletteStyles";
import { sendToUI } from "./util/sendToUI";

figma.showUI(__html__, {
  height: 25 * 16,
  width: 30 * 16,
});

figma.ui.onmessage = (msg: Message) => {
  switch (msg.type) {
    case MessageType.RequestPalette:
      getPaletteCommand();
  }
};

function getPaletteCommand() {
  sendToUI({
    type: MessageType.SendPalette,
    palette: getPaletteStyles(),
  });
}
