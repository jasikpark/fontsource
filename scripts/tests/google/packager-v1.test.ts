import * as gfm from "google-font-metadata"
import * as fs from "node:fs/promises"
import { describe, expect, it, vi } from "vitest"

import { packagerV1 } from "../../google/packager-v1";
import { getFixturesFromMock } from '../helpers';
import APIv1Test from "./data/google-fonts-v1.json"
import APIv2Test from "./data/google-fonts-v2.json"
import APIVariableTest from "./data/variable.json"

vi.mock("node:fs/promises");


describe("Generate V1 CSS", () => {
  vi.spyOn(gfm, "APIv1", "get").mockReturnValue(APIv1Test as gfm.FontObjectV1)
  vi.spyOn(gfm, "APIv2", "get").mockReturnValue(APIv2Test as gfm.FontObjectV2)
  vi.spyOn(gfm, "APIVariable", "get").mockReturnValue(APIVariableTest as gfm.FontObjectVariable)

  it("Abel CSS", async () => {
    await packagerV1("abel");
    const fileNames = ["latin-400.css", "latin.css"].sort()

    const extraNames = [...fileNames, "CHANGELOG.md",
      "README.md",
      "files/file-list.json",
      "metadata.json",
      "package.json",
      "scss/mixins.scss",
      "unicode.json"]

    const filePaths = extraNames.map(file => `fonts/google/abel/${file}`).sort();
    expect(vi.mocked(fs.writeFile).mock.calls.map(tuple => tuple[0]).sort()).toEqual(filePaths)


    const cssContent = getFixturesFromMock("abel", fileNames, vi.mocked(fs.writeFile).mock.calls, "google", "google");
    for (const css of cssContent) {
      expect(css[0]).toEqual(css[1]);
    }

  });

  /* it("Cabin CSS", () => {
    packagerV1("cabin");
    const dirPath = "./fonts/google/cabin";
    const fileNames = readDir(dirPath, "css");

    expect(fileNames).toEqual([
      "latin-400-italic.css",
      "latin-400.css",
      "latin-500-italic.css",
      "latin-500.css",
      "latin-600-italic.css",
      "latin-600.css",
      "latin-700-italic.css",
      "latin-700.css",
      "latin-ext-400-italic.css",
      "latin-ext-400.css",
      "latin-ext-500-italic.css",
      "latin-ext-500.css",
      "latin-ext-600-italic.css",
      "latin-ext-600.css",
      "latin-ext-700-italic.css",
      "latin-ext-700.css",
      "latin-ext.css",
      "latin.css",
      "vietnamese-400-italic.css",
      "vietnamese-400.css",
      "vietnamese-500-italic.css",
      "vietnamese-500.css",
      "vietnamese-600-italic.css",
      "vietnamese-600.css",
      "vietnamese-700-italic.css",
      "vietnamese-700.css",
      "vietnamese.css",
    ]);

    const cssContent = readDirContents(dirPath, fileNames);
    mock.restore();
    const expectedCSSContent = readDirContents(
      "./scripts/tests/google/data/cabin",
      fileNames
    );
    expect(cssContent).toEqual(expectedCSSContent);
  });

  it("Noto Sans JP CSS", () => {
    packagerV1("noto-sans-jp");
    const dirPath = "./fonts/google/noto-sans-jp";
    const fileNames = readDir(dirPath, "css");

    expect(fileNames).toEqual([
      "japanese-100.css",
      "japanese-300.css",
      "japanese-400.css",
      "japanese-500.css",
      "japanese-700.css",
      "japanese-900.css",
      "japanese.css",
      "latin-100.css",
      "latin-300.css",
      "latin-400.css",
      "latin-500.css",
      "latin-700.css",
      "latin-900.css",
      "latin.css",
    ]);

    const cssContent = readDirContents(dirPath, fileNames);
    mock.restore();
    const expectedCSSContent = readDirContents(
      "./scripts/tests/google/data/noto-sans-jp",
      fileNames
    );
    expect(cssContent).toEqual(expectedCSSContent);
  }); */
});
