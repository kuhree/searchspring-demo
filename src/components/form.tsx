import { useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { z } from "zod";
import { mergeClass } from "../utils/merge-class";
import { ErrorMessage } from "./error-message";

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
          const { name, value } = z
            .object({
              value: z.string().min(1),
              name: z
                .string()
                .min(1)
                .refine(
                  (value) => value in formState.value,
                  "Name is not found within form data."
                ),
            })
            .parse(e.target);

          setFormState((prev) => ({
            ...prev,
            error: undefined,
            value: { ...prev.value, [name]: value },
          }));
        } catch (err) {
          const error = new Error("Your input is invalid. Please try again.", {
            cause: err,
          });
          setFormState((prev) => ({ ...prev, error }));
          return;
        }
      };
    };

  return [formState, { makeOnChangeHandler, makeOnSubmitHandler }] as const;
}

type FormProps = JSXInternal.HTMLAttributes<HTMLFormElement>;
function FormContainer({ class: classList, ...props }: FormProps) {
  return (
    <form class={mergeClass("w-full max-w-md mx-auto", classList)} {...props} />
  );
}

type InputProps = JSXInternal.HTMLAttributes<HTMLInputElement>;
function Input({ class: classList, ...props }: InputProps) {
  return (
    <input
      class={mergeClass(
        "appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight",
        classList
      )}
      {...props}
    />
  );
}

type SubmitProps = Omit<
  JSXInternal.HTMLAttributes<HTMLButtonElement>,
  "submit"
>;
function Submit({ class: classList, ...props }: SubmitProps) {
  return (
    <button
      type="submit"
      class={mergeClass(
        "flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded",
        classList
      )}
      {...props}
    />
  );
}

type FormState<FormData> = {
  error?: Error;
  value: FormData;
};

export const Form = Object.assign(FormContainer, {
  Input,
  Submit,
  ErrorMessage,
});
