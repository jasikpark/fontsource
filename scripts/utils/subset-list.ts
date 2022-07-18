/* eslint-disable no-await-in-loop */
import consola from "consola"
import * as path from "pathe";

import { getDirectories, readParse } from "./utils";

const subsets: string[] = [];

const pushSubsets = async (type: string) => {
  const directories = await getDirectories(type);
  for (const directory of directories) {
    const metadataPath = path.join("./fonts", type, directory, "metadata.json");
    const metadata = await readParse(metadataPath);
    subsets.push(...metadata.subsets);
  }
};

await pushSubsets("google");
await pushSubsets("league");
await pushSubsets("icons");
await pushSubsets("other");

const noDuplicateSubsets = new Set(subsets);

consola.success([...noDuplicateSubsets].join(", "));
