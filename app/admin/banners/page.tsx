import React from "react";
import { BannersManager } from "@/components/admin/banners/banners-manager";

export const metadata = {
  title: "Banners & Promotions | BoxCare Admin",
  description: "Manage hero carousels, offer strips, category promotional spots, and promo popups.",
};

export default function AdminBannersPage() {
  return <BannersManager />;
}
