import { SiteConfig } from "./config/site";
import Header from "./components/header";
import {
  SearchQueryBuilder,
  SearchQueryResponse,
  SearchFormProps,
  SearchForm,
  SearchResults,
  PaginationProps,
} from "./services/searchpring";
import { useRef, useState } from "preact/hooks";

function AppHeader() {
  return (
    <Header>
      <Header.ThemeToggle />

      <Header.NavList>
        <Header.NavItem>
          <a href="/">Home</a>
        </Header.NavItem>

        <Header.NavItem>
          <a href="/">Search</a>
        </Header.NavItem>
      </Header.NavList>
    </Header>
  );
}

export function App() {
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
      <AppHeader />

      <section class="text-center">
        <h1 class="text-3xl font-bold">{SiteConfig.title}</h1>
        <p class="text-gray-600">{SiteConfig.description}</p>
      </section>

      <SearchForm onSubmit={onQuerySubmit} />
      {query ? (
        <SearchResults>
          <SearchResults.Pagination
            pagination={query.pagination}
            onPageSelect={onPageSelect}
          />

          <SearchResults.ResultsGrid>
            {query.results.map((item) => (
              <SearchResults.ResultItem key={item.id} item={item} />
            ))}
          </SearchResults.ResultsGrid>

          <SearchResults.Pagination
            pagination={query.pagination}
            onPageSelect={onPageSelect}
          />
        </SearchResults>
      ) : null}
    </>
  );
}
