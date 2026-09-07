"use client";

import React from "react";
import Link from "next/link";

export function TopProductsAndStock() {
  const topProducts = [
    {
      id: "mb-1",
      name: "3.30 X 2.75 X 1 Inch Mailer Box",
      category: "Mailer Boxes",
      salesCount: 4200,
      revenue: "₹38,500",
    },
    {
      id: "mb-2",
      name: "6.00 X 4.00 X 2.50 Inch Shipping Box",
      category: "Corrugated Boxes",
      salesCount: 3100,
      revenue: "₹32,200",
    },
    {
      id: "mb-3",
      name: "Self-Locking Die Cut Box 8x6x3",
      category: "Die Cut Boxes",
      salesCount: 2400,
      revenue: "₹26,800",
    },
  ];

  const lowStockItems = [
    {
      id: "st-1",
      name: "Reinforced 5-Ply Heavy Box (14x10x8)",
      sku: "BX-5P-14108",
      stock: 45,
      threshold: 200,
      status: "CRITICAL",
    },
    {
      id: "st-2",
      name: "Water-Activated Kraft Tape (50m)",
      sku: "TP-KRAFT-50",
      stock: 18,
      threshold: 100,
      status: "CRITICAL",
    },
    {
      id: "st-3",
      name: "White Mailer Box (5x5x2)",
      sku: "BX-WM-05052",
      stock: 120,
      threshold: 250,
      status: "LOW",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
      }}
    >
      {/* Top Products */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #EDE3D4",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(43,43,43,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #EDE3D4", paddingBottom: "12px" }}>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#2B2B2B", margin: 0 }}>
              Top Selling Packaging
            </h2>
            <p style={{ fontSize: "11px", color: "#8E8880", margin: "2px 0 0 0" }}>
              High volume catalog SKUs
            </p>
          </div>
          <Link href="/admin/products" style={{ fontSize: "12px", fontWeight: 600, color: "#5C3A22", textDecoration: "none" }}>
            All Products →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {topProducts.map((prod, index) => (
            <div
              key={prod.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: index === topProducts.length - 1 ? "none" : "1px solid #F7F2EC",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#8E8880", width: "18px" }}>
                  #{index + 1}
                </span>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#F7F2EC", border: "1px solid #EDE3D4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                  📦
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B2B2B" }}>{prod.name}</div>
                  <div style={{ fontSize: "11px", color: "#8E8880" }}>{prod.category} • {prod.salesCount.toLocaleString()} sold</div>
                </div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#2B2B2B" }}>
                {prod.revenue}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #EDE3D4",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(43,43,43,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #EDE3D4", paddingBottom: "12px" }}>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#2B2B2B", margin: 0 }}>
              Low Stock Alerts
            </h2>
            <p style={{ fontSize: "11px", color: "#8E8880", margin: "2px 0 0 0" }}>
              Items requiring factory restock
            </p>
          </div>
          <Link href="/admin/products" style={{ fontSize: "12px", fontWeight: 600, color: "#DC2626", textDecoration: "none" }}>
            Inventory →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {lowStockItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: index === lowStockItems.length - 1 ? "none" : "1px solid #F7F2EC",
              }}
            >
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B2B2B" }}>{item.name}</div>
                <div style={{ fontSize: "11px", color: "#8E8880" }}>SKU: {item.sku} • Min: {item.threshold} pcs</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "6px",
                    background: item.status === "CRITICAL" ? "#FEF2F2" : "#FFFBEB",
                    color: item.status === "CRITICAL" ? "#DC2626" : "#D97706",
                    border: `1px solid ${item.status === "CRITICAL" ? "#FECACA" : "#FDE68A"}`,
                  }}
                >
                  {item.stock} left
                </span>
                <Link
                  href="/admin/products"
                  style={{
                    padding: "4px 8px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#5C3A22",
                    background: "#F7F2EC",
                    borderRadius: "6px",
                    border: "1px solid #EDE3D4",
                    textDecoration: "none",
                  }}
                >
                  Restock
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
