import Link from "next/link";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/navigation", label: "Navigation" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/shipments", label: "Shipments" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-neutral-100 md:grid-cols-[260px_1fr]">
      <aside className="border-r border-neutral-200 bg-boxcare-charcoal p-5 text-white">
        <Link href="/admin/dashboard" className="text-xl font-black">
          Box Care Admin
        </Link>
        <nav className="mt-8 grid gap-2 text-sm">
          {adminLinks.map((link) => (
            <Link
              className="rounded-md px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex min-w-0 flex-col">{children}</main>
    </div>
  );
}
