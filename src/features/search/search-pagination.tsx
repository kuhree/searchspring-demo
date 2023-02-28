import { JSXInternal } from "preact/src/jsx";
import { SearchQueryResponse } from "./search-api";

export type PaginationProps = {
  pagination: SearchQueryResponse["pagination"];
  closeRange?: number;
  // eslint-disable-next-line -- It's a type!
  onPageSelect: (page: number) => void;
};

export function Pagination({
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

  const makeOnPageClickHandler = (page: number) => {
    return () => onPageSelect(page);
  };

  return (
    <div>
      <div class="flex items-center content-center">
        {firstPage && !currentRange.includes(firstPage) ? (
          <>
            <Page
              page={firstPage}
              onClick={makeOnPageClickHandler(firstPage)}
            />
            <span>...</span>
          </>
        ) : null}

        {previousPages.map((page) => (
          <Page key={page} page={page} onClick={makeOnPageClickHandler(page)} />
        ))}

        <Page page={currentPage} />

        {nextPages.map((page) => (
          <Page key={page} page={page} onClick={makeOnPageClickHandler(page)} />
        ))}

        {lastPage && !currentRange.includes(lastPage) ? (
          <>
            <span>...</span>
            <Page page={lastPage} onClick={makeOnPageClickHandler(lastPage)} />
          </>
        ) : null}
      </div>
      <span> Total Results: {totalResults}</span>
    </div>
  );
}

function Page({
  page,
  onClick,
}: { page: number } & Pick<
  JSXInternal.HTMLAttributes<HTMLButtonElement>,
  "onClick"
>) {
  return (
    <button class="mx-2" onClick={onClick}>
      {page}
    </button>
  );
}
