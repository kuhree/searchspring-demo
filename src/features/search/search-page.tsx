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

  return (
    <>
      <SearchForm
        initialQuery={builderRef.current.toSearchQuery()}
        onSubmit={onQuerySubmit}
      />

      {query ? (
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
