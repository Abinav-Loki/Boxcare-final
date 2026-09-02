type RoutePlaceholderProps = {
  title: string;
  description: string;
  owner: "Developer A" | "Developer B" | "Developer C" | "Project Lead";
  checklist?: string[];
};

export function RoutePlaceholder({
  title,
  description,
  owner,
  checklist = [],
}: RoutePlaceholderProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-10">
      <div className="rounded-lg border border-boxcare-border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-boxcare-orange">{owner}</p>
        <h1 className="mt-2 text-3xl font-bold text-boxcare-charcoal">{title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">{description}</p>
      </div>

      {checklist.length > 0 ? (
        <div className="rounded-lg border border-boxcare-border bg-boxcare-beige p-6">
          <h2 className="text-lg font-semibold text-boxcare-charcoal">First tasks</h2>
          <ul className="mt-4 grid gap-3 text-sm text-neutral-700 md:grid-cols-2">
            {checklist.map((item) => (
              <li key={item} className="rounded-md bg-white p-3 shadow-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
