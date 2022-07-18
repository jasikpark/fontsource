/* eslint-disable no-await-in-loop */
import consola from "consola"
import stringify from "json-stringify-pretty-compact";
import * as _ from "lodash";
import fs from "node:fs/promises";

import { getDirectories, readParse } from "./utils";

interface FontList {
  [x: string]: string;
}

const fontlist: FontList[] = [];
const league: string[] = [];
const icons: string[] = [];
const other: string[] = [];

interface Metadata {
  fontId: string;
  type: string;
}

// Iterate through directories and push to relevant arrays
const pushFonts = async (type: string) => {
  const directories = await getDirectories(type);
  for (const directory of directories) {
    const fontDir = `./fonts/${type}/${directory}`;

    try {
      const metadata: Metadata = await readParse(
        `${fontDir}/metadata.json`
      );
      const object = { [metadata.fontId]: metadata.type };
      fontlist.push(object);

      switch (metadata.type) {
        case "league": {
          league.push(metadata.fontId);
          break;
        }
        case "icons": {
          icons.push(metadata.fontId);
          break;
        }
        case "other": {
          other.push(metadata.fontId);
          break;
        }
        case "google": {
          // Empty to prevent calling unknown type catch
          break;
        }
        default: {
          consola.error(`${metadata.fontId} has unknown type ${metadata.type}.`);
        }
      }
    } catch (error) {
      consola.error(error);
    }
  }
};

await pushFonts("google");
await pushFonts("league");
await pushFonts("icons");
await pushFonts("other");

// Write JSON list to be pulled externally.
await fs.writeFile("FONTLIST.json", stringify(Object.assign({}, ...fontlist)));

// Write MD file
const fontlistMarkdown = _.template(
  `# Supported Font List

## [Search Directory](https://fontsource.org/)

Can be found [here](https://fontsource.org/).

## [Google Fonts](https://fonts.google.com/)

All Google Fonts are supported and updated weekly. Find the whole list [here](https://fonts.google.com/).

Variable fonts from Google are included. Supported list [here](https://fonts.google.com/variablefonts).

## [The League Of Moveable Type](https://www.theleagueofmoveabletype.com/)
<% _.forEach(league, function(fontName) { %>
- <%= fontName %><% });%>

## Icons
<% _.forEach(icons, function(fontName) { %>
- <%= fontName %><% });%>

## Other
<% _.forEach(other, function(fontName) { %>
- <%= fontName %><% });%>`
);

const fontlistWrite = fontlistMarkdown({
  league,
  icons,
  other,
});

await fs.writeFile(`FONTLIST.md`, fontlistWrite);
