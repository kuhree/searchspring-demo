/* eslint-disable camelcase -- can't control db_data */

import { PropsWithChildren } from "react";
import { mergeClass } from "../../utils/merge-class";
import { SearchQueryResponse } from "./search-api";

type SearchResultsProps = PropsWithChildren;

function SearchContainer({ children }: SearchResultsProps) {
  return <section>{children}</section>;
}

type ResultGridProps = PropsWithChildren;
function ResultsGrid({ children }: ResultGridProps) {
  return <ul className="flex flex-wrap justify-center">{children}</ul>;
}

type ResultItemProps = {
  item: SearchQueryResponse["results"][number];
};

function ResultsItem({ item }: ResultItemProps) {
  const {
    id,
    price,
    msrp,
    thumbnailImageUrl,
    name,
    brand,
    description,
    popularity,
    condition,
    ratingCount,
    addToCartUrl,
    quantity_available,
  } = item;

  const isOnSale = item.price < item.msrp;
  return (
    <li
      key={id}
      className={mergeClass(
        "m-4 max-w-sm rounded-md overflow-hidden shadow-lg basis-full relative"
      )}
    >
      <img src={thumbnailImageUrl} alt={name} className="w-full object-cover" />

      <div className="px-6 py-4 flex flex-col h-full">
        <p className="text-gray-700">{brand}</p>
        <p className="font-bold text-xl">{name}</p>

        <div className="flex items-center my-4">
          <span className="text-3xl font-bold mr-2">
            ${parseFloat(price).toFixed(2)}
          </span>

          {isOnSale ? (
            <span className="line-through text-gray-400">${msrp}</span>
          ) : null}
        </div>

        <a
          aria-label="Add to Cart"
          className="self-end  bg-teal-500 transition-colors hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          href={addToCartUrl}
        >
          Add to Cart
        </a>

        <details className="my-2 text-gray-700 absolute bottom-0 bg-white px-2 py-4 rounded">
          <summary>More Info</summary>

          <p className="mb-2 text-base">{description}</p>

          <p>
            Condition:
            <span className="font-semibold">{condition}</span>
          </p>

          <p>
            Reviews: <span className="font-semibold">{ratingCount}</span>
          </p>
          <p>
            In Stock:{" "}
            <span className="font-semibold">{quantity_available}</span>
          </p>
          <p>
            Popularity: <span className="font-semibold">{popularity}</span>
          </p>
        </details>
      </div>
    </li>
  );
}

export const Search = Object.assign(SearchContainer, {
  ResultsGrid,
  ResultsItem,
});
