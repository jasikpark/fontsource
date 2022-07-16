import consola from "consola"
import jsonfile from "jsonfile";
import path from "node:path";

import { getDirectories } from "./utils";

const subsets: string[] = [];

const pushSubsets = (type: string) => {
  const directories = getDirectories(type);
  for (const directory of directories) {
    const metadataPath = path.join("./fonts", type, directory, "metadata.json");
    const metadata = jsonfile.readFileSync(metadataPath);
    subsets.push(...metadata.subsets);
  }
};

pushSubsets("google");
pushSubsets("league");
pushSubsets("icons");
pushSubsets("other");

const noDuplicateSubsets = new Set(subsets);

consola.success([...noDuplicateSubsets].join(", "));
