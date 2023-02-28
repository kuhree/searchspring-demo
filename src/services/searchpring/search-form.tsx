import Form, { useForm } from "../../components/form";
import { SearchQuery } from "./searchspring";

type SearchFormData = Pick<SearchQuery, "q">;
export type SearchFormProps = {
  // eslint-disable-next-line -- value is not used, because it's a type
  onSubmit: (value: SearchFormData) => void | Promise<void>;
};

export function SearchForm({ onSubmit }: SearchFormProps) {
  const [formState, { makeOnChangeHandler, makeOnSubmitHandler }] =
    useForm<SearchFormData>({ initialData: { q: "" } });

  return (
    <Form onSubmit={makeOnSubmitHandler(onSubmit)}>
      <Form.Error error={formState.error} />
      <Form.Input
        id="query"
        name="query"
        label="Search by product name, price, size, etc..."
        onChange={makeOnChangeHandler()}
        value={formState.value.q}
      />

      <Form.Submit disabled={Boolean(formState.error)}>Submit</Form.Submit>
    </Form>
  );
}
