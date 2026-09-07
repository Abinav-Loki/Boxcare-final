import React from "react";
import { CategoriesManager } from "@/components/admin/categories/categories-manager";

interface AdminCategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminCategoryDetailPage({ params }: AdminCategoryDetailPageProps) {
  const { slug } = await params;
  return <CategoriesManager initialSelectedSlug={slug} />;
}
