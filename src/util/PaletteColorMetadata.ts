import { number, object, optional } from "@fmtk/decoders";
import { json } from "./json";

export const PaletteColorMetadataKey = "gradient-meta";

export interface PaletteColorMetadata {
  lightenRatio?: number;
}

export const decodePaletteColorMetadata = object<PaletteColorMetadata>({
  lightenRatio: optional(number),
});

export const decodePaletteColorMetadataJson = json(decodePaletteColorMetadata);
