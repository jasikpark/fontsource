/* eslint-disable no-await-in-loop */
import stringify from "json-stringify-pretty-compact";
import _ from "lodash";
import * as fs from "node:fs/promises";
import * as path from "pathe"
import { fileExists, getDirectories, readParse } from "scripts/utils/utils";

/**
 * Google may sometimes push a new font that already exists in the generic folder
 * This checks if there are any duplicates between the two font folders and purges the duplicate from generic
 */

/**
 * Gets all directories in all font folders
 */
const directories = [
  ...await getDirectories("google"),
  ...await getDirectories("league"),
  ...await getDirectories("icons"),
  ...await getDirectories("other"),
];

/**
 * Find all the duplicate values in the given array
 * @param dirs array of directory names
 * @returns the duplicate values
 */
const findDuplicates = (dirs: string[]) =>
  _.filter(dirs, (value, index, iteratee) =>
    _.includes(iteratee, value, index + 1)
  );

const duplicates = findDuplicates(directories);

/**
 * Delete all the duplicate directories from the non-Google font folders and then modify the new Google package json version
 * @param duplicateDirs array of directory names
 * @returns duplicateDirs
 */
const deleteDuplicates = async (duplicateDirs: string[]) => {
  for (const dir of duplicateDirs) {
    let packageJson;

    const fontsDir = path.join("fonts", "other", dir)
    const iconsDir = path.join("fonts", "icons", dir)
    const leagueDir = path.join("fonts", "league", dir)

    if (await fileExists(fontsDir)) {
      packageJson = await readParse(path.join(fontsDir, "package.json"));
      await fs.rm(fontsDir, { recursive: true });
    } else if (await fileExists(iconsDir)) {
      packageJson = await readParse(path.join(iconsDir, "package.json"));
      await fs.rm(iconsDir, { recursive: true });
    } else if (await fileExists(leagueDir)) {
      packageJson = await readParse(path.join(leagueDir, "package.json"));
      await fs.rm(leagueDir, { recursive: true });
    } else {
      throw new Error(`${dir} does not exist`);
    }

    // This is necessary as the newly generated Google package version will not match the existing NPM version
    const googleDir = path.join("fonts", "google", dir, "package.json");
    const packageJsonGoogle = await readParse(googleDir);
    packageJsonGoogle.version = packageJson.version;
    await fs.writeFile(googleDir, stringify(packageJsonGoogle));
  }
};

export { deleteDuplicates, directories, duplicates, findDuplicates };
