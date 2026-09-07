"use client";

import React from "react";
import Link from "next/link";

export function DashboardHeader() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#2B2B2B", margin: 0, letterSpacing: "-0.02em" }}>
          Dashboard Overview
        </h1>
        <p style={{ fontSize: "12px", color: "#6B6B6B", margin: "4px 0 0 0" }}>
          Live metrics, recent customer orders, and packaging inventory.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link
          href="/admin/orders"
          style={{
            padding: "8px 16px",
            background: "#FFFFFF",
            border: "1px solid #EDE3D4",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#5C3A22",
            textDecoration: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          Orders (12 New)
        </Link>
        <Link
          href="/admin/products"
          style={{
            padding: "8px 16px",
            background: "#5C3A22",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#FFFFFF",
            textDecoration: "none",
            boxShadow: "0 2px 6px rgba(92, 58, 34, 0.25)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>+</span>
          <span>Add Product</span>
        </Link>
      </div>
    </div>
  );
}
