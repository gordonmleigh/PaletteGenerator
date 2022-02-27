import { Palette } from "./Palette";
import { PaletteColor } from "./PaletteColor";

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
  palette: Palette<string>;
}

export interface UpdatePaletteMessage {
  type: MessageType.UpdatePalette;
  delete?: string[];
  name: string;
  update?: PaletteColor<string>;
}

export type Message =
  | RequestPaletteMessage
  | SendPaletteMessage
  | UpdatePaletteMessage;
