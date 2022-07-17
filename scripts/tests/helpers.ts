import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import * as path from "pathe";

// Return file names
/* export const readDir = (dirPath: string, extension: string): string[] => {
  const fileArr: string[] = [];
  for (const file of fs.readdirSync(dirPath)) {
    const fileExtension = file.split(".")[1];
    if (extension === fileExtension) {
      fileArr.push(file);
    }
  }

  return fileArr;
};

// Return string of all contentss
export const readDirContents = (dirPath: string, fileNames: string[]): string[] => {
  const fileContents: string[] = [];

  for (const file of fileNames) {
    const content = fs
      .readFileSync(path.join(dirPath, file))
      .toString()
      // Remove whitespace due to possible diffs
      .replace(/\s/g, "");
    fileContents.push(content);
  }
  return fileContents;
}; */

export const getFixturePath = (fontId: string, fileName: string) => path.join(path.dirname(fileURLToPath(import.meta.url)), `./generic/data/${fontId}/${fileName}`)
export const getFixture = (fontId: string, fileName: string) => fs.readFileSync(getFixturePath(fontId, fileName), "utf8")

export const getFixturesFromMock = (fontId: string, fileNames: string[], mockCalls: any[], type = "other") => {
  const results: string[][] = [];
  for (const fileName of fileNames) {
    const fixture = getFixture(fontId, fileName);
    const mockPath = `fonts/${type}/${fontId}/${fileName}`
    const mockCall = mockCalls.find(call => call[0] === mockPath);
    if (mockCall === undefined) {
      throw new Error(`Could not find mock call for ${mockPath}`);
    }
    results.push([fixture, mockCall[1]])
  }
  return results;
}