import { Form, useForm } from "../../components/form";
import { SearchQuery } from "./search-api";

type SearchFormData = Pick<SearchQuery, "q">;
export type SearchFormProps = {
  initialQuery: SearchQuery;
  // eslint-disable-next-line -- value is not used, because it's a type
  onSubmit: (value: SearchFormData) => void | Promise<void>;
};

export function SearchForm({ onSubmit, initialQuery }: SearchFormProps) {
  const [formState, { makeOnChangeHandler, makeOnSubmitHandler }] =
    useForm<SearchFormData>({ initialData: { q: initialQuery.q } });

  return (
    <Form onSubmit={makeOnSubmitHandler(onSubmit)}>
      <Form.Input
        id="q"
        name="q"
        label="Search by product name, price, size, etc..."
        onChange={makeOnChangeHandler()}
        value={formState.value.q}
      />

      <Form.Submit disabled={Boolean(formState.error)}>Submit</Form.Submit>
      <Form.ErrorMessage error={formState.error} />
    </Form>
  );
}
