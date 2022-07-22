/* eslint-disable no-await-in-loop */
import { APIv1 } from "google-font-metadata";
import * as fs from "node:fs/promises";

import { fontFace } from "../templates/css";
import { makeFontFilePath } from "../utils/utils";

const packagerV1 = async (id: string): Promise<void> => {
  const font = APIv1[id];
  const fontDir = `fonts/google/${font.id}`;

  // Generate CSS
  for (const subset of font.subsets) {
    const cssSubset: string[] = [];
    for (const weight of font.weights) {
      for (const style of font.styles) {
        // Some fonts may have variants 400, 400i, 700 but not 700i.
        if (style in font.variants[weight]) {
          const css = fontFace({
            fontId: font.id,
            fontName: font.family,
            style,
            subset,
            weight,
            woff2Path: makeFontFilePath(
              font.id,
              subset,
              weight,
              style,
              "woff2"
            ),
            woffPath: makeFontFilePath(font.id, subset, weight, style, "woff"),
            unicodeRange: false,
          });

          if (style === "normal") {
            const cssPath = `${fontDir}/${subset}-${weight}.css`;
            await fs.writeFile(cssPath, css);

            // Should only push normal variants into subset
            cssSubset.push(css);
          } else {
            // If italic or else, define specific style CSS file
            const cssStylePath = `${fontDir}/${subset}-${weight}-${style}.css`;
            await fs.writeFile(cssStylePath, css);
          }
        }
      }
    }
    const cssSubsetPath = `${fontDir}/${subset}.css`;
    await fs.writeFile(cssSubsetPath, cssSubset.join(""));
  }
};

export { packagerV1 };
