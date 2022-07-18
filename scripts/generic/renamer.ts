import glob from "glob";
import * as fs from "node:fs/promises";

const weightNames = [
  "thin",
  "hairline",
  "extralight",
  "extra-light",
  "ultralight",
  "ultra-light",
  "light",
  "normal",
  "regular",
  "medium",
  "semibold",
  "semi-bold",
  "demibold",
  "demi-bold",
  "extrabold",
  "extra-bold",
  "ultrabold",
  "ultra-bold",
  "bold",
  "black",
];
const weightNum = [
  100, 100, 200, 200, 200, 200, 300, 400, 400, 500, 600, 600, 600, 600, 800,
  800, 800, 800, 700, 900,
];

const parser = async (files: string[]) => {
  for (const file of files) {
    const lowerCaseFile = file.toLowerCase();
    for (const [index] of weightNames.entries()) {
      const fileNew = lowerCaseFile.replace(
        weightNames[index],
        String(weightNum[index])
      );

      try {
        // eslint-disable-next-line no-await-in-loop
        await fs.rename(file, fileNew);
      } catch {
        // Continue
      }
    }
  }
};

const fontFileDir = `scripts/generic/files`;

glob(`${fontFileDir}/**/*.woff2`, {}, async (_err, files) => {
  await parser(files);
});

glob(`${fontFileDir}/**/*.woff`, {}, async (_err, files) => {
  await parser(files);
});

glob(`${fontFileDir}/**/*.ttf`, {}, async (_err, files) => {
  await parser(files);
});
