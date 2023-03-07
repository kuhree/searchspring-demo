import { ErrorMessage } from "../components/error-message";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import {
  Search,
  QueryBuilder,
  TrendingQuerySchema,
  TrendingQuery,
  getQuery,
  TrendingQueryResponse,
  SearchQuery,
} from "../features/search";
import { SiteConfig } from "../utils/site-config";
import { SearchForm } from "./search";
import { mergeClass } from "../utils/merge-class";
import { LoaderData } from "../utils/loader-data";

export async function loader({ request }: LoaderFunctionArgs) {
  switch (request.method) {
    case "GET":
    default: {
      const builder = new QueryBuilder<TrendingQuery>(
        { limit: SiteConfig.products.trendingCount, siteId: SiteConfig.id },
        { path: "/api/suggest/trending" },
        TrendingQuerySchema
      );

      return getQuery<TrendingQueryResponse>(builder);
    }
  }
}

export function HomePage() {
  const { data } = useLoaderData() as LoaderData<typeof loader>;
  const {
    trending: { queries },
  } = data;

  return (
    <Search.Container className="max-w-screen-lg mx-auto lg:flex-col">
      <Search.Nav className="w-full">
        <h1 className="blinky">Trendspring</h1>
        <p className="mb-2 dark:font-mono max-w-prose mx-auto">
          See the most popular searches for your store in the last 30 days.
        </p>

        <SearchForm
          initialQuery={new QueryBuilder<SearchQuery>().build().json}
        />
      </Search.Nav>

      <Search.Content>
        {queries && queries.length === 0 ? (
          <ErrorMessage
            summary={"There doesn't appear to be any queries for this query. "}
            error={new Error("Results are empty. Try again later.")}
          />
        ) : null}

        <div className="flex flex-wrap justify-around px-[10%]">
          {queries && queries.length
            ? queries.map(({ searchQuery }) => (
                <Link
                  key={searchQuery}
                  type="button"
                  to={`/search?q=${searchQuery}`}
                  className={mergeClass(
                    "block flex-grow mx-2 mb-4 p-2 text-center bg-muted text-primary dark:font-accent dark:text-sm",
                    "hover:bg-accent",
                    "transition-colors"
                  )}
                >
                  {searchQuery}
                </Link>
              ))
            : null}
        </div>
      </Search.Content>
    </Search.Container>
  );
}
