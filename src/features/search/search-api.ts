/* eslint-disable no-use-before-define -- schemas === interfaces */

import { z } from "zod";
import { SiteConfig } from "../../utils/site-config";

interface SearchResultDisplay {
  brand: string;
  color: Array<string>;
  color_family: Array<string>;
  condition: Array<string>;
  description: string;
  imageUrl: string;
  keywords: Array<string>;
  material: Array<string>;
  multi_colors: Array<string>;
  msrp: string;
  name: string;
  price: string;
  size: Array<string>;
  title: Array<string>;
  thumbnailImageUrl: string;
}

interface SearchResultIdentity {
  id: string;
  addToCartUrl: string;
  days_since_published: Array<string>;
  gross_margin: Array<string>;
  intellisuggestData: string;
  intellisuggestSignature: string;
  on_sale: Array<string>;
  popularity: string;
  product_type: Array<string>;
  product_type_unigram: string;
  quantity_available: Array<string>;
  ratingCount: string;
  sales_rank: Array<string>;
  sku: string;
  ss_category_hierarchy: Array<string>;
  ss_clicks: Array<string>;
  ss_insights_quadrant: Array<string>;
  ss_product_type: Array<string>;
  ss_sale_price: string;
  stockMessage: string;
  uid: string;
  url: string;
}

type SearchResultPagination = {
  totalResults: number;
  begin: number;
  end: number;
  currentPage: number;
  totalPages: number;
  previousPage: number;
  nextPage: number;
  perPage: number;
  defaultPerPage: number;
};

type SearchResultSortOption = {
  field: string;
  direction: "asc" | "desc";
  label: string;
};

export type SearchResult = SearchResultDisplay & SearchResultIdentity;

export type SearchQueryResponse = {
  pagination: SearchResultPagination;
  sorting: { options: Array<SearchResultSortOption> };
  resultLayout: "grid";
  results: Array<SearchResult>;
};

// type NonEmptyString = z.infer<typeof NonEmptyStringSchema>;
// const NonEmptyStringSchema = z.string().min(1);

// type ListTupleItem = z.infer<ListTupleItem>;
// const ListTupleItemSchema = z.tuple([
//   NonEmptyStringSchema,
//   NonEmptyStringSchema,
// ]);

// type ListParam = z.infer<typeof ListParamSchema>;
// const ListParamSchema = z.array(ListTupleItemSchema);

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
const SearchQuerySchema = z.object({
  q: z.string().default(""),
  page: z.number().min(1).default(1),
  resultsFormat: z.enum(["native"]).default("native"),
  siteId: z.string().min(4).default(SiteConfig.id),
  // filter: ListParamSchema.default([]),
  // sort: ListParamSchema.default([]),
});

// export type AdvancedSearchQueryParams = z.infer<
//   typeof AdvancedSearchQuerySchema
// >;
// const AdvancedSearchQuerySchema = SearchQuerySchema.pick({
//   filter: true,
//   sort: true,
// });

export type NetworkConfig = z.infer<typeof NetworkConfigSchema>;
const NetworkConfigSchema = z.object({
  url: z.string().url(),
  path: z.string().min(1).optional(),
});

export class SearchQueryBuilder {
  private readonly url: URL;

  constructor(
    rawQuery?: undefined | string | SearchQuery,
    network?: NetworkConfig
  ) {
    const {
      path = "/api/search/search.json",
      url = `https://api.searchspring.net`,
    } = network ?? {};

    this.url = new URL(path, url);

    if (typeof rawQuery === "string") {
      const params = new URLSearchParams(rawQuery.split("?").at(-1));

      params.forEach((value, name) => {
        this.setParam(name as keyof SearchQuery, value);
      });

      return new SearchQueryBuilder(this.build());
    } else if (rawQuery) {
      const baseQuery = SearchQuerySchema.parse(rawQuery);
      for (const [name, value] of Object.entries(baseQuery)) {
        this.setParam(name as keyof typeof baseQuery, String(value));
      }
    }
  }

  setParam(
    name: keyof SearchQuery,
    // rawValue: string | [keyof AdvancedSearchQueryParams, string]
    rawValue: SearchQuery[typeof name]
  ) {
    const parsedValue = z
      .string()
      .or(z.number())
      // .or(ListTupleItemSchema)
      .parse(rawValue);

    // if (isArray(parsedValue)) {
    //   const [listKey, listValue] = parsedValue;
    //
    //   const id = `${name}.${listKey}`;
    //
    //   this.url.searchParams.set(id, listValue);
    // } else {
    this.url.searchParams.set(name, String(parsedValue));
    // }

    return this;
  }

  getParam(name: keyof SearchQuery) {
    switch (name) {
      // case "sort":
      // case "filter": {
      //   const keyList = Array.from(this.url.searchParams.keys()).filter((key) =>
      //     key.startsWith(`${name}.`)
      //   );
      //   return keyList.flatMap((key) => this.url.searchParams.getAll(key));
      // }

      default: {
        return this.url.searchParams.getAll(name);
      }
    }
  }

  deleteParam(name: keyof SearchQuery) {
    const mutation = () => {
      switch (name) {
        // case "sort":
        // case "filter": {
        //   const listKey = name.split(".")[0];
        //   const id = `${name}.${listKey}`;
        //   if (this.url.searchParams.has(id)) {
        //     this.url.searchParams.delete(id);
        //   }
        // }

        default: {
          this.url.searchParams.delete(name);
        }
      }
    };

    mutation();
    return this;
  }

  build(): SearchQuery {
    // Create a params object
    const params: Record<string, unknown> = {};
    this.url.searchParams.forEach((value, key) => {
      // if (key.startsWith("sort") || key.startsWith("filter")) {
      //   const [name, listKey] = key.split(".")[0];
      //
      //   const listRef = params[name];
      //   if (name in query && isArray(listRef)) {
      //     listRef.push([listKey, val]);
      //   } else {
      //     params[name] = [[listKey, val]];
      //   }
      // } else

      if (key === "page") {
        params[key] = Number(value);
      } else {
        params[key] = value;
      }
    });

    return SearchQuerySchema.parse(params);
  }

  toStringQuery() {
    this.build();
    return this.url.toString();
  }

  toSearchParams() {
    this.build();
    return this.url.searchParams.toString();
  }
}

// function isArray(value: unknown): value is Array<unknown> {
//   return Array.isArray(value);
// }
