"use client";

import React, { useState, useEffect } from "react";
import { getAdminDashboardMetricsAction } from "@/app/actions/admin-dashboard";

export function MetricsGrid() {
  const [metricsData, setMetricsData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAdminDashboardMetricsAction();
        if (res.success && res.data) {
          setMetricsData(res.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      }
    }
    load();
  }, []);

  const totalRev = metricsData ? `₹${(metricsData.totalRevenueRupees ?? 0).toLocaleString("en-IN")}` : "₹0";
  const totalOrders = metricsData ? String(metricsData.totalOrders ?? 0) : "0";
  const pendingOrders = metricsData ? `${metricsData.pendingOrdersCount ?? 0} to fulfill` : "All clear";
  const activeProds = metricsData ? `${metricsData.activeProducts ?? 0} SKUs` : "0 SKUs";
  const totalCats = metricsData ? `${metricsData.totalCategories ?? 0} Categories` : "0 Categories";
  const lowStock = metricsData ? `${metricsData.lowStockVariantsCount ?? 0} low stock` : "0 low stock";

  const metrics = [
    {
      title: "Total Confirmed Revenue",
      value: totalRev,
      change: "Live DB",
      period: "Verified Payments",
      isPositive: true,
      icon: "💰",
    },
    {
      title: "Total Customer Orders",
      value: totalOrders,
      change: "Realtime",
      period: pendingOrders,
      isPositive: true,
      icon: "📦",
    },
    {
      title: "Catalog Categories",
      value: totalCats,
      change: "Active",
      period: "Product Taxonomy",
      isPositive: true,
      icon: "🗂️",
    },
    {
      title: "Active Products in Catalog",
      value: activeProds,
      change: `${metricsData?.totalProducts || 0} Total`,
      period: lowStock,
      isPositive: true,
      icon: "🏷️",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {metrics.map((m, idx) => (
        <div
          key={idx}
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EDE3D4",
            padding: "20px",
            boxShadow: "0 1px 4px rgba(43,43,43,0.04)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {m.title}
            </span>
            <span style={{ fontSize: "16px" }}>{m.icon}</span>
          </div>

          <div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#2B2B2B", letterSpacing: "-0.02em" }}>
              {m.value}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "6px",
                  background: "#ECFDF5",
                  color: "#059669",
                  border: "1px solid #A7F3D0",
                }}
              >
                {m.change}
              </span>
              <span style={{ fontSize: "11px", color: "#8E8880" }}>
                {m.period}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
