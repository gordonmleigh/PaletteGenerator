import { createOrUpdatePaintStyle } from "../util/createOrUpdatePaintStyle";
import { PaletteColor } from "../util/PaletteColor";
import { PaletteColorMetadataKey } from "../util/PaletteColorMetadata";

export function updatePaletteStyles(color: PaletteColor) {
  for (const [key, value] of Object.entries(color.stops)) {
    const style = createOrUpdatePaintStyle(
      `${color.name}/${key}`,
      value.rgb().unitObject()
    );
    if (key === "500" && color.meta) {
      style.setPluginData(PaletteColorMetadataKey, JSON.stringify(color.meta));
    }
  }
}
