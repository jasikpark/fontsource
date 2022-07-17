import * as fs from "node:fs/promises"
import { describe, expect, it, vi } from "vitest"

import { packager } from "../../generic/generic-packager";
import { getFixturesFromMock } from '../helpers';

vi.mock("node:fs/promises");

const testFont = {
  fontId: "clear-sans",
  fontName: "Clear Sans",
  subsets: ["all"],
  weights: [100, 300, 400, 500, 700],
  styles: ["normal", "italic"],
  defSubset: "all",
  unicodeRange: {},
  variable: false,
  lastModified: "2020-10-15",
  version: "1.00",
  category: "display",
  source: "https://01.org/clear-sans",
  license: "http://www.apache.org/licenses/LICENSE-2.0",
  type: "other",

  fontDir: "fonts/other/clear-sans",
  packageVersion: "4.3.0",
};

const testIcon = {
  fontId: "material-icons",
  fontName: "Material Icons",
  subsets: ["base"],
  weights: [400],
  styles: ["normal"],
  defSubset: "base",
  unicodeRange: {},
  variable: false,
  lastModified: "2021-03-31",
  version: "v4",
  category: "other",
  source: "https://github.com/google/material-design-icons",
  license:
    "https://github.com/google/material-design-icons/blob/master/LICENSE",
  type: "icons",

  fontDir: "fonts/icons/material-icons",
  packageVersion: "4.3.0",
};

describe("Generate Generic CSS", () => {

  it("Successfully processes Clear Sans CSS", async () => {
    const files = ["clear-sans-all-100-normal.woff",
      "clear-sans-all-100-normal.woff2",
      "clear-sans-all-300-normal.woff",
      "clear-sans-all-300-normal.woff2",
      "clear-sans-all-400-normal.woff",
      "clear-sans-all-400-normal.woff2",
      "clear-sans-all-400-italic.woff",
      "clear-sans-all-400-italic.woff2",
      "clear-sans-all-500-normal.woff",
      "clear-sans-all-500-normal.woff2",
      "clear-sans-all-500-italic.woff",
      "clear-sans-all-500-italic.woff2",
      "clear-sans-all-700-normal.woff",
      "clear-sans-all-700-normal.woff2",
      "clear-sans-all-700-italic.woff",
      "clear-sans-all-700-italic.woff2"]
    // @ts-ignore - readdir can return string[] not just dirent[]
    vi.mocked(fs.readdir).mockResolvedValue(files);

    await packager(testFont, true);
    // console.log(vi.mocked(fs.writeFileSync).mock.calls)
    const fileNames = [
      "100-italic.css",
      "100.css",
      "300-italic.css",
      "300.css",
      "400-italic.css",
      "400.css",
      "500-italic.css",
      "500.css",
      "700-italic.css",
      "700.css",
      "all-100-italic.css",
      "all-100.css",
      "all-300-italic.css",
      "all-300.css",
      "all-400-italic.css",
      "all-400.css",
      "all-500-italic.css",
      "all-500.css",
      "all-700-italic.css",
      "all-700.css",
      "all.css",
      "index.css",
    ]

    const extraNames = [...fileNames, "CHANGELOG.md",
      "README.md",
      "files/file-list.json",
      "metadata.json",
      "package.json",
      "scss/mixins.scss",
      "unicode.json"]

    const filePaths = extraNames.map(file => `fonts/other/clear-sans/${file}`).sort();
    expect(vi.mocked(fs.writeFile).mock.calls.map(tuple => tuple[0]).sort()).toEqual(filePaths)

    const cssContent = getFixturesFromMock("clear-sans", fileNames, vi.mocked(fs.writeFile).mock.calls);
    for (const css of cssContent) {
      expect(css[0]).toEqual(css[1]);
    }

    const fileList = getFixturesFromMock("clear-sans", ["files/file-list.json"], vi.mocked(fs.writeFile).mock.calls);
    for (const fileListing of fileList)
      expect(fileListing[0]).toEqual(fileListing[1]);
  });

  it("Material Icons CSS", async () => {
    const files = ["material-icons-base-400-normal.woff",
      "material-icons-base-400-normal.woff2"]
    // @ts-ignore - readdir can return string[] not just dirent[]
    vi.mocked(fs.readdir).mockResolvedValue(files);

    await packager(testIcon, true);
    const fileNames = [
      "400.css",
      "base-400.css",
      "base.css",
      "index.css",
    ];

    const extraNames = [...fileNames, "CHANGELOG.md",
      "README.md",
      "files/file-list.json",
      "metadata.json",
      "package.json",
      "scss/mixins.scss",
      "unicode.json"]

    const filePaths = extraNames.map(file => `fonts/icons/material-icons/${file}`).sort();
    const mockCalls = vi.mocked(fs.writeFile).mock.calls;
    expect(mockCalls.map(tuple => tuple[0]).sort()).toEqual(filePaths)

    const cssContent = getFixturesFromMock("material-icons", fileNames, mockCalls, "icons");
    for (const css of cssContent) {
      expect(css[0]).toContain(css[1]);
    }

    const fileList = getFixturesFromMock("material-icons", ["files/file-list.json"], mockCalls, "icons");
    for (const fileListing of fileList)
      expect(fileListing[0]).toEqual(fileListing[1]);
  });
});
