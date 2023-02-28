import { RenderableProps } from "preact";
import { mergeClass } from "../../utils/merge-class";
import { SearchQueryResponse } from "./search-api";

type SearchResultsProps = RenderableProps<{}>;

function SearchContainer({ children }: SearchResultsProps) {
  return <section>{children}</section>;
}

type ResultGridProps = RenderableProps<{}>;
function ResultsGrid({ children }: ResultGridProps) {
  return <ul class="flex flex-wrap justify-center">{children}</ul>;
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
      class={mergeClass(
        "m-4 max-w-sm rounded-md overflow-hidden shadow-lg basis-full relative"
      )}
    >
      <img src={thumbnailImageUrl} alt={name} class="w-full object-cover" />

      <div class="px-6 py-4 flex flex-col h-full">
        <p class="text-gray-700">{brand}</p>
        <p class="font-bold text-xl">{name}</p>

        <div class="flex items-center my-4">
          <span class="text-3xl font-bold mr-2">
            ${parseFloat(price).toFixed(2)}
          </span>

          {isOnSale ? (
            <span class="line-through text-gray-400">${msrp}</span>
          ) : null}
        </div>

        <a
          aria-label="Add to Cart"
          class="self-end  bg-teal-500 transition-colors hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          href={addToCartUrl}
        >
          Add to Cart
        </a>

        <details class="my-2 text-gray-700 absolute bottom-0 bg-white px-2 py-4 rounded">
          <summary>More Info</summary>

          <p class="mb-2 text-base">{description}</p>

          <p>
            Condition:
            <span class="font-semibold">{condition}</span>
          </p>

          <p>
            Reviews: <span class="font-semibold">{ratingCount}</span>
          </p>
          <p>
            In Stock: <span class="font-semibold">{quantity_available}</span>
          </p>
          <p>
            Popularity: <span class="font-semibold">{popularity}</span>
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
