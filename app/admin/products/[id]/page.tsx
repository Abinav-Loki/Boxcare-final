import { RoutePlaceholder } from "@/components/common/route-placeholder";

type AdminProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductPage({
  params,
}: AdminProductPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      owner="Developer B"
      title={`Edit Product: ${id}`}
      description="Admin product editor route for product details, variants, pricing, stock, media, and SEO."
    />
  );
}
