import { z } from "zod";
import { SiteConfig } from "../config/site";

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
  thumbnaiImageUrl: string;
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
  siteId: z.string().min(4),
  q: z.string().min(1),
  resultsFormat: z.enum(["native"]),
  page: z.string().refine((value) => {
    const numValue = parseInt(value, 10);

    if (isNaN(numValue) || typeof numValue !== "number") {
      return false;
    }

    return true;
  }, "Page must be a number"),
});

export type BaseConfig = z.infer<typeof BaseconfigSchema>;
const BaseconfigSchema = z.object({
  url: z.string().url(),
  path: z.string().min(1),
});

export class SearchQueryBuilder extends URL {
  constructor(
    readonly baseQuery: SearchQuery,
    readonly baseConfig: BaseConfig = {
      url: SiteConfig.baseUrl,
      path: "/api/search/search.json",
    }
  ) {
    super(baseConfig.path, baseConfig.url);

    SearchQuerySchema.parse(baseQuery);
    Object.entries(baseQuery).forEach(([name, value]) => {
      this.searchParams.set(name, value);
    });
    SearchQuerySchema.parse(this.toSearchQuery());
  }

  getParam(name: keyof SearchQuery) {
    return this.searchParams.get(name);
  }

  setParam(name: keyof SearchQuery, value: string) {
    const originalValue = this.getParam(name);

    try {
      this.searchParams.set(name, value);
      SearchQuerySchema.parse(this.toSearchQuery());
      return this;
    } catch (error) {
      if (originalValue) {
        // revert changes
        this.searchParams.set(name, originalValue);
      }

      throw error;
    }
  }

  toSearchQuery(): SearchQuery {
    const newEntries = Object.keys(this.baseQuery).map((name) => [
      name,
      this.getParam(name as keyof SearchQuery),
    ]);

    return Object.fromEntries(newEntries);
  }
}
