import { RoutePlaceholder } from "@/components/common/route-placeholder";

type PolicyPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;

  return (
    <RoutePlaceholder
      owner="Developer B"
      title={`Policy: ${slug}`}
      description="Content-managed policy page for privacy, terms, shipping, refund, and cancellation content."
    />
  );
}
