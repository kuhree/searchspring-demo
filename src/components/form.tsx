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
        "appearance-none bg-transparent border-none font-mono w-full mr-3 py-1 px-2 leading-tight",
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
        "flex-shrink-0 bg-muted text-primary font-accent text-sm p-2",
        "hover:bg-accent",
        "focus:bg-accent",
        "transition-colors",
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
