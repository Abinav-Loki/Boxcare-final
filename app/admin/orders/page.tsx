import React from "react";
import { OrdersManager } from "@/components/admin/orders/orders-manager";

export const metadata = {
  title: "Orders Pipeline | BoxCare Admin",
  description: "View customer orders, immutable snapshot items, update fulfillment statuses, and manage payments.",
};

export default function AdminOrdersPage() {
  return <OrdersManager />;
}
