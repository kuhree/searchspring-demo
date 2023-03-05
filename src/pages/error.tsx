import { useEffect } from "react";
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

  useEffect(() => {
    console.error(error);
    // Other Error Handling: Sentry? Logs?
  }, [error]);

  return (
    <ErrorMessage
      summary={error.message ?? "Sorry, an unexpected error has occured"}
      error={error}
    />
  );
}
