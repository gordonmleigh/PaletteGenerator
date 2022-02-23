import { Palette } from "./getPaletteStyles";

export interface PluginMessage<T> {
  pluginMessage: T;
}

export enum MessageType {
  RequestPalette = "RequestPalette",
  SendPalette = "SendPalette",
}

export interface RequestPaletteMessage {
  type: MessageType.RequestPalette;
}

export interface SendPaletteMessage {
  type: MessageType.SendPalette;
  palette: Palette;
}

export type Message = RequestPaletteMessage | SendPaletteMessage;
