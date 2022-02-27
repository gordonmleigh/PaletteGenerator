import { PaletteColor } from "../util/PaletteColor";
import { createOrUpdatePaintStyle } from "./createOrUpdatePaintStyle";

export async function drawChipsCommand(
  color: PaletteColor<string>
): Promise<void> {
  let fontLoaded = false;

  const stops = Object.entries(color.stops).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const container = figma.createFrame();
  container.layoutMode = "HORIZONTAL";
  container.primaryAxisSizingMode = "AUTO";
  container.counterAxisSizingMode = "AUTO";

  const selected = figma.currentPage.selection[0];
  if (selected?.type === "FRAME") {
    selected.appendChild(container);
  }

  for (const [stop, value] of stops) {
    const chipContainer = figma.createFrame();
    chipContainer.layoutMode = "VERTICAL";
    chipContainer.primaryAxisSizingMode = "AUTO";
    chipContainer.counterAxisSizingMode = "AUTO";
    chipContainer.itemSpacing = 4;
    container.appendChild(chipContainer);

    const style = createOrUpdatePaintStyle(`${color.name}/${stop}`, [value], {
      noUpdate: true,
    });

    const chip = figma.createRectangle();
    chip.resize(64, 64);
    chip.fillStyleId = style.id;
    chipContainer.appendChild(chip);

    const stopText = figma.createText();

    if (!fontLoaded && stopText.fontName !== figma.mixed) {
      await figma.loadFontAsync(stopText.fontName);
      fontLoaded = true;
    }
    stopText.layoutAlign = "STRETCH";
    stopText.textAlignHorizontal = "CENTER";
    stopText.characters = stop;
    chipContainer.appendChild(stopText);
  }
}
