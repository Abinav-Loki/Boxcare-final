import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Box Care",
    template: "%s | Box Care",
  },
  description:
    "Box Care packaging ecommerce platform for boxes, mailers, accessories, custom quotes, and bulk orders.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
