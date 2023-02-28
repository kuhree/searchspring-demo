import { describe, expect, it } from "vitest";
import { getPageRanges } from "./search-pagination";

describe("Page Ranges", () => {
  it("should return a range of possible pages", () => {
    const { firstPage, previousPages, currentPage, nextPages, lastPage } =
      getPageRanges({ totalPages: 10, currentPage: 5, range: 1 });

    expect(firstPage).toStrictEqual(1);
    expect(previousPages).toStrictEqual([4]);
    expect(currentPage).toStrictEqual(5);
    expect(nextPages).toStrictEqual([6]);
    expect(lastPage).toStrictEqual(10);
  });

  it("should return a range of possible pages within the given range", () => {
    const { firstPage, previousPages, currentPage, nextPages, lastPage } =
      getPageRanges({ totalPages: 50, currentPage: 25, range: 5 });

    expect(firstPage).toStrictEqual(1);
    expect(previousPages).toStrictEqual([20, 21, 22, 23, 24]);
    expect(currentPage).toStrictEqual(25);
    expect(nextPages).toStrictEqual([26, 27, 28, 29, 30]);
    expect(lastPage).toStrictEqual(50);
  });

  it("should not contain duplicate pages on the left edge", () => {
    const { firstPage, previousPages, currentPage, nextPages, lastPage } =
      getPageRanges({ totalPages: 3, currentPage: 1, range: 1 });

    expect(firstPage).toStrictEqual(undefined);
    expect(previousPages).toStrictEqual([]);
    expect(currentPage).toStrictEqual(1);
    expect(nextPages).toStrictEqual([2]);
    expect(lastPage).toStrictEqual(3);
  });

  it("should not contain duplicate pages on the right edge", () => {
    const { firstPage, previousPages, currentPage, nextPages, lastPage } =
      getPageRanges({ totalPages: 3, currentPage: 3, range: 1 });

    expect(firstPage).toStrictEqual(1);
    expect(previousPages).toStrictEqual([2]);
    expect(currentPage).toStrictEqual(3);
    expect(nextPages).toStrictEqual([]);
    expect(lastPage).toStrictEqual(undefined);
  });
});
