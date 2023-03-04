import { HTMLProps } from "react";
import { Form as RRForm, FormProps as RRFormProps } from "react-router-dom";
import { mergeClass } from "../utils/merge-class";

type FormProps = RRFormProps;
function FormContainer({ className, method, ...props }: FormProps) {
  return (
    <RRForm
      className={mergeClass("w-full max-w-md mx-auto", className)}
      method={method ?? "post"}
      {...props}
    />
  );
}

type InputProps = HTMLProps<HTMLInputElement>;
function Input({ className, name, ...props }: InputProps) {
  return (
    <input
      name={name}
      className={mergeClass(
        "appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight",
        className
      )}
      {...props}
    />
  );
}

type SubmitProps = Omit<HTMLProps<HTMLButtonElement>, "submit"> & {
  type: "button" | "submit";
};
function Submit({ className, type = "submit", ...props }: SubmitProps) {
  return (
    <button
      type={type}
      className={mergeClass(
        "flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded",
        className
      )}
      {...props}
    />
  );
}

export const Form = Object.assign(FormContainer, {
  Input,
  Submit,
});
