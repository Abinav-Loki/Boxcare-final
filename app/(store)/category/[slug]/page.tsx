import { RoutePlaceholder } from "@/components/common/route-placeholder";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <RoutePlaceholder
      owner="Developer A"
      title={`Category: ${slug}`}
      description="Dynamic SEO-ready category route. Developer B will supply category/product data contracts; Developer A owns the storefront rendering."
      checklist={[
        "Load active category by slug.",
        "Render products for the selected category.",
        "Generate metadata and sitemap entries from active categories.",
      ]}
    />
  );
}
