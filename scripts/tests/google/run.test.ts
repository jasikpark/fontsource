/* eslint-disable promise/always-return */
import mock from "mock-fs";

import { run } from "../../google/run";
import { readDir, readDirContents } from "../helpers";

describe("Full run function", () => {
  beforeEach(() => {
    mock({
      fonts: {
        google: {
          abel: {
            "package.json": "{}",
          },
          "noto-sans-jp": {
            "package.json": "{}",
          },
        },
      },
    });
  });

  test("Abel metadata and unicode generation", () => run("abel").then(() => {
    const dirPath = "./fonts/google/abel";
    const fileNames = readDir(dirPath, "json");

    expect(fileNames).toEqual([
      "metadata.json",
      "package.json",
      "unicode.json",
    ]);

    // Remove package.json from array
    fileNames.splice(1, 1);

    const jsonContent = readDirContents(dirPath, fileNames);
    mock.restore();
    const expectedJsonContent = readDirContents(
      "./scripts/tests/google/data/abel",
      fileNames
    );
    expect(jsonContent).toEqual(expectedJsonContent);
  }));

  afterEach(() => {
    mock.restore();
  });
});
