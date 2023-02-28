import { useRef, useState } from "preact/hooks";
import {
  Pagination,
  PaginationProps,
  Search,
  SearchForm,
  SearchFormProps,
  SearchQueryBuilder,
  SearchQueryResponse,
} from ".";
import { ErrorMessage } from "../../components/error-message";
import { Form } from "../../components/form";
import { SiteConfig } from "../../utils/site-config";

export function SearchPage() {
  const [query, setQueryResults] = useState<SearchQueryResponse>();

  const builderRef = useRef(
    new SearchQueryBuilder({
      q: "",
      page: "1",
      siteId: SiteConfig.id,
      resultsFormat: "native",
    })
  );

  const fetchSearchQuery = async () => {
    const { current: queryBuilder } = builderRef;
    return fetch(queryBuilder.toString())
      .then((res) => res.json())
      .then((data) => setQueryResults(data))
      .catch((e) => console.error(e));
  };

  const onPageSelect: PaginationProps["onPageSelect"] = async (page) => {
    const { current: queryBuilder } = builderRef;
    queryBuilder.setParam("page", String(page));

    return fetchSearchQuery();
  };

  const onQuerySubmit: SearchFormProps["onSubmit"] = async (value) => {
    const { current: queryBuilder } = builderRef;
    queryBuilder.setParam("page", "1");
    queryBuilder.setParam("q", value.q);

    return fetchSearchQuery();
  };

  const Placeholder = () => {
    return (
      <>
        {Object.entries(Placeholders).map(([title, list]) => (
          <section key={title} class="mx-auto px-3">
            <h2 class="text-2xl font-bold">{title}</h2>

            {list.map((collection) => (
              <Form.Submit
                key={collection.query}
                onClick={() => onQuerySubmit({ q: collection.query })}
                type="button"
                class="m-2"
              >
                {collection.label}
              </Form.Submit>
            ))}
          </section>
        ))}
      </>
    );
  };

  return (
    <>
      <SearchForm
        initialQuery={builderRef.current.toSearchQuery()}
        onSubmit={onQuerySubmit}
      />

      {!query ? <Placeholder /> : null}

      {query && query.results.length === 0 ? (
        <ErrorMessage
          error={new Error("Results are empty. Try another search.")}
          summary={
            "There doesn't appear to be any results for this query. Please try another search."
          }
        />
      ) : query && query?.results.length ? (
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

const Placeholders = {
  Seasons: [
    { label: "Winter Collection", query: "winter" },
    { label: "Fall Collection", query: "fall" },
    { label: "Summer Collection", query: "summer" },
    { label: "Spring Collection", query: "spring" },
  ],

  Clothing: [
    { label: "Shop Jackets", query: "jackets" },
    { label: "Shop Shirts", query: "shirts" },
    { label: "Shop Pants", query: "pants" },
    { label: "Shop Shorts", query: "shorts" },
    { label: "Shop Shoes", query: "shoes" },
  ],

  Misc: [
    { label: "Perfect your skincare routine", query: "skincare" },
    { label: "Accessorize!", query: "jewelry" },
  ],
} as const;
