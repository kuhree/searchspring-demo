import { ErrorMessage } from "../components/error-message";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { Search, SearchQueryBuilder } from "../features/search";
import { SiteConfig } from "../utils/site-config";
import { SearchForm } from "./search";
import { mergeClass } from "../utils/merge-class";

export async function loader({ request }: LoaderFunctionArgs) {
  switch (request.method) {
    case "GET":
    default: {
      // SearchQueryBuilder is not made for trending queries, some hackery required
      const trendingQueryUrl = (() => {
        const builder = new SearchQueryBuilder(undefined, {
          path: "/api/suggest/trending",
        })
          .setParam("siteId", SiteConfig.id)
          // @ts-expect-error -- limit is not part of a SearchQuery
          .setParam("limit", SiteConfig.products.trendingCount);

        return builder.toStringQuery();
      })();

      const trendingResponse = await fetch(trendingQueryUrl)
        .then((response) => {
          if (response.ok) {
            return response.json() as Promise<{
              trending: {
                queries: Array<{ searchQuery: string; popularity: number }>;
              };
            }>;
          } else throw response.json();
        })
        .catch((error) => {
          throw new Error(
            "An error occured while fetching trending searches search.",
            { cause: error }
          );
        });

      return {
        data: trendingResponse,
      };
    }
  }
}

export function HomePage() {
  let {
    data: {
      trending: { queries },
    },
  } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <Search.Container className="max-w-screen-lg mx-auto lg:flex-col">
      <Search.Nav className="w-full">
        <h1 className="blinky">Trendspring</h1>
        <p className="mb-2 dark:font-mono max-w-prose mx-auto">
          See the most popular searches for your store in the last 30 days.
        </p>

        <SearchForm initialQuery={new SearchQueryBuilder().build()} />
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
