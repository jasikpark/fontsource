/* eslint-disable no-await-in-loop */
import consola from "consola"
import { findDiff } from "mass-publish/lib/changed/find-diff";
import { readConfig } from "mass-publish/lib/changed/read-config";
import * as path from "pathe";

import { fileExists, readParse } from "./utils";

/**
 * Returns a list of directory paths of packages that have changed.
 *
 * @param commitFrom Optional commit sha to compare from.
 * @param commitTo Optional commit sha to compare to.
 */
const findChangedPackages = async (
  commitFrom?: string,
  commitTo?: string
): Promise<string[]> => {
  const config = await readConfig();
  // Only used to pass custom testing SHAs
  if (typeof commitFrom !== "undefined" && typeof commitTo !== "undefined") {
    config.commitFrom = commitFrom;
    config.commitTo = commitTo;
  }

  const changedPackages = await findDiff(config);
  return changedPackages;
};

/**
 * This checks each package to have all of its necessary binary font files before publishing, else throw an error
 *
 * @param changedPackages A list of dirpaths to a changed package
 * @param throwError If it should throw an error
 */
const downloadFileCheck = async (
  changedPackages: string[],
  throwError?: boolean
) => {
  const fontIds: string[] = [];
  for (const changedPackage of changedPackages) {
    // A changed package could be the removal of an entire package
    // Only count existing packages
    if (await fileExists(path.join(changedPackage, "package.json"))) {
      // Check if files directory exists
      if (!await fileExists(path.join(changedPackage, "files"))) {
        const message = `${changedPackage}/files does not exist`;
        if (throwError) {
          throw new Error(message);
        } else {
          consola.info(message);
          fontIds.push(path.basename(changedPackage));
        }
      }

      // Read file that compares
      const files: string[] = await readParse(
        path.join(changedPackage, "files", "file-list.json")
      );

      // Check binary files
      for (const file of files) {
        if (!await fileExists(file)) {
          const message = `${file} does not exist`;
          if (throwError) {
            throw new Error(message);
          } else {
            consola.error(`${file} does not exist`);
            fontIds.push(path.basename(changedPackage));
          }
        }
      }
    }
  }
  // Remove duplicates
  return [...new Set(fontIds)];
};

export { downloadFileCheck, findChangedPackages };
