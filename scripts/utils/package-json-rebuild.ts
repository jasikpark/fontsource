/* eslint-disable no-await-in-loop */
import stringify from "json-stringify-pretty-compact";
import fs from "node:fs/promises";

import { getDirectories, readParse } from "./utils";

const packageRewrite = async (type: string) => {
  const directories = await getDirectories(type);
  for (const directory of directories) {
    const fontDir = `./fonts/${type}/${directory}`;
    const metadata = await readParse(`${fontDir}/metadata.json`);
    const packageJSON = await readParse(`${fontDir}/package.json`);
    await fs.rm(`${fontDir}/package.json`);
    await fs.writeFile(`${fontDir}/package.json`, stringify({
      name: packageJSON.name,
      version: packageJSON.version,
      description: `Self-host the ${metadata.fontName} font in a neatly bundled NPM package.`,
      main: "index.css",
      publishConfig: {
        access: "public",
      },
      keywords: packageJSON.keywords,
      author: "Lotus <declininglotus@gmail.com>",
      license: "MIT",
      homepage: `https://github.com/fontsource/fontsource/tree/main/fonts/${type}/${metadata.fontId}#readme`,
      repository: {
        type: "git",
        url: "https://github.com/fontsource/fontsource.git",
        directory: `fonts/${type}/${metadata.fontId}`,
      },
    }));
  }
};

await packageRewrite("google");
await packageRewrite("league");
await packageRewrite("icons");
await packageRewrite("other");
