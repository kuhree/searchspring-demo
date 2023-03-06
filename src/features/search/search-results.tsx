/* eslint-disable camelcase -- can't control db_data */

import { HTMLProps, PropsWithChildren } from "react";
import { mergeClass } from "../../utils/merge-class";
import { SearchQueryResponse } from "./search-api";

type SearchResultsProps = PropsWithChildren<
  Pick<HTMLProps<HTMLDivElement>, "className">
>;

function SearchContainer({ children, className }: SearchResultsProps) {
  return (
    <section
      className={mergeClass(
        "flex flex-col p-[5%]",
        "lg:flex-row lg:items-start",
        className
      )}
    >
      {children}
    </section>
  );
}

type SearchNavProps = PropsWithChildren<
  Pick<HTMLProps<HTMLDivElement>, "className">
>;

function SearchNav({ children, className }: SearchNavProps) {
  return (
    <aside
      className={mergeClass(
        "relative z-10 p-6 mb-8 flex-grow-0 xl:basis-2/6 text-center rounded-md shadow-md bg-muted border-2 border-accent",
        "lg:sticky lg:top-[10%]",
        className
      )}
    >
      {children}
    </aside>
  );
}

type SearchContentProps = PropsWithChildren<
  Pick<HTMLProps<HTMLDivElement>, "className">
>;
function SearchContent({ children, className }: SearchContentProps) {
  return (
    <div className={mergeClass("flex-grow-1 basis-5/6", className)}>
      {children}
    </div>
  );
}

type CardGridProps = PropsWithChildren;
function CardGrid({ children }: CardGridProps) {
  return <ul className="flex flex-wrap justify-around">{children}</ul>;
}

type ProductCardProps = {
  item: SearchQueryResponse["results"][number];
};

function ProductCard({
  item: {
    id,
    price,
    msrp,
    thumbnailImageUrl,
    color,
    name,
    material,
    brand,
    description,
    condition,
    ratingCount,
    addToCartUrl,
    keywords,
    quantity_available,
    days_since_published,
    sku,
    size,
  },
}: ProductCardProps) {
  const isOnSale = price < msrp;

  return (
    <li
      key={id}
      className={mergeClass(
        "product-card",
        "relative basis-full shadow-md mx-2 mb-4 max-w-[16rem] flex flex-col backdrop-blur"
      )}
    >
      <div className={mergeClass("w-full basis-1/2")}>
        <img
          src={thumbnailImageUrl}
          alt={name}
          className={mergeClass("w-full h-full object-cover")}
          onError={(e) => {
            e.currentTarget.src = "/vite.svg";
          }}
        />
      </div>

      <div
        className={mergeClass(
          "px-6 py-4 basis-full flex flex-col justify-between "
        )}
      >
        <div>
          <p className="text-accent dark:font-cursive">{brand}</p>
          <p className="font-bold dark:font-accent text-sm">{name}</p>
        </div>

        <div>
          <div className="flex items-center my-4">
            <span className="text-xl font-bold">
              ${parseFloat(price).toFixed(2)}
            </span>

            {isOnSale ? (
              <span className="mx-2 line-through text-red-600">${msrp}</span>
            ) : null}
          </div>

          <details className="fill">
            <summary className="text-muted text-sm" />
            <ItemDetail childClassName="inline-block prose-base font-normal text-muted mb-2">
              {description}
            </ItemDetail>

            <ItemDetail label="Last Updated">
              {days_since_published}d
            </ItemDetail>
            <ItemDetail label="SKU">{sku}</ItemDetail>
            <ItemDetail label="Condition">{condition.join(", ")}</ItemDetail>
            <ItemDetail label="Reviews">{ratingCount}</ItemDetail>
            <ItemDetail label="In Stock">
              {quantity_available.join(", ")}
            </ItemDetail>
            {color?.length ? (
              <ItemDetail label="Colors">{color?.join(", ")}</ItemDetail>
            ) : null}
            {size?.length ? (
              <ItemDetail label="Sizes">{size?.join(", ")}</ItemDetail>
            ) : null}
            {material?.length ? (
              <ItemDetail label="Materials">{material?.join(", ")}</ItemDetail>
            ) : null}

            {keywords?.length ? (
              <ItemDetail label="Keywords">{keywords?.join(", ")}</ItemDetail>
            ) : null}
          </details>
        </div>
      </div>
    </li>
  );
}

type ItemDetailProps = PropsWithChildren<
  HTMLProps<HTMLParagraphElement> & {
    label?: string;
    childClassName?: string;
  }
>;
function ItemDetail({
  children,
  className,
  childClassName,
  label,
  ...props
}: ItemDetailProps) {
  return (
    <p {...props} className={mergeClass("text-muted", className)}>
      {label ? <>{label}: </> : null}
      <span className={mergeClass("font-semibold text-accent", childClassName)}>
        {children}
      </span>
    </p>
  );
}

export const Search = Object.assign(
  {},
  {
    Container: SearchContainer,
    Nav: SearchNav,
    Content: SearchContent,
    CardGrid,
    Card: ProductCard,
  }
);
