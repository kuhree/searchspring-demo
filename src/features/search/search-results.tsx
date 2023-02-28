import { RenderableProps } from "preact";
import { SearchQueryResponse } from "./search-api";

type SearchResultsProps = RenderableProps<{}>;

function SearchContainer({ children }: SearchResultsProps) {
  return <section>{children}</section>;
}

type ResultGridProps = RenderableProps<{}>;
function ResultsGrid({ children }: ResultGridProps) {
  return <div class="flex flex-wrap">{children}</div>;
}

type ResultItemProps = {
  item: SearchQueryResponse["results"][number];
};

function ResultsItem({ item }: ResultItemProps) {
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

export const Search = Object.assign(SearchContainer, {
  ResultsGrid,
  ResultsItem,
});
