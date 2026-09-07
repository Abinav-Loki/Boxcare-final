"use client";

import React, { useState } from "react";

export function RevenueAnalytics() {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");

  const weeklyData = [
    { label: "Mon", value: "₹14.2k", height: 45 },
    { label: "Tue", value: "₹19.8k", height: 65 },
    { label: "Wed", value: "₹16.5k", height: 55 },
    { label: "Thu", value: "₹24.3k", height: 80 },
    { label: "Fri", value: "₹29.5k", height: 95 },
    { label: "Sat", value: "₹26.4k", height: 85 },
    { label: "Sun", value: "₹18.2k", height: 60 },
  ];

  const monthlyData = [
    { label: "Week 1", value: "₹32.0k", height: 55 },
    { label: "Week 2", value: "₹41.0k", height: 75 },
    { label: "Week 3", value: "₹36.0k", height: 65 },
    { label: "Week 4", value: "₹39.9k", height: 70 },
  ];

  const data = timeframe === "week" ? weeklyData : monthlyData;

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #EDE3D4",
        padding: "24px",
        boxShadow: "0 1px 4px rgba(43,43,43,0.04)",
        marginBottom: "24px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#2B2B2B", margin: 0 }}>
            Sales & Revenue Analytics
          </h2>
          <p style={{ fontSize: "11px", color: "#8E8880", margin: "2px 0 0 0" }}>
            Gross revenue generated from catalog and custom orders
          </p>
        </div>

        <div style={{ display: "flex", background: "#F7F2EC", padding: "4px", borderRadius: "10px", border: "1px solid #EDE3D4", gap: "4px" }}>
          <button
            onClick={() => setTimeframe("week")}
            style={{
              padding: "4px 12px",
              fontSize: "11px",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: timeframe === "week" ? "#5C3A22" : "transparent",
              color: timeframe === "week" ? "#FFFFFF" : "#6B6B6B",
              transition: "all 0.15s ease",
            }}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe("month")}
            style={{
              padding: "4px 12px",
              fontSize: "11px",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: timeframe === "month" ? "#5C3A22" : "transparent",
              color: timeframe === "month" ? "#FFFFFF" : "#6B6B6B",
              transition: "all 0.15s ease",
            }}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ padding: "16px 0 0 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "180px", borderBottom: "1px solid #EDE3D4", paddingBottom: "8px", gap: "12px" }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#8E8880", marginBottom: "6px" }}>
                {item.value}
              </span>
              <div style={{ width: "100%", maxWidth: "42px", height: "100%", background: "#F7F2EC", borderRadius: "8px 8px 0 0", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${item.height}%`,
                    background: "linear-gradient(180deg, #D68A45 0%, #5C3A22 100%)",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#4A4A4A", marginTop: "8px" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Category Breakdown Chips */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "20px" }}>
          <div style={{ background: "#F7F2EC", padding: "12px 14px", borderRadius: "10px", border: "1px solid #EDE3D4" }}>
            <span style={{ fontSize: "11px", color: "#6B6B6B" }}>Catalog Mailer Boxes</span>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B2B2B", marginTop: "2px" }}>68% of Total Volume</div>
          </div>
          <div style={{ background: "#F7F2EC", padding: "12px 14px", borderRadius: "10px", border: "1px solid #EDE3D4" }}>
            <span style={{ fontSize: "11px", color: "#6B6B6B" }}>Custom Box Builder</span>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B2B2B", marginTop: "2px" }}>24% of Total Volume</div>
          </div>
          <div style={{ background: "#F7F2EC", padding: "12px 14px", borderRadius: "10px", border: "1px solid #EDE3D4" }}>
            <span style={{ fontSize: "11px", color: "#6B6B6B" }}>Packing Tapes & Rolls</span>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B2B2B", marginTop: "2px" }}>8% of Total Volume</div>
          </div>
        </div>
      </div>
    </div>
  );
}
