import async from "async";
import consola from "consola"
import fs from "fs-extra";
import { APIv2, APIVariable } from "google-font-metadata";
import * as _ from "lodash";
import { EventEmitter } from "node:events";

import { run } from "./run";

const force = process.argv[2];

fs.ensureDirSync("fonts");
fs.ensureDirSync("fonts/google");
fs.ensureDirSync("scripts/temp_packages");

/**
 * Function to run everytime a queue item is added.
 *
 * @param fontId font to be processed
 */
const processQueue = async (fontId: string) => {
  consola.info(`Downloading ${fontId}`);
  await run(fontId, force);
  consola.success(`Finished processing ${fontId}`);
  Promise.resolve().catch(error => {
    throw error;
  });
};

// EventEmitter listener is usually set at a default limit of 10, below chosen 12 concurrent workers
EventEmitter.defaultMaxListeners = 0;

const queue = async.queue(processQueue, 3);

queue.drain(async () => {
  consola.success(
    `All ${Object.keys(APIv2).length} Google Fonts have been processed.`
  );
  consola.success(
    `${Object.keys(APIVariable).length} variable fonts have been processed.`
  );
});

queue.error((err, fontid) => {
  consola.error(`${fontid} experienced an error.`, err);
});

// Testing
/* const development = () => {
  const fonts = [
    "recursive",
    "texturina",
    "cabin",
    "actor",
    "abel",
    "noto-sans-jp",
    "noto-sans-tc",
    "noto-sans-sc",
    "noto-sans-kr",
    "zilla-slab-highlight",
  ];
  fonts.forEach(font => queue.push(font));
};
development(); */

// Production
const production = () => {
  _.forOwn(APIv2, font => {
    queue.push(`${font.id}`);
  });
};
production();
