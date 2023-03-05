import { describe, expect, it } from "vitest";
import { SiteConfig } from "../../utils/site-config";
import { SearchQuery, SearchQueryBuilder } from "./search-api";

describe("SearchQueryBuilder", () => {
  const query: SearchQuery = {
    siteId: "abcde",
    q: "testing",
    page: 2,
    resultsFormat: "native",
    // filter: [],
    // sort: [],
  };

  it("returns a default query", () => {
    const queryBuiler = new SearchQueryBuilder();
    const json = queryBuiler.build();

    Object.keys(query).forEach((key) => {
      expect(json).toHaveProperty(key);

      switch (key as keyof typeof query) {
        case "resultsFormat": {
          expect(json[key as keyof typeof query]).toBe("native");
          break;
        }
        case "siteId": {
          expect(json[key as keyof typeof query]).toBe(SiteConfig.id);
          break;
        }
        case "page": {
          expect(json[key as keyof typeof query]).toBe(1);
          break;
        }
        case "q":
        default: {
          expect(json[key as keyof typeof query]).toBe("");
          break;
        }
      }
    });
  });

  it("returns a valid SearchQuery from a JSON SearchQuery", () => {
    const queryBuilder = new SearchQueryBuilder(query);
    const testQuery = queryBuilder.build();

    expect(testQuery).toMatchObject(query);
  });

  it("returns a valid SearchQuery from a string SearchQuery", () => {
    const queryBuilder = new SearchQueryBuilder(query);
    const strQuery = queryBuilder.toStringQuery();
    const fromString = new SearchQueryBuilder(strQuery).build();

    expect(fromString).toMatchObject(query);
  });

  Object.entries(query).forEach(([key, value]) => {
    it(`can get a searchParam: ${key}`, () => {
      const param = new SearchQueryBuilder(query).getParam(
        key as keyof SearchQuery
      );

      expect(param).toStrictEqual([String(value)]);
    });

    it(`can change searchParam: ${key}`, () => {
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

      const param = new SearchQueryBuilder(query)
        .setParam(key as keyof SearchQuery, newValue)
        .getParam(key as keyof SearchQuery);
      expect(param).toStrictEqual([newValue]);
    });

    it(`throws (or sets a default) when setting invalid query param: ${key}`, () => {
      let newValue: unknown;

      switch (key as keyof SearchQuery) {
        case "siteId": {
          newValue = "noo";
          break;
        }

        case "q": {
          newValue = Error;
          break;
        }

        case "resultsFormat":
        case "page":
        default: {
          newValue = "noop";
          break;
        }
      }

      const toThrow = () => {
        new SearchQueryBuilder()
          // @ts-expect-error -- Need invalid types for test
          .setParam(key, newValue)
          .build();
      };

      expect(toThrow).toThrowError();
    });
  });
});
