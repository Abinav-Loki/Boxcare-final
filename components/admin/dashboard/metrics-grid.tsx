"use client";

import React from "react";

export function MetricsGrid() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "₹1,48,920",
      change: "+14.8%",
      period: "vs last month",
      isPositive: true,
      icon: "💰",
    },
    {
      title: "Total Orders",
      value: "142",
      change: "+22%",
      period: "12 to dispatch",
      isPositive: true,
      icon: "📦",
    },
    {
      title: "Avg. Order Value",
      value: "₹1,048",
      change: "+6.2%",
      period: "per tier order",
      isPositive: true,
      icon: "📈",
    },
    {
      title: "Active Products",
      value: "28 SKUs",
      change: "4 Categories",
      period: "2 low stock",
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
