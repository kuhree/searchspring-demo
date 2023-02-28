import { SiteConfig } from "./config/site";
import Header from "./components/header";
import {
  SearchQueryBuilder,
  SearchQueryResponse,
  SearchFormProps,
  SearchForm,
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
  const [query, setQueryResults] = useState<{
    current: undefined | SearchQueryResponse;
  }>({ current: undefined });

  const builderRef = useRef(
    new SearchQueryBuilder({
      q: "",
      page: "1",
      siteId: SiteConfig.id,
      resultsFormat: "native",
    })
  );

  const fetchToReRender = async () => {
    const { current: queryBuilder } = builderRef;
    return fetch(queryBuilder.toString())
      .then((res) => res.json())
      .then((data) => setQueryResults((prev) => ({ ...prev, current: data })))
      .catch((e) => console.error(e));
  };

  const onPageSelect: PaginationProps["onPageSelect"] = async (page) => {
    const { current: queryBuilder } = builderRef;
    queryBuilder.setParam("page", String(page));

    return fetchToReRender();
  };

  const onQuerySubmit: SearchFormProps["onSubmit"] = async (value) => {
    const { current: queryBuilder } = builderRef;
    queryBuilder.setParam("q", value.q);

    return fetchToReRender();
  };

  return (
    <>
      <AppHeader />

      <section class="text-center">
        <h1 class="text-3xl font-bold">{SiteConfig.title}</h1>
        <p class="text-gray-600">{SiteConfig.description}</p>
      </section>

      <SearchForm onSubmit={onQuerySubmit} />
      <SearchResults
        response={query?.current}
        actions={{
          onPageSelect,
        }}
      />
    </>
  );
}

type SearchResultsProps = {
  response: undefined | SearchQueryResponse;
  actions: {
    onPageSelect: PaginationProps["onPageSelect"];
  };
};

function SearchResults({ response, actions }: SearchResultsProps) {
  const { results, sorting, pagination } = response ?? {};

  return (
    <section>
      {pagination ? (
        <Pagination
          pagination={pagination}
          onPageSelect={actions.onPageSelect}
        />
      ) : null}
      {results ? <ResultGrid results={results} /> : null}
    </section>
  );
}

type PaginationProps = {
  pagination: SearchQueryResponse["pagination"];
  // eslint-disable-next-line -- It's a type!
  onPageSelect: (page: number) => void;
};
function Pagination({ pagination, onPageSelect }: PaginationProps) {
  const { totalResults = 0, currentPage = 0, totalPages = 0 } = pagination;

  const [previousPages, currentPages, nextPages] = (() => {
    const list = Array.from({ length: totalPages }, (_, i) => i + 1);

    const [before, current, after] = [
      list.slice(0, currentPage - 1),
      [currentPage],
      list.slice(currentPage),
    ];

    return [before.slice(-3), current, after.slice(0, 3)];
  })();

  const Page = ({ page }: { page: number }) => {
    return (
      <button class="mx-2" onClick={() => onPageSelect(page)}>
        {page}
      </button>
    );
  };

  return (
    <div>
      <div class="flex items-center content-center">
        {previousPages.map((page) => (
          <Page key={page} page={page} />
        ))}

        {currentPages.map((page) => (
          <Page key={page} page={page} />
        ))}

        {nextPages.map((page) => (
          <Page key={page} page={page} />
        ))}
      </div>
      <span> Total Results: {totalResults}</span>
    </div>
  );
}

type ResultGridProps = {
  results: SearchQueryResponse["results"];
};
function ResultGrid({ results }: ResultGridProps) {
  return (
    <div>
      {results.map((result) => (
        <article key={result.id}>
          <h2>{result.name}</h2>
          <img src={result.thumbnailImageUrl} alt={result.name} />
          <span>${result.price}</span>
          <span class={`${result.price < result.msrp ? "line-through" : ""}`}>
            ${result.msrp}
          </span>
        </article>
      ))}
    </div>
  );
}
