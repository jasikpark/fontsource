import * as path from "pathe";
import { describe, expect, it, vi } from "vitest"

import { downloadFileCheck, findChangedPackages } from "../../utils/file-check";

vi.mock("node:fs/promises")

describe.skip("File check", () => {
  it("Find changed packages", () => {
    /* mock({
      fonts: {
        icons: {
          // Changed packages checks for a package json
          "noto-color-emoji": {
            "package.json": "{}",
          },
          "noto-emoji": {
            "package.json": "{}",
          },
        },
      },
      "mass-publish.json": mock.load(
        path.resolve(process.cwd(), "mass-publish.json"),
        { lazy: false }
      ),
    }); */

    expect(
      findChangedPackages(
        "e87132f950524299fd89d2254e74e08743f5f0ae",
        "10a65fce06bdf6651cd8a133dc52a978b6cd5055"
      )
    ).resolves.toEqual([
      path.join("fonts", "icons", "noto-color-emoji"),
      path.join("fonts", "icons", "noto-emoji"),
    ]);
  });

  // Throw tests
  it("Check for files directory", () => {
    /* mock({
      fonts: {
        icons: {
          "noto-emoji": {
            "package.json": "{}",
          },
        },
      },
    }); */



    expect(() =>
      downloadFileCheck(["fonts/icons/noto-emoji"], true)
    ).toThrow("fonts/icons/noto-emoji/files does not exist");
  });

  it("Check for file list", () => {
    /* mock({
      fonts: {
        icons: {
          "noto-emoji": {
            files: {
              /* Empty directory 
            },
            "package.json": "{}",
          },
        },
      },
    }); */

    const filepath = path.join(
      "fonts",
      "icons",
      "noto-emoji",
      "files",
      "file-list.json"
    );

    expect(() =>
      downloadFileCheck(["fonts/icons/noto-emoji"], true)
    ).toThrow(`${filepath}: ENOENT`);
  });

  it("Check if first font file does not exist", () => {
    /* mock({
      fonts: {
        icons: {
          "noto-emoji": {
            files: {
              "file-list.json": mock.load(
                path.resolve(__dirname, "data/file-list-noto.json")
              ),
            },
            "package.json": "{}",
          },
        },
      },
    }); */

    expect(() =>
      downloadFileCheck(["fonts/icons/noto-emoji"], true)
    ).toThrow(
      "./fonts/icons/noto-emoji/files/noto-emoji-all-400-normal.woff does not exist"
    );
  });

  it("Check if second font file does not exist", () => {
    /* mock({
      fonts: {
        icons: {
          "noto-emoji": {
            files: {
              "file-list.json": mock.load(
                path.resolve(__dirname, "data/file-list-noto.json")
              ),
              "noto-emoji-all-400-normal.woff": "{}",
            },
            "package.json": "{}",
          },
        },
      },
    }); */

    expect(() =>
      downloadFileCheck(["fonts/icons/noto-emoji"], true)
    ).toThrow(
      "./fonts/icons/noto-emoji/files/noto-emoji-all-400-normal.woff2 does not exist"
    );
  });

  it("Success for download file check", () => {
    /* mock({
      fonts: {
        icons: {
          "noto-emoji": {
            files: {
              "file-list.json": mock.load(
                path.resolve(__dirname, "data/file-list-noto.json")
              ),
              "noto-emoji-all-400-normal.woff": "{}",
              "noto-emoji-all-400-normal.woff2": "{}",
            },
            "package.json": "{}",
          },
        },
      },
    }); */

    expect(() =>
      downloadFileCheck(["fonts/icons/noto-emoji"], true)
    ).not.toThrow();
  });

  // Return font id tests
  it("Return font ids that need updating", () => {
    /* mock({
      fonts: {
        icons: {
          "noto-emoji": {
            files: {
              "file-list.json": mock.load(
                path.resolve(__dirname, "data/file-list-noto.json")
              ),
            },
            "package.json": "{}",
          },
        },
      },
    }); */

    expect(downloadFileCheck(["fonts/icons/noto-emoji"])).toEqual([
      "noto-emoji",
    ]);
  });

  it("Return no font ids to update", () => {
    /* mock({
      fonts: {
        icons: {
          "noto-emoji": {
            files: {
              "file-list.json": mock.load(
                path.resolve(__dirname, "data/file-list-noto.json")
              ),
              "noto-emoji-all-400-normal.woff": "{}",
              "noto-emoji-all-400-normal.woff2": "{}",
            },
            "package.json": "{}",
          },
        },
      },
    }); */

    expect(downloadFileCheck(["fonts/icons/noto-emoji"])).toEqual([]);
  });
});
