import type { MetadataRoute } from "next";

const staticRoutes = [
  "",
  "/products",
  "/search",
  "/custom-boxes",
  "/bulk-orders",
  "/accessories",
  "/industries",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://boxcare-c881.vercel.app";

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
