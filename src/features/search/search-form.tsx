import { useEffect } from "react";
import { Form } from "../../components/form";
import { SearchQuery } from "./search-api";

export type SearchFormProps = {
  initialQuery: SearchQuery;
};

export function SearchForm({ initialQuery }: SearchFormProps) {
  useEffect(() => {
    const input = document.getElementById("q") as HTMLInputElement | null;

    if (input) {
      input.value = initialQuery.q;
    }
  }, [initialQuery]);
  return (
    <Form id="search-form" role="search" method="get">
      <div className="flex items-center border-b border-teal-500 py-2">
        <Form.Input
          id="q"
          name="q"
          placeholder="Search by product name, price, size, etc..."
          aria-label="Search Products"
          defaultValue={initialQuery.q}
        />

        <Form.Submit>Search</Form.Submit>
      </div>
    </Form>
  );
}
