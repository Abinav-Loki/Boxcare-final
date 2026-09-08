import React from "react";
import { ProductsManager } from "@/components/admin/products/products-manager";

export const metadata = {
  title: "Products Management | BoxCare Admin",
  description: "Manage BoxCare packaging catalog, artwork uploads, dimensions, volume tier prices, and stock status.",
};

export default function AdminProductsPage() {
  return <ProductsManager />;
}
