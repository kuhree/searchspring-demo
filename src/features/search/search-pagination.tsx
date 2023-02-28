import { RenderableProps } from "preact";
import { JSXInternal } from "preact/src/jsx";
import { mergeClass } from "../../utils/merge-class";
import { SearchQueryResponse } from "./search-api";

export type PaginationProps = {
  pagination: SearchQueryResponse["pagination"];
  range?: number;
  // eslint-disable-next-line -- It's a type!
  onPageSelect: (page: number) => void;
};

export function Pagination({
  pagination,
  onPageSelect,
  range = 2,
}: PaginationProps) {
  const {
    totalResults = 0,
    currentPage = 0,
    totalPages = 0,
    perPage = 0,
  } = pagination;

  const { firstPage, previousPages, nextPages, lastPage } = getPageRanges({
    totalPages,
    currentPage,
    range,
  });

  const [entriesStart, entriesEnd] = (() => {
    const start = currentPage * perPage - perPage;

    let end = start + perPage;
    if (end > totalResults) {
      end = totalResults;
    }

    return [start, end];
  })();

  const makeOnPageClickHandler = (page: number) => {
    return () => onPageSelect(page);
  };

  return (
    <nav
      aria-label="Page Navigation"
      class="w-full flex flex-col items-center my-3"
    >
      <ul class="inline-flex items-center -space-x-px">
        <PageItem
          onClick={makeOnPageClickHandler(currentPage - 1)}
          disabled={currentPage === 1}
          class="rounded-l-md"
        >
          <span class="sr-only">Previous</span>
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </PageItem>

        {firstPage ? (
          <>
            <PageItem onClick={makeOnPageClickHandler(firstPage)}>
              {firstPage}
            </PageItem>
            <PageItem disabled>...</PageItem>
          </>
        ) : null}

        {previousPages.map((page) => (
          <PageItem key={page} onClick={makeOnPageClickHandler(page)}>
            {page}
          </PageItem>
        ))}

        <PageItem disabled class="font-bold text-lg">
          {currentPage}
        </PageItem>

        {nextPages.map((page) => (
          <PageItem key={page} onClick={makeOnPageClickHandler(page)}>
            {page}
          </PageItem>
        ))}

        {lastPage ? (
          <>
            <PageItem disabled>...</PageItem>
            <PageItem onClick={makeOnPageClickHandler(lastPage)}>
              {lastPage}
            </PageItem>
          </>
        ) : null}

        <PageItem
          onClick={makeOnPageClickHandler(currentPage + 1)}
          disabled={currentPage === totalPages}
          class="rounded-r-md"
        >
          <span class="sr-only">Next</span>
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </PageItem>
      </ul>

      <span class="text-sm text-gray-700 dark:text-gray-400">
        Showing <HelpText>{entriesStart}</HelpText> to{" "}
        <HelpText>{entriesEnd}</HelpText> of <HelpText>{totalResults}</HelpText>{" "}
        Entries
      </span>
    </nav>
  );
}

type PageProps =
  | RenderableProps<
      Pick<
        JSXInternal.HTMLAttributes<HTMLButtonElement>,
        "onClick" | "disabled" | "class"
      >
    >
  | {
      children: string;
      disabled: true;
      onClick?: never;
      class: string;
    };

function PageItem({
  children,
  onClick,
  disabled,
  class: classList,
}: PageProps) {
  return (
    <li>
      <button
        class={mergeClass(
          "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
          classList
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </li>
  );
}

type HelpTextProps = RenderableProps<{}>;

function HelpText({ children }: HelpTextProps) {
  return (
    <span class="font-semibold text-gray-900 dark:text-white">{children}</span>
  );
}

export function getPageRanges({
  totalPages,
  currentPage,
  range,
}: Pick<SearchQueryResponse["pagination"], "totalPages" | "currentPage"> & {
  range: number;
}) {
  const list = Array.from({ length: totalPages }, (_, i) => i + 1);

  const result = {
    firstPage: list.at(0),
    previousPages: list.slice(0, currentPage - 1).slice(-range),
    currentPage,
    nextPages: list.slice(currentPage).slice(0, range),
    lastPage: list.at(-1),
  };

  const currentRange = result.previousPages.concat(
    [currentPage],
    result.nextPages
  );
  const hasDuplicate = (num: number | undefined, list: number[]) => {
    if (num) return list.includes(num);
    return false;
  };

  if (hasDuplicate(result.firstPage, currentRange)) {
    result.firstPage = undefined;
  }

  if (hasDuplicate(result.lastPage, currentRange)) {
    result.lastPage = undefined;
  }

  return result;
}
