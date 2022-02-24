import { Palette, PaletteColour } from "./getPaletteStyles";

export interface PluginMessage<T> {
  pluginMessage: T;
}

export enum MessageType {
  RequestPalette = "RequestPalette",
  SendPalette = "SendPalette",
  UpdatePalette = "UpdatePalette",
}

export interface RequestPaletteMessage {
  type: MessageType.RequestPalette;
}

export interface SendPaletteMessage {
  type: MessageType.SendPalette;
  palette: Palette;
}

export interface UpdatePaletteMessage {
  type: MessageType.UpdatePalette;
  delete?: string[];
  update?: PaletteColour;
}

export type Message =
  | RequestPaletteMessage
  | SendPaletteMessage
  | UpdatePaletteMessage;
