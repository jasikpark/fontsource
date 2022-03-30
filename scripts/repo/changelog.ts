import fs from "node:fs";
import gitRawCommits from "git-raw-commits";
import conventionalCommitsParser from "conventional-commits-parser";
import path from "node:path";

import untypedChangelogVersions from "./changelog-versions.json";

const scopes = ["api", "font", "website", "noscope"] as const;

const changelogPaths = {
  api: path.join(process.cwd(), "api", "CHANGELOG.md"),
  font: path.join(process.cwd(), "fonts", "CHANGELOG.md"),
  website: path.join(process.cwd(), "website", "CHANGELOG.md"),
  noscope: path.join(process.cwd(), "CHANGELOG.md"),
};

const commitMap = {
  feat: "Features",
  fix: "Bug Fixes",
  docs: "Documentation",
  perf: "Performance",
  other: "Other Changes",
};

type CommitMapKeys = keyof typeof commitMap;
type ScopeKeys = typeof scopes[number];

interface Commit {
  type: CommitMapKeys | null;
  scope: ScopeKeys | "build" | null; // Build is a scope to ignore later on
  subject: string;
  header: string;
  body: string | null;
  footer: string | null;
  committerDate: string;
}

type ChangelogObject = {
  [key in ScopeKeys]: Map<CommitMapKeys, Commit[]>;
};

/**
 * ScopeKeys type guard
 * @param scopeKey
 * @returns boolean
 */
const isScopeKey = (scopeKey: string | null): scopeKey is ScopeKeys => {
  return scopes.includes(scopeKey as ScopeKeys);
};

const isCommitMapKey = (
  commitMapKey: string | null
): commitMapKey is CommitMapKeys => {
  return Object.keys(commitMap).includes(commitMapKey as CommitMapKeys);
};

const filterCommit = (commit: Commit): boolean => {
  if (commit.scope === "build") return false;
  if (commit.header.includes("chore: release new versions")) return false;
  if (commit.subject === null) return false;
  return true;
};

/**
 * Sorts commits
 */
const sortCommits = async (version: string): Promise<ChangelogObject> => {
  interface ChangelogVersions {
    [key: string]: string;
  }
  const changelogVersions: ChangelogVersions = untypedChangelogVersions;
  // See https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/git-raw-commits
  const gitRawCommitsOpts = {
    from: changelogVersions[version],
    format: `%B%n-committerDate-%n%cs`,
  };

  // Assign a new map for each scope, for each own changelog
  const changelogObj = {} as ChangelogObject;
  for (const scope of scopes) {
    changelogObj[scope] = new Map([
      ["feat", [] as Commit[]],
      ["fix", []],
      ["docs", []],
      ["perf", []],
      ["other", []],
    ]);
  }

  // Convert git-log stream into readable objects
  const commitStream = gitRawCommits(gitRawCommitsOpts);
  const parsedStream = commitStream.pipe(conventionalCommitsParser());
  // Weird type assertion just makes it easier to understand what each commit of stream is really
  for await (const commit of parsedStream as unknown as Commit[]) {
    let changelogScope;
    // If scope exists
    if (isScopeKey(commit.scope)) {
      // If commit type doesn't exist, default to other
      changelogScope = isCommitMapKey(commit.type)
        ? changelogObj[commit.scope].get(commit.type)
        : changelogObj[commit.scope].get("other");
    } else {
      // If scope doesn't exist, default noscope
      // If commit type doesn't exist, default to other
      changelogScope = isCommitMapKey(commit.type)
        ? changelogObj.noscope.get(commit.type)
        : changelogObj.noscope.get("other");
    }
    if (changelogScope) {
      if (filterCommit(commit)) changelogScope.push(commit);
    } else {
      throw new Error(
        `Encountered invalid changelog scope ${commit.scope} ${commit.type}`
      );
    }
  }
  return changelogObj;
};

type ChangelogTexts = {
  [key in ScopeKeys]: string;
};

const buildChangelog = (changelogObj: ChangelogObject): ChangelogTexts => {
  const changelogTexts = {} as ChangelogTexts;
  for (const scope of scopes) {
    let text = "";

    for (const commitKey of Object.keys(commitMap) as CommitMapKeys[]) {
      const changes = changelogObj[scope].get(commitKey);

      if (changes) {
        // No changes in section, skip
        if (changes.length === 0) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const title = commitMap[commitKey];
        text += `### ${title}\n`;

        for (const change of changes) {
          text += `${
            change.subject[0].toUpperCase() + change.subject.slice(1) // Capitalise first letter
          }\n`;
        }
      } else {
        throw new Error(`Encountered invalid changetext ${scope} ${commitKey}`);
      }
    }
    changelogTexts[scope] = text;
  }
  return changelogTexts;
};

const updateChangelogs = (changelogs: ChangelogTexts) => {
  for (const scope of scopes) {
    const changelogPath = changelogPaths[scope];
    const separator = '<a name="changelog-sep"></a>';
    const contents = String(fs.readFileSync(changelogPath));
    const parts = contents.split(separator);

    if (parts.length !== 3) {
      throw new Error(
        `Demarcation error at ${changelogPath} with ${parts.length} parts`
      );
    }

    parts[1] = changelogs[scope];
    fs.writeFileSync(changelogPath, parts.join(""));
    console.log(`Updated ${changelogPath}`);
  }
};

const createChangelog = async () => {
  const commits = await sortCommits("4.5.0");
  const changelogs = buildChangelog(commits);
  updateChangelogs(changelogs);
};

createChangelog();

export { filterCommit, isScopeKey, isCommitMapKey };
