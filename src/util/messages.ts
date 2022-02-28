import { Palette } from "./Palette";
import { PaletteColor } from "./PaletteColor";

export interface PluginMessage<T> {
  pluginMessage: T;
}

export enum MessageType {
  DrawChips = "DrawChips",
  RequestPalette = "RequestPalette",
  SendPalette = "SendPalette",
  UpdatePalette = "UpdatePalette",
}

export interface DrawChipsMessage {
  type: MessageType.DrawChips;
  color: PaletteColor<string>;
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
  update?: PaletteColor<string>;
}

export type Message =
  | DrawChipsMessage
  | RequestPaletteMessage
  | SendPaletteMessage
  | UpdatePaletteMessage;
