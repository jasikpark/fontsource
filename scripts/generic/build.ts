import consola from "consola"
import glob from "glob";
import fs from "node:fs/promises";

import { config } from "./config";
import { packager } from "./generic-packager";

const run = async () => {

  const {
    fontId,
    fontName,
    defSubset,
    unicodeRange,
    category,
    sourcelink,
    licenselink,
    version,
    type,
  } = config;

  // Create folder structure
  const fontFileDir = "scripts/generic/files";
  const fontDir = `scripts/generic/${fontId}`;
  try {
    await fs.access(fontDir);
    await fs.access(`${fontDir}/files`);
  } catch {
    await fs.mkdir(fontDir);
    await fs.mkdir(`${fontDir}/files`);
  }

  // Move files into package dir
  try {
    await fs.cp(fontFileDir, `${fontDir}/files`);
  } catch (error) {
    consola.error(error);
  }

  consola.success("Copied files into package.");
  // Read filenames to derive the following information
  glob(`${fontFileDir}/**/*.woff2`, {}, async (err, files) => {
    let subsets: string[] = [];
    let weights: number[] = [];
    let styles: string[] = [];

    for (const file of files) {
      // Remove file path and extension.
      // 23 characters to account for scripts / generic /...filepath, -6 for .woff2
      const name = file.slice(23 + fontId.length, -6).split("-");
      styles.push(name.slice(-1)[0]);
      name.pop();
      weights.push(Number(name.slice(-1)[0]));
      name.pop();
      subsets.push(name.join("-"));
    }
    subsets = [...new Set(subsets)];
    weights = [...new Set(weights)];
    styles = [...new Set(styles)];

    if (err) {
      consola.error(err);
    }

    // Create object to store all necessary data to run package function
    const datetime = new Date();

    const fontObject = {
      fontId,
      fontName,
      subsets,
      weights,
      styles,
      defSubset,
      unicodeRange,
      variable: false,
      lastModified: datetime.toISOString().slice(0, 10),
      category,
      source: sourcelink,
      license: licenselink,
      version,
      type,

      fontDir,
      packageVersion: undefined,
    };

    // Generate files (false for rebuildFlag)
    await packager(fontObject, false);

    consola.success(`Finished processing ${fontId}.`);
  });
}

await run();