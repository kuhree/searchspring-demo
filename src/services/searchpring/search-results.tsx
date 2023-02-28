import { RenderableProps } from "preact";
import { SearchQueryResponse } from "./searchspring";

type SearchResultsProps = RenderableProps<{}>;

function SearchResults({ children }: SearchResultsProps) {
  return <section>{children}</section>;
}

export type PaginationProps = {
  pagination: SearchQueryResponse["pagination"];
  closeRange?: number;
  // eslint-disable-next-line -- It's a type!
  onPageSelect: (page: number) => void;
};
function Pagination({
  pagination,
  onPageSelect,
  closeRange = 3,
}: PaginationProps) {
  const { totalResults = 0, currentPage = 0, totalPages = 0 } = pagination;

  const [firstPage, previousPages, nextPages, lastPage] = (() => {
    const list = Array.from({ length: totalPages }, (_, i) => i + 1);

    const [first, before, after, last] = [
      list.at(0),
      list.slice(0, currentPage - 1),
      list.slice(currentPage),
      list.at(-1),
    ];

    return [first, before.slice(-closeRange), after.slice(0, closeRange), last];
  })();

  const currentRange = previousPages.concat([currentPage], nextPages);

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
        {firstPage && !currentRange.includes(firstPage) ? (
          <>
            <Page key={firstPage} page={firstPage} />
            <span>...</span>
          </>
        ) : null}

        {previousPages.map((page) => (
          <Page key={page} page={page} />
        ))}

        <Page page={currentPage} />

        {nextPages.map((page) => (
          <Page key={page} page={page} />
        ))}

        {lastPage && !currentRange.includes(lastPage) ? (
          <>
            <span>...</span>
            <Page key={lastPage} page={lastPage} />
          </>
        ) : null}
      </div>
      <span> Total Results: {totalResults}</span>
    </div>
  );
}

type ResultGridProps = RenderableProps<{}>;
function ResultsGrid({ children }: ResultGridProps) {
  return <div class="flex flex-wrap">{children}</div>;
}

type ResultItemProps = {
  item: SearchQueryResponse["results"][number];
};

function ResultItem({ item }: ResultItemProps) {
  const isOnSale = item.price < item.msrp;
  return (
    <article
      key={item.id}
      class="m-4 max-w-sm rounded overflow-hidden shadow-lg"
    >
      <img src={item.thumbnailImageUrl} alt={item.name} class="w-full" />

      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{item.name}</div>
        <p class="text-gray-700 text-base">{item.description}</p>
      </div>

      <div class="px-6 py-4">
        <span class="text-lg font-bold mr-2">${item.price}</span>

        {isOnSale ? <span class="line-through">${item.msrp}</span> : null}
      </div>
    </article>
  );
}

export default Object.assign(SearchResults, {
  ResultsGrid,
  ResultItem,
  Pagination,
});
