import React from "react";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { MetricsGrid } from "@/components/admin/dashboard/metrics-grid";
import { RevenueAnalytics } from "@/components/admin/dashboard/revenue-analytics";
import { RecentOrdersTable } from "@/components/admin/dashboard/recent-orders";
import { TopProductsAndStock } from "@/components/admin/dashboard/top-products-and-stock";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. Header & Actions */}
      <DashboardHeader />

      {/* 2. Key Performance Metrics */}
      <MetricsGrid />

      {/* 3. Sales Trend & Category Distribution */}
      <RevenueAnalytics />

      {/* 4. Recent Orders Feed */}
      <RecentOrdersTable />

      {/* 5. Top Products & Stock Alerts */}
      <TopProductsAndStock />
    </div>
  );
}
