import React from "react";
import { NavigationManager } from "@/components/admin/navigation/navigation-manager";

export const metadata = {
  title: "Navigation Manager | BoxCare Admin",
  description: "Manage BoxCare storefront navigation links, megamenu dropdowns, mobile drawer, and footer columns.",
};

export default function AdminNavigationPage() {
  return <NavigationManager />;
}
