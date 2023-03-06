import {
  Pagination,
  PaginationProps,
  Search,
  SearchQuery,
  SearchQueryBuilder,
  SearchQueryResponse,
} from "../features/search";
import { ErrorMessage } from "../components/error-message";
import { Form } from "../components/form";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { SiteConfig } from "../utils/site-config";
import { PropsWithChildren, useEffect } from "react";
import "../styles/search.scss";

export async function loader({ request }: LoaderFunctionArgs) {
  switch (request.method) {
    case "GET":
    default: {
      const requestUrl = new URL(request.url);
      const query = new SearchQueryBuilder(requestUrl.search);
      const queryJson = query.build();
      const queryUrl = query.toStringQuery();

      const response = await fetch(queryUrl);
      if (!response.ok) {
        throw new Error("An error occured while processing your search.", {
          cause: response.json(),
        });
      }

      const data = await response.json();

      return {
        query: { json: queryJson, str: queryUrl },
        data: data as SearchQueryResponse,
      };
    }
  }
}

export function SearchPage() {
  const navigate = useNavigate();
  let { query, data } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const onPageSelect: PaginationProps["onPageSelect"] = (page) => {
    const builder = new SearchQueryBuilder(window.location.search).setParam(
      "page",
      page
    );

    navigate(`/?${builder.toSearchParams()}`);
  };

  return (
    <Search.Container>
      <Search.Nav>
        <h1>{SiteConfig.title}</h1>
        <p className="text-xl mb-2 font-mono">{SiteConfig.description}</p>

        <SearchForm initialQuery={query.json} />

        <Pagination pagination={data.pagination} onPageSelect={onPageSelect} />
      </Search.Nav>

      <Search.Content>
        {data && data.results.length === 0 ? (
          <ErrorMessage
            summary={"There doesn't appear to be any results for this query. "}
            error={new Error("Results are empty. Try another search.")}
          />
        ) : null}

        {data && data.results.length ? (
          <Search.CardGrid>
            {data.results.map((item) => (
              <Search.Card key={item.id} item={item} />
            ))}
          </Search.CardGrid>
        ) : null}

        {data && data.pagination.totalPages ? (
          <Pagination
            pagination={data.pagination}
            onPageSelect={onPageSelect}
          />
        ) : null}
      </Search.Content>
    </Search.Container>
  );
}

export type SearchFormProps = PropsWithChildren<{
  initialQuery: SearchQuery;
}>;

export function SearchForm({ initialQuery }: SearchFormProps) {
  useEffect(() => {
    const input = document.getElementById("q") as HTMLInputElement | null;

    if (input) {
      input.value = initialQuery.q;
    }
  }, [initialQuery]);

  return (
    <Form id="search-form" role="search" method="get" action="/">
      <div className="flex items-center border-b border-accent py-2">
        <Form.Input
          id="q"
          name="q"
          placeholder="Search by product name, price, size, etc..."
          aria-label="Search Products"
          defaultValue={initialQuery.q}
        />

        <Form.Submit type="submit">Search</Form.Submit>
      </div>
    </Form>
  );
}
