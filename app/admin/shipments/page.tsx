import React from "react";
import { ShipmentsManager } from "@/components/admin/shipments/shipments-manager";

export const metadata = {
  title: "Shipments & Logistics | BoxCare Admin",
  description: "Track dispatches, courier partners, AWB tracking numbers, and fulfillment progress.",
};

export default function AdminShipmentsPage() {
  return <ShipmentsManager />;
}
