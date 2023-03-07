import {
  Pagination,
  PaginationProps,
  Search,
  SearchQuery,
  QueryBuilder,
  getQuery,
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
import { MdSearch } from "react-icons/md";
import "../styles/search.scss";
import { LoaderData } from "../utils/loader-data";

export async function loader({ request }: LoaderFunctionArgs) {
  switch (request.method) {
    case "GET":
    default: {
      const builder = new QueryBuilder<SearchQuery>(request.url);

      return getQuery(builder);
    }
  }
}

export function SearchPage() {
  const navigate = useNavigate();
  const { query, data } = useLoaderData() as LoaderData<typeof loader>;

  const onPageSelect: PaginationProps["onPageSelect"] = (page) => {
    const builder = new QueryBuilder(window.location.search).setParam(
      "page",
      page
    );

    navigate(`/search?${builder.build().search}`);
  };

  return (
    <Search.Container>
      <Search.Nav>
        <h1 className="blinky">{SiteConfig.title}</h1>
        <p className="mb-2 dark:font-mono max-w-prose mx-auto">
          {SiteConfig.description}
        </p>

        <SearchForm initialQuery={query.json} />

        <Pagination pagination={data.pagination} onPageSelect={onPageSelect} />

        <details className="fill text-left">
          <summary className="text-sm" />

          <details>
            <summary>View Query</summary>

            <pre className="whitespace-pre-wrap">Url: {query.url}</pre>
            <pre>JSON: {JSON.stringify(query.json, null, 2)}</pre>
          </details>

          <details>
            <summary>View Data</summary>

            <pre>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </details>
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
    <Form id="search-form" role="search" method="get" action="/search">
      <div className="flex items-center border-b border-accent py-2">
        <Form.Input
          id="q"
          name="q"
          placeholder="Search by product name, price, size, etc..."
          aria-label="Search Products"
          defaultValue={initialQuery.q}
        />

        <Form.Submit type="submit">
          <span className="sr-only">Search</span>
          <MdSearch />
        </Form.Submit>
      </div>
    </Form>
  );
}
