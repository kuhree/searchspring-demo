import { HTMLProps, PropsWithChildren } from "react";
import { mergeClass } from "../../utils/merge-class";
import { SiteConfig } from "../../utils/site-config";
import { SearchQueryResponse } from "./search-api";

export type PaginationProps = {
  container?: Pick<HTMLProps<HTMLDivElement>, "className">;
  pagination: SearchQueryResponse["pagination"];
  range?: number;
  // eslint-disable-next-line -- It's a type!
  onPageSelect: (page: number) => void;
};

export function Pagination({
  container,
  pagination,
  onPageSelect,
  range = SiteConfig.products.pageRange,
}: PaginationProps) {
  const {
    totalResults = 0,
    currentPage = 0,
    totalPages = 0,
    begin = 0,
    end = 0,
  } = pagination;

  const { firstPage, previousPages, nextPages, lastPage } = getPageRanges({
    ...pagination,
    range,
  });

  const makeOnPageClickHandler = (page: number) => {
    return () => onPageSelect(page);
  };

  return (
    <nav
      aria-label="Page Navigation"
      className={mergeClass(
        "w-full flex flex-col items-center my-3",
        container?.className
      )}
    >
      <ul className="inline-flex items-center -space-x-px">
        {firstPage ? (
          <PageItem
            onClick={makeOnPageClickHandler(firstPage)}
            disabled={false}
          >
            First
          </PageItem>
        ) : null}

        <PageItem
          onClick={makeOnPageClickHandler(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </PageItem>

        {previousPages.map((page) => (
          <PageItem
            key={page}
            onClick={makeOnPageClickHandler(page)}
            disabled={false}
          >
            {page}
          </PageItem>
        ))}

        <PageItem disabled>{currentPage}</PageItem>

        {nextPages.map((page) => (
          <PageItem
            key={page}
            onClick={makeOnPageClickHandler(page)}
            disabled={false}
          >
            {page}
          </PageItem>
        ))}

        <PageItem
          onClick={makeOnPageClickHandler(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next</span>
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </PageItem>

        {lastPage ? (
          <PageItem onClick={makeOnPageClickHandler(lastPage)} disabled={false}>
            Last
          </PageItem>
        ) : null}
      </ul>

      <span className="text-xs dark:font-mono">
        Showing <HelpText>{begin}</HelpText> to <HelpText>{end}</HelpText> of{" "}
        <HelpText>{totalResults}</HelpText> Entries
      </span>
    </nav>
  );
}

type PageProps = PropsWithChildren<
  Pick<HTMLProps<HTMLButtonElement>, "onClick" | "disabled" | "className">
>;

function PageItem({ children, onClick, disabled, className }: PageProps) {
  return (
    <li>
      <button
        className={mergeClass(
          "px-1 py-1 leading-tight dark:font-mono",
          disabled ? "text-muted" : "text-accent hover:text-accent",
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </li>
  );
}

type HelpTextProps = PropsWithChildren;

function HelpText({ children }: HelpTextProps) {
  return (
    <span className="font-semibold text-accent dark:text-xl dark:font-cursive">
      {children}
    </span>
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
