import { useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

type FormProps = JSXInternal.HTMLAttributes<HTMLFormElement>;
function Form(props: FormProps) {
  return <form {...props} />;
}

type InputProps = JSXInternal.HTMLAttributes<HTMLInputElement>;
function Input({ label, ...props }: InputProps) {
  return (
    <label>
      {label}
      <input {...props} />
    </label>
  );
}

type SubmitProps = Omit<
  JSXInternal.HTMLAttributes<HTMLButtonElement>,
  "submit"
>;
function Submit(props: SubmitProps) {
  return <button type="submit" {...props} />;
}

type ErrorMessageProps = {
  summary?: string;
  error?: Error;
};
function ErrorMessage({ summary, error }: ErrorMessageProps) {
  if (error) {
    return (
      <details>
        <summary>{summary ?? "An error occured while using this form"}</summary>
        <pre>{error?.message}</pre>
        <pre>{error?.name}</pre>

        {process.env.NODE_ENV === "production" ? (
          <>
            <pre>{JSON.stringify(error?.cause)}</pre>
            <pre>{error?.stack}</pre>
          </>
        ) : null}
      </details>
    );
  }

  return null;
}

type FormState<FormData> = {
  error?: Error;
  value: FormData;
};

type UseFormProps<FormData> = {
  initialData: FormData;
};

export function useForm<FormData extends Object>({
  initialData,
}: UseFormProps<FormData>) {
  const [formState, setFormState] = useState<FormState<FormData>>({
    value: initialData,
  });

  const makeOnSubmitHandler = (
    // eslint-disable-next-line -- value is not used, because it's a type
    callbackFn: (value: FormData) => Promise<void> | void
  ): JSXInternal.GenericEventHandler<HTMLFormElement> => {
    return (e) => {
      e.preventDefault();

      try {
        callbackFn(formState.value);
      } catch (err) {
        const error = new Error(
          "A problem occurred while submitting your form",
          { cause: err }
        );

        setFormState((prev) => ({ ...prev, error }));
      }
    };
  };
  const makeOnChangeHandler =
    (): JSXInternal.GenericEventHandler<HTMLInputElement> => {
      return (e) => {
        try {
          if (!e.target) return;
          else if (!("name" in e.target) || typeof e.target.name !== "string") {
            throw new Error(
              "Name not found on target. Please add a name to your input element."
            );
          } else if (!(e.target.name in formState.value)) {
            throw new Error(
              "Name is not found in formState. Please add the name to your form controller."
            );
          } else if (
            !("value" in e.target) ||
            typeof e.target.value !== "string"
          ) {
            throw new Error(
              "Value not found on target. Be sure to use the correct input element."
            );
          }
        } catch (err) {
          const error = new Error("Your input is invalid. Please try again.", {
            cause: err,
          });
          setFormState((prev) => ({ ...prev, error }));
          return;
        }

        const { name, value } = e.target;

        setFormState((prev) => ({
          ...prev,
          error: undefined,
          value: { ...prev.value, [name]: value },
        }));
      };
    };

  return [
    formState,
    {
      makeOnChangeHandler,
      makeOnSubmitHandler,
    },
  ] as const;
}

export default Object.assign(Form, {
  Input,
  Submit,
  ErrorMessage,
});
