import { useRouteError } from "react-router-dom";
import { ErrorMessage } from "../components/error-message";

export function ErrorPage() {
  const err = useRouteError();
  const error =
    err instanceof Error
      ? err
      : new Error(
          "There is a problem with your current route. Check the console for more information",
          { cause: err }
        );

  console.error(error);

  return (
    <ErrorMessage
      summary="Sorry, an unexpected error has occured"
      error={error}
    />
  );
}
