type ErrorMessageProps = {
  summary?: string;
  error?: Error;
};
export function ErrorMessage({ summary, error }: ErrorMessageProps) {
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
