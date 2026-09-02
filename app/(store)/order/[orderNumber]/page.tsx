import { RoutePlaceholder } from "@/components/common/route-placeholder";

type OrderPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;

  return (
    <RoutePlaceholder
      owner="Developer C"
      title={`Order: ${orderNumber}`}
      description="Customer order tracking route with payment status, shipment status, courier details, tracking URL, items, totals, and support contact."
    />
  );
}
