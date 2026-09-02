import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="max-w-md space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--boxcare-orange)]">
          Page not found
        </p>
        <h1 className="text-2xl font-semibold">This Box Care page is not available.</h1>
        <p className="text-sm text-muted-foreground">
          The route may be inactive, unpublished, or waiting for database content.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-md bg-[var(--boxcare-brown)] px-4 py-2 text-sm font-semibold text-white"
        >
          Go home
        </Link>
      </section>
    </main>
  );
}
