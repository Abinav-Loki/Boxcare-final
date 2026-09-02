import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function HomePage() {
  return (
    <RoutePlaceholder
      owner="Developer A"
      title="Box Care Storefront Home"
      description="Migrate the finalized home UI here: hero, search, category sections, featured products, custom quote CTA, trust sections, and dynamic content slots."
      checklist={[
        "Use the finalized static index.html as the visual baseline.",
        "Replace hardcoded category/product cards with component props.",
        "Keep content ready for database-backed banners and featured categories.",
      ]}
    />
  );
}
