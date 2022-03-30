/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable unicorn/no-null */
import { isScopeKey, isCommitMapKey, filterCommit } from "../../repo/changelog";

describe("Changelog type guards", () => {
  test("isScopeKey", () => {
    expect(isScopeKey("api")).toBeTruthy();
    expect(isScopeKey("bad")).toBeFalsy();
    expect(isScopeKey(null)).toBeFalsy();
  });

  test("isCommitMapKey", () => {
    expect(isCommitMapKey("feat")).toBeTruthy();
    expect(isCommitMapKey("bad")).toBeFalsy();
    expect(isCommitMapKey(null)).toBeFalsy();
  });
});

describe("Changelog", () => {
  test("Filter commits", () => {
    const scopeFail = { scope: "build" };
    const headerFail = {
      scope: "repo",
      header: "chore: release new versions\n",
    };
    const subjectFail = {
      scope: "repo",
      header: "chore: release new versions\n",
      subject: null,
    };
    const pass = { scope: "website", header: "cool commit" };
    // @ts-expect-error
    expect(filterCommit(scopeFail)).toBeFalsy();
    // @ts-expect-error
    expect(filterCommit(headerFail)).toBeFalsy();
    // @ts-expect-error
    expect(filterCommit(subjectFail)).toBeFalsy();
    // @ts-expect-error
    expect(filterCommit(pass)).toBeTruthy();
  });
});
