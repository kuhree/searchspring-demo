import {
  Pagination,
  Search,
  SearchForm,
  SearchQuery,
  SearchQueryBuilder,
} from "../features/search";
import { ErrorMessage } from "../components/error-message";
import { Form } from "../components/form";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);

  const queryBuilder = new SearchQueryBuilder();
  queryBuilder.url.search = requestUrl.search;

  const { query, url } = {
    query: queryBuilder.build(),
    url: queryBuilder.toString(),
  };

  const result = await fetch(url)
    .then((res) => res.json())
    .catch((e) => console.error(e));

  return { query, result };
}

export function SearchPage() {
  const { query, result } = useLoaderData();

  return (
    <>
      <SearchForm initialQuery={query} />

      {!result ? <Placeholder /> : null}

      {result.length === 0 ? (
        <ErrorMessage
          error={new Error("Results are empty. Try another search.")}
          summary={
            "There doesn't appear to be any results for this query. Please try another search."
          }
        />
      ) : null}

      {result.length ? (
        <Search>
          <Pagination
            pagination={query.pagination}
            onPageSelect={onPageSelect}
          />

          <Search.ResultsGrid>
            {query.results.map((item) => (
              <Search.ResultsItem key={item.id} item={item} />
            ))}
          </Search.ResultsGrid>

          <Pagination
            pagination={query.pagination}
            onPageSelect={onPageSelect}
          />
        </Search>
      ) : null}
    </>
  );
}

type PlaceholderProps = {
  placeholders?: Record<
    string,
    Array<Pick<SearchQuery, "q"> & { label: string }>
  >;
};

function Placeholder({ placeholders = defaultPlaceholders }: PlaceholderProps) {
  return (
    <>
      {Object.entries(placeholders).map(([title, list]) => (
        <section key={title} className="mx-auto px-3">
          <h2 className="text-2xl font-bold">{title}</h2>

          {list.map((collection) => (
            <Form>
              <Form.Input
                name="q"
                hidden
                aria-hidden
                className="hidden"
                defaultValue={collection.q}
              />

              <Form.Submit key={collection.q} type="button" className="m-2">
                {collection.label}
              </Form.Submit>
            </Form>
          ))}
        </section>
      ))}
    </>
  );
}

const defaultPlaceholders: PlaceholderProps["placeholders"] = {
  Seasons: [
    { label: "Winter Collection", q: "winter" },
    { label: "Fall Collection", q: "fall" },
    { label: "Summer Collection", q: "summer" },
    { label: "Spring Collection", q: "spring" },
  ],

  Clothing: [
    { label: "Shop Jackets", q: "jackets" },
    { label: "Shop Shirts", q: "shirts" },
    { label: "Shop Pants", q: "pants" },
    { label: "Shop Shorts", q: "shorts" },
    { label: "Shop Shoes", q: "shoes" },
  ],

  Misc: [
    { label: "Perfect your skincare routine", q: "skincare" },
    { label: "Accessorize!", q: "jewelry" },
  ],
};
