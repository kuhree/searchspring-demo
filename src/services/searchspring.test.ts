import { describe, it, expect } from "vitest";
import { SiteConfig } from "../config/site";
import { SearchQueryBuilder, SearchQuery } from "./searchspring";

describe("SearchQueryBuilder", () => {
  const query: SearchQuery = {
    siteId: "abcde",
    q: "testing",
    page: "1",
    resultsFormat: "native",
  };

  const queryBuilder = new SearchQueryBuilder(query);

  it("contains the correct baseUrl", () => {
    const url = queryBuilder.toString();

    expect(url.startsWith(SiteConfig.baseUrl)).toBe(true);
  });

  it("returns a vaild SearchQuery", () => {
    const testQuery = queryBuilder.toSearchQuery();

    expect(testQuery).toMatchObject(query);
  });

  Object.entries(query)
    .filter(([key]) => key !== "baseUrl")
    .forEach(([key, value]) => {
      it(`contains valid searchParam: ${key}`, () => {
        expect(queryBuilder.searchParams.has(key)).toBe(true);
        expect(queryBuilder.searchParams.get(key)).toBe(String(value));
      });

      it(`changes valid searchParam: ${key}`, () => {
        let newValue: string;

        switch (key) {
          case "resultsFormat": {
            newValue = "native";
            break;
          }

          case "page": {
            newValue = "12";
            break;
          }

          default: {
            newValue = "noop";
          }
        }

        queryBuilder.setParam(key as keyof SearchQuery, newValue);
        expect(queryBuilder.searchParams.get(key)).toBe(newValue);
      });
    });

  it("throws when given an invalid query", () => {
    expect(
      () => new SearchQueryBuilder(query, { url: "invalid", path: "/" })
    ).toThrowError();
    expect(() => new SearchQueryBuilder({ ...query, q: "" })).toThrowError();
    expect(
      () => new SearchQueryBuilder({ ...query, siteId: "inv" })
    ).toThrowError();
    expect(
      () => new SearchQueryBuilder({ ...query, page: "abs" })
    ).toThrowError();
    expect(
      // @ts-expect-error -- testing the catch function
      () => new SearchQueryBuilder({ ...query, resultsFormat: "invalid" })
    ).toThrowError();
  });

  it("throws when setting an invalid param", () => {
    expect(() =>
      new SearchQueryBuilder(query).setParam("q", "")
    ).toThrowError();
    expect(() =>
      new SearchQueryBuilder(query).setParam("siteId", "")
    ).toThrowError();
    expect(() =>
      new SearchQueryBuilder(query).setParam("page", "invalid")
    ).toThrowError();
    expect(() =>
      new SearchQueryBuilder(query).setParam("resultsFormat", "invalid")
    ).toThrowError();
  });
});
