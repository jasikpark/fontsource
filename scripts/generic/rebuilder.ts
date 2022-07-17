/* eslint-disable no-await-in-loop */
import consola from "consola"
import fs from "node:fs/promises";

import { getDirectories, readParse } from "../utils/utils";
import { packager } from "./generic-packager";

interface Metadata {
  fontId: string;
  fontName: string;
  subsets: string[];
  weights: number[];
  styles: string[];
  defSubset: string;
  variable: boolean;
  lastModified: string;
  version: string;
  category: string;
  source: string;
  license: string;
  type: string;
}

interface UnicodeRange {
  [subset: string]: string;
}

const rebuild = async (type: string) => {
  const directories = await getDirectories(type);
  for (const directory of directories) {
    const fontDir = `./fonts/${type}/${directory}`;
    try {
      const metadata: Metadata = await readParse(
        `${fontDir}/metadata.json`
      );

      let unicodeRange: UnicodeRange = {};
      try {
        await fs.access(`${fontDir}/unicode.json`);
        unicodeRange = await readParse(`${fontDir}/unicode.json`);
      } catch {
        // Continue
      }
      // Rebuild only non-Google fonts
      if (metadata.type !== "google") {
        const packageJSONData = await readParse(
          `${fontDir}/package.json`
        );

        // Clear directory
        await fs.cp(`${fontDir}/files`, `./scripts/temp_packages/${directory}`);
        await fs.rm(fontDir, { recursive: true, force: true });
        await fs.mkdir(fontDir)
        await fs.cp(
          `./scripts/temp_packages/${directory}`,
          `./${fontDir}/files`
        );
        await fs.rm(`./scripts/temp_packages/${directory}`, { recursive: true, force: true });

        // Create object to store all necessary data to run package function
        const fontObject = {
          fontId: metadata.fontId,
          fontName: metadata.fontName,
          subsets: metadata.subsets,
          weights: metadata.weights.map(Number),
          styles: metadata.styles,
          defSubset: metadata.defSubset,
          unicodeRange,
          variable: false,
          lastModified: metadata.lastModified,
          version: metadata.version,
          category: metadata.category,
          source: metadata.source,
          license: metadata.license,
          type: metadata.type,

          fontDir,
          packageVersion: packageJSONData.version,
        };

        // Generate files (true for rebuildFlag)
        await packager(fontObject, true);

        consola.success(`Finished processing ${metadata.fontId}.`);
      }
    } catch (error) {
      consola.error(error);
    }
  }
};

await rebuild("league");
await rebuild("icons");
await rebuild("other");
