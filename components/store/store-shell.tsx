import Link from "next/link";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/category/mailer-boxes", label: "Mailer Boxes" },
  { href: "/custom-boxes", label: "Custom Boxes" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/contact", label: "Contact" },
];

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="bg-boxcare-brown px-4 py-2 text-center text-sm font-medium text-white">
        GST-inclusive pricing, custom packaging quotes, and bulk order support.
      </div>
      <header className="border-b border-boxcare-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-2xl font-black text-boxcare-brown">
            Box Care
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-boxcare-charcoal">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="border-t border-boxcare-border bg-boxcare-charcoal px-5 py-8 text-sm text-white">
        <div className="mx-auto max-w-6xl">
          Dynamic footer navigation will be connected from admin settings.
        </div>
      </footer>
    </div>
  );
}
