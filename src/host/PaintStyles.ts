import Color from "color";
import { denormaliseRgb } from "../util/denormaliseRgb";
import { Palette } from "../util/Palette";
import { PaletteColor } from "../util/PaletteColor";
import {
  decodePaletteColorMetadataJson,
  PaletteColorMetadataKey,
} from "../util/PaletteColorMetadata";
import { rgbFromCss } from "../util/rgbFromCss";

const STYLE_REGEXP = /^(.+)\/(\d+)$/;

export class PaintStyles {
  private styles: PaintStyle[];

  constructor() {
    this.styles = figma.getLocalPaintStyles();
  }

  public get(name: string): PaintStyle | undefined {
    return this.styles.find((x) => x.name === name);
  }

  public createOrUpdateSolidFill(
    name: string,
    color: RGB | string
  ): PaintStyle {
    const style = this.getOrCreate(name);

    style.paints = [
      {
        color: typeof color === "string" ? rgbFromCss(color) : color,
        type: "SOLID",
      },
    ];

    return style;
  }

  public delete(name: string): void {
    const index = this.styles.findIndex((x) => x.name === name);
    if (index < 0) {
      return;
    }
    this.styles.splice(index, 1)[0].remove();
  }

  public getOrCreate(
    name: string,
    opts?: {
      init?: (style: PaintStyle) => void;
      update?: (style: PaintStyle) => void;
    }
  ): PaintStyle {
    let style = this.get(name);
    if (!style) {
      style = figma.createPaintStyle();
      style.name = name;
      this.styles.push(style);

      if (opts?.init) {
        opts.init(style);
      }
    } else if (opts?.update) {
      opts.update(style);
    }
    return style;
  }

  public getPalette(): Palette {
    const colors: Record<string, PaletteColor> = {};

    for (const style of this.styles) {
      if (style.paints.length !== 1) {
        continue;
      }
      const paint = style.paints[0];
      if (paint.type !== "SOLID") {
        continue;
      }
      const match = style.name.match(STYLE_REGEXP);
      if (!match) {
        continue;
      }
      const [, name, stop] = match;

      const color = colors[name] ?? {
        center: Color(),
        name,
        stops: {},
      };
      colors[name] = color;

      color.stops[stop] = Color.rgb(denormaliseRgb(paint.color));

      if (stop === "500") {
        color.center = color.stops["500"];
        const meta = style.getPluginData(PaletteColorMetadataKey);
        const result = decodePaletteColorMetadataJson(meta);

        if (result.ok) {
          color.meta = result.value;
        }
      }
    }

    return {
      colors: Object.values(colors)
        .filter((x) => x.stops["500"])
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }

  public renameGroup(groupName: string, newName: string): void {
    for (const style of this.styles) {
      if (!style.name.startsWith(groupName + "/")) {
        continue;
      }
      const name = style.name.slice(groupName.length + 1);
      style.name = newName + "/" + name;
    }
  }

  public updateColor(color: PaletteColor): void {
    for (const [key, value] of Object.entries(color.stops)) {
      const style = this.createOrUpdateSolidFill(
        `${color.name}/${key}`,
        value.rgb().unitObject()
      );
      if (key === "500" && color.meta) {
        style.setPluginData(
          PaletteColorMetadataKey,
          JSON.stringify(color.meta)
        );
      }
    }
  }
}
