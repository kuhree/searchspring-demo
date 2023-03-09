import { describe, expect, it } from "vitest";
import { SiteConfig } from "../../utils/site-config";
import {
  SearchQuery,
  QueryBuilder,
  TrendingQuery,
  TrendingQuerySchema,
} from "./search-api";

describe("SearchQueryBuilder", () => {
  const baseQuery: SearchQuery = {
    siteId: "abcde",
    q: "testing",
    page: 2,
    resultsFormat: "native",
    // filter: [],
    // sort: [],
  };

  it("returns a default query", () => {
    const queryBuiler = new QueryBuilder();
    const { json } = queryBuiler.build();

    Object.keys(baseQuery).forEach((key) => {
      expect(json).toHaveProperty(key);

      switch (key as keyof typeof baseQuery) {
        case "resultsFormat": {
          expect(json[key as keyof typeof baseQuery]).toBe("native");
          break;
        }
        case "siteId": {
          expect(json[key as keyof typeof baseQuery]).toBe(SiteConfig.id);
          break;
        }
        case "page": {
          expect(json[key as keyof typeof baseQuery]).toBe(1);
          break;
        }
        case "q":
        default: {
          expect(json[key as keyof typeof baseQuery]).toBe("");
          break;
        }
      }
    });
  });

  it("supports trending queries", () => {
    const trendingQuery: TrendingQuery = {
      limit: SiteConfig.products.trendingCount,
      siteId: SiteConfig.id,
    };
    const trendingEndpoint = "/api/suggest/trending";
    const queryBuilder = new QueryBuilder<TrendingQuery>(
      trendingQuery,
      { path: trendingEndpoint },
      TrendingQuerySchema
    );

    const { json, url, search } = queryBuilder.build();

    expect(json).toMatchObject(trendingQuery);
    expect(url).toContain(trendingEndpoint);
    Object.keys(trendingQuery).forEach((key) => {
      expect(search).toContain(`${key}=`);
    });
  });

  it("returns a valid SearchQuery from a JSON SearchQuery", () => {
    const queryBuilder = new QueryBuilder(baseQuery);
    const { json: testQuery } = queryBuilder.build();

    expect(testQuery).toMatchObject(baseQuery);
  });

  it("returns a valid SearchQuery from a string SearchQuery", () => {
    const queryBuilder = new QueryBuilder(baseQuery);
    const { url: strQuery } = queryBuilder.build();
    const { json: fromString } = new QueryBuilder(strQuery).build();

    expect(fromString).toMatchObject(baseQuery);
  });

  Object.entries(baseQuery).forEach(([key, value]) => {
    it(`can get a searchParam: ${key}`, () => {
      const param = new QueryBuilder(baseQuery).getParam(
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

      const param = new QueryBuilder(baseQuery)
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
        new QueryBuilder()
          // @ts-expect-error -- Need invalid types for test
          .setParam(key, newValue)
          .build();
      };

      expect(toThrow).toThrowError();
    });
  });
});
