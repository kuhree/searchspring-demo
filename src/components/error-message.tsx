import { HTMLProps, PropsWithChildren } from "react";

type ErrorMessageProps = {
  summary?: string;
  error?: Error;
};

export function ErrorMessage({ summary, error }: ErrorMessageProps) {
  if (error) {
    return (
      <details className="relative mx-auto max-w-2xl my-2 px-2 py-4 backdrop-blur">
        <summary className="text-red-700 text-xl">
          {summary ??
            "An unknown error has occured. Check the console for more information."}
        </summary>

        {/* eslint-disable-next-line -- process is definitely defined */}
        {process.env.NODE_ENV !== "production" ? (
          <div className="relative m-4 p-4 text-left text-muted bg-muted border-2 border-accent">
            <ErrorBoard summary="Cause">
              {error.cause instanceof Error ? (
                <ErrorMessage error={error.cause} />
              ) : (
                <pre className="whitespace-pre-wrap my-2 bg-primary p-4">
                  {JSON.stringify(error?.cause)}
                </pre>
              )}
            </ErrorBoard>

            <ErrorBoard summary="Trace">{error?.stack}</ErrorBoard>
          </div>
        ) : null}
      </details>
    );
  }

  return null;
}

type ErrorBoardProps = PropsWithChildren<HTMLProps<HTMLDetailsElement>>;
function ErrorBoard({ children, summary, ...props }: ErrorBoardProps) {
  return (
    <details {...props}>
      <summary>{summary}</summary>
      <pre className="whitespace-pre-wrap my-2 bg-primary p-4">{children}</pre>
    </details>
  );
}
