/* eslint-disable @typescript-eslint/no-unused-vars */
import * as gfm from "google-font-metadata"
import { describe, expect, it, vi } from "vitest"

import {
  download,
  filterLinks,
  gotDownload,
  pairGenerator,
  variableLinks,
} from "../../google/download-file";
import testData from "./data/download-file-data.json";
import APIv1Test from "./data/google-fonts-v1.json"
import APIv2Test from "./data/google-fonts-v2.json"
import APIVariableTest from "./data/variable.json"

vi.mock("google-font-metadata");

describe("Pair generator", () => {

  // Has TTF + OpenType and Variable
  const { APIv1Variant, APIv2Variant, APIVariableVariant } = testData;

  it("APIv1 and strip TTF links", () => {
    const { APIv1Result } = testData;
    expect(pairGenerator(APIv1Variant)).toEqual(APIv1Result);
  });

  it("APIv2 and strip OTF links", () => {
    const { APIv2Result } = testData;
    expect(pairGenerator(APIv2Variant)).toEqual(APIv2Result);
  });

  it("APIVariable", () => {
    const { APIVariableResult } = testData;
    expect(pairGenerator(APIVariableVariant)).toEqual(APIVariableResult);
  });
});

describe("Filter links", () => {
  it("Normal filterLinks function", () => {
    vi.spyOn(gfm, "APIv1", "get").mockReturnValue(APIv1Test as gfm.FontObjectV1)
    vi.spyOn(gfm, "APIv2", "get").mockReturnValue(APIv2Test as gfm.FontObjectV2)

    const abelResult = testData.filter.abel;
    expect(filterLinks("abel")).toEqual(abelResult);

    const notoSansJPResult = testData.filter["noto-sans-jp"];
    expect(filterLinks("noto-sans-jp")).toEqual(notoSansJPResult);
  });

  it("Variable filterLinks function", () => {
    vi.spyOn(gfm, "APIVariable", "get").mockReturnValue(APIVariableTest as gfm.FontObjectVariable)
    const cabinResult = testData.variableFilter.cabin;
    expect(variableLinks("cabin")).toEqual(cabinResult);
  });
});

// TODO - test { download, gotDownload }
