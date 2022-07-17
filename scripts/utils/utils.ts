import fs from "node:fs/promises";
import { join } from "pathe"

// Generate filenames and paths
// Used by the downloader into repo
const makeFontDownloadPath = (
  fontDir: string,
  fontId: string,
  subset: string,
  weight: number,
  style: string,
  extension: string
): string => `./${fontDir}/files/${fontId}-${subset}-${weight}-${style}.${extension}`;

const makeVariableFontDownloadPath = (
  fontDir: string,
  fontId: string,
  subset: string,
  type: string,
  style: string
): string => `./${fontDir}/files/${fontId}-${subset}-variable-${type}-${style}.woff2`;

// Used for the CSS filepaths
const makeFontFilePath = (
  fontId: string,
  subset: string,
  weight: number,
  style: string,
  extension: string
): string => `./files/${fontId}-${subset}-${weight}-${style}.${extension}`;

const makeVariableFontFilePath = (
  fontId: string,
  subset: string,
  type: string,
  style: string
): string => `./files/${fontId}-${subset}-variable-${type}-${style}.woff2`;

// Insert a weight array to find the closest number given num - used for index.css gen
const findClosest = (arr: number[], num: number): number => {
  // Array of absolute values showing diff from target number
  const indexArr = arr.map(weight => Math.abs(Number(weight) - num));
  // Find smallest diff
  const min = Math.min(...indexArr);
  const closest = arr[indexArr.indexOf(min)];

  return closest;
};

// Find names of all packages.
const getDirectories = async (type: string) => {
  const dir = await fs.readdir(`./fonts/${type}`, { withFileTypes: true })
  return dir.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
}

const readParse = async (filePath: string) =>
  JSON.parse(await fs.readFile(join(process.cwd(), filePath), "utf8"));

export {
  findClosest,
  getDirectories,
  makeFontDownloadPath,
  makeFontFilePath,
  makeVariableFontDownloadPath,
  makeVariableFontFilePath,
  readParse,
};
