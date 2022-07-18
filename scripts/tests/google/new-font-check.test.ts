import { Dirent } from "node:fs";
import * as fs from "node:fs/promises"
import { describe, expect, it, vi } from "vitest"

import { deleteDuplicates, findDuplicates } from "../../google/new-font-check";

vi.mock("node:fs/promises")


describe.todo("New font check", () => {
  /* beforeEach(() => {
    mock({
      fonts: {
        google: {
          abel: {
            "package.json": '{"version": "1.0.0"}',
          },
          cabin: {
            "package.json": '{"version": "1.0.0"}',
          },
          "noto-sans-jp": {
            "package.json": '{"version": "1.0.0"}',
          },
        },
        other: {
          abel: {
            "package.json": '{"version": "1.0.0"}',
          },
          "not-cabin": {
            "package.json": '{"version": "1.0.0"}',
          },
          "noto-sans-jp": {
            "package.json": '{"version": "1.0.0"}',
          },
        },
      },
    });
  }); */

  it("Find duplicates", () => {
    /* expect(
      findDuplicates([
        "abel",
        "noto-sans-jp",
        "cabin",
        "abel",
        "noto-sans-jp",
        "not-cabin",
      ])
    ).toEqual(["abel", "noto-sans-jp"]); */
  });

  it("Delete duplicate directories in non-Google folders", async () => {
    /* vi.mocked(fs.readdir).mockResolvedValue([{
      isDirectory: () => true,
      name: "abel"
    },
    {
      isDirectory: () => true,
      name: "noto-sans-jp"
    },
    {
      isDirectory: () => true,
      name: "cabin"
    }] as Dirent[]);

    await deleteDuplicates(["abel", "noto-sans-jp"]);

    console.log(vi.mocked(fs.rm).mock.calls) */

    // expect(getDirectories("google")).toEqual(["abel", "cabin", "noto-sans-jp"]);
    // expect(getDirectories("other")).toEqual(["not-cabin"]);
  });
});
