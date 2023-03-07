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

export type TrendingQuery = z.infer<typeof TrendingQuerySchema>;
export const TrendingQuerySchema = SearchQuerySchema.pick({
  siteId: true,
}).and(
  z.object({
    limit: z.number().min(1).default(1),
  })
);

export type TrendingQueryResponse = z.infer<typeof TrendingQueryResponseSchema>;
export const TrendingQueryResponseSchema = z.object({
  trending: z.object({
    queries: z.array(
      z.object({
        searchQuery: z.string().min(1),
        popularity: z.number().min(1),
      })
    ),
  }),
});

export type NetworkConfig = z.infer<typeof NetworkConfigSchema>;
const NetworkConfigSchema = z.object({
  url: z.string().url().optional(),
  path: z.string().min(1).optional(),
});

export class QueryBuilder<
  Query extends { [key: string]: unknown } = SearchQuery
> {
  private readonly url: URL;

  constructor(
    readonly rawQuery?: undefined | string | Query,
    readonly network?: NetworkConfig,
    private readonly schema: z.ZodSchema = SearchQuerySchema
  ) {
    const {
      path = "/api/search/search.json",
      url = `https://api.searchspring.net`,
    } = network ?? {};

    this.url = new URL(path, url);

    if (typeof rawQuery === "string") {
      const params = new URLSearchParams(rawQuery.split("?").at(-1));

      params.forEach((value, name) => {
        this.setParam(name as keyof Query, value as Query[keyof Query]);
      });

      const { json } = this.build();
      return new QueryBuilder(json);
    } else if (rawQuery) {
      const baseQuery = this.schema.parse(rawQuery);
      for (const [name, value] of Object.entries(baseQuery)) {
        this.setParam(name as keyof Query, String(value) as Query[keyof Query]);
      }
    }
  }

  setParam(name: keyof Query, rawValue: Query[typeof name]) {
    const parsedValue = z.string().or(z.number()).parse(rawValue);
    this.url.searchParams.set(String(name), String(parsedValue));

    return this;
  }

  getParam(name: keyof Query) {
    return this.url.searchParams.getAll(String(name));
  }

  deleteParam(name: keyof Query) {
    this.url.searchParams.delete(String(name));
  }

  build() {
    const params: Record<string, unknown> = {};

    this.url.searchParams.forEach((value, key) => {
      if (key === "page" || key === "limit") {
        params[key] = Number(value);
      } else {
        params[key] = value;
      }
    });

    return {
      json: this.schema.parse(params) as Query,
      url: this.url.toString(),
      search: this.url.search,
    };
  }
}

export async function getQuery<ExpectedResponse = SearchQueryResponse>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  builder: QueryBuilder<any>
) {
  const query = builder.build();

  const response = await fetch(query.url);
  if (!response.ok) {
    throw new Error("An error occured while processing your search.", {
      cause: response.json(),
    });
  }

  const data = (await response.json()) as ExpectedResponse; // sue me (or write them before we get sued)

  return { query, data };
}
