import { RoutePlaceholder } from "@/components/common/route-placeholder";

type AdminOrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      owner="Developer C"
      title={`Admin Order: ${id}`}
      description="Order detail route with customer details, order items, payment, shipment updates, status history, and admin notes."
    />
  );
}
