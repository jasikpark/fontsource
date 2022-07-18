/* eslint-disable no-await-in-loop */
import algoliasearch from "algoliasearch";
import consola from "consola"
import * as dotenv from "dotenv";
import stringify from "json-stringify-pretty-compact";
import * as fs from "node:fs/promises"

import { getDirectories, readParse } from "./utils";

interface Metadata {
  objectID: string;
}

// Array of objects to be pushed to algolia
const indexArray: Metadata[] = [];

// Copy all metadatas into one array
const pushMetadata = async (type: string) => {
  const directories = getDirectories(type);
  for (const directory of await directories) {
    const fontDir = `./fonts/${type}/${directory}`;
    try {
      const metadata = await readParse(`${fontDir}/metadata.json`);
      metadata.objectID = metadata.fontId;
      if (metadata.variable) {
        metadata.variable = true;
      }
      indexArray.push(metadata);
    } catch (error) {
      consola.error(error);
    }
  }
};

await pushMetadata("google");
await pushMetadata("league");
await pushMetadata("icons");
await pushMetadata("other");

// Written as it is used by the website getStaticPaths
await fs.writeFile("./website/src/configs/algolia.json", stringify(indexArray));
// Written for API usage
await fs.writeFile("./website/public/algolia.json", stringify(indexArray));

// Initialise Algolia client
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const client = algoliasearch(
  "WNATE69PVR",
  process.env.ALGOLIA_ADMIN_KEY as string
);
const index = client.initIndex("prod_FONTS");

index
  .saveObjects(indexArray)
  .then(() => consola.success("Updated fonts."))
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(error => consola.error(error));
