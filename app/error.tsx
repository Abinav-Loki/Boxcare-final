"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="max-w-md space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--boxcare-danger)]">
          Something went wrong
        </p>
        <h1 className="text-2xl font-semibold">We could not load this page.</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-[var(--boxcare-brown)] px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
