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
  material: Array<string>;
  multi_colors: Array<string>;
  msrp: string;
  name: string;
  price: string;
  size: Array<string>;
  title: Array<string>;
  thumbnailImageUrl: string;
  keywords?: Array<string>;
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

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
const SearchQuerySchema = z.object({
  q: z.string().default(""),
  page: z.number().min(1).default(1),
  resultsFormat: z.enum(["native"]).default("native"),
  siteId: z.string().min(4).default(SiteConfig.id),
});

export type NetworkConfig = z.infer<typeof NetworkConfigSchema>;
const NetworkConfigSchema = z.object({
  url: z.string().url().optional(),
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

  setParam(name: keyof SearchQuery, rawValue: SearchQuery[typeof name]) {
    const parsedValue = z.string().or(z.number()).parse(rawValue);
    this.url.searchParams.set(name, String(parsedValue));

    return this;
  }

  getParam(name: keyof SearchQuery) {
    return this.url.searchParams.getAll(name);
  }

  deleteParam(name: keyof SearchQuery) {
    this.url.searchParams.delete(name);
  }

  build(): SearchQuery {
    const params: Record<string, unknown> = {};

    this.url.searchParams.forEach((value, key) => {
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
