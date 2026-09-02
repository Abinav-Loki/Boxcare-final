import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function ProductsPage() {
  return (
    <RoutePlaceholder
      owner="Developer A"
      title="Products Catalogue"
      description="All-products listing with search, filters, sorting, stock states, product cards, add-to-cart, and quote actions."
      checklist={[
        "Build filter UI from available product/variant data.",
        "Support empty and out-of-stock states.",
        "Prepare props for database-backed product lists.",
      ]}
    />
  );
}
