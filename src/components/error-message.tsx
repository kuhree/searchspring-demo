type ErrorMessageProps = {
  summary?: string;
  error?: Error;
};

export function ErrorMessage({ summary, error }: ErrorMessageProps) {
  if (error) {
    return (
      <details className="mx-auto my-2 text-center px-2 py-4">
        <summary className="text-red-700">
          {summary ?? "An error occured while using this form"}
        </summary>

        <p>{error?.message}</p>

        {process.env.NODE_ENV !== "production" ? (
          <div className="px-2 py-4 text-left border border-spacing-4 border-red-500">
            <pre>Name: {error?.name}</pre>

            <pre className="whitespace-pre-wrap">
              Cause: {JSON.stringify(error?.cause)}
            </pre>

            <pre className="whitespace-pre-wrap">Trace: {error?.stack}</pre>
          </div>
        ) : null}
      </details>
    );
  }

  return null;
}
