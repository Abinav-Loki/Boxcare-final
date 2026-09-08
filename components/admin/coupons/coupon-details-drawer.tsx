"use client";

import React, { useState } from "react";
import { AdminCoupon } from "./coupon-types";

function formatDateString(val: any): string {
  if (!val) return "";
  if (val instanceof Date) return val.toISOString().split("T")[0];
  return String(val);
}

interface CouponDetailsDrawerProps {
  coupon: AdminCoupon | null;
  onClose: () => void;
  onEdit: (coupon: AdminCoupon) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string, code: string) => void;
}

export function CouponDetailsDrawer({
  coupon,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}: CouponDetailsDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!coupon) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const remainingUses = coupon.usageLimit === null ? "Unlimited" : Math.max(0, coupon.usageLimit - coupon.usageCount);
  const percentUsed = coupon.usageLimit ? Math.min(100, Math.round((coupon.usageCount / coupon.usageLimit) * 100)) : 100;

  // Calculate estimated customer savings generated
  const estimatedSavings =
    coupon.discountType === "PERCENTAGE"
      ? coupon.usageCount * 320
      : coupon.discountType === "FIXED_AMOUNT"
      ? coupon.usageCount * coupon.discountValue
      : coupon.usageCount * 150;

  // Mock recent redemptions log
  const mockRedemptions = [
    { orderId: "#ORD-9842", customer: "Apex Retailers Ltd.", orderTotal: "₹4,850", discount: "₹485", date: "Today, 2:15 PM" },
    { orderId: "#ORD-9810", customer: "GreenPack Organic D2C", orderTotal: "₹8,200", discount: "₹820", date: "Yesterday, 11:30 AM" },
    { orderId: "#ORD-9774", customer: "Kolkata Craft Emporium", orderTotal: "₹3,400", discount: "₹340", date: "Sep 04, 2026" },
    { orderId: "#ORD-9690", customer: "Mumbai Sweet Mart", orderTotal: "₹6,150", discount: "₹615", date: "Sep 02, 2026" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(20, 18, 16, 0.65)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          height: "100vh",
          background: "#FFFFFF",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #EDE3D4",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FAF7F2",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.4rem" }}>🎟️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#2E1A0C" }}>
                Coupon Details
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#888" }}>
                ID: {coupon.id} • Created {formatDateString(coupon.createdAt)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.3rem",
              color: "#777",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
          {/* Code Banner & Quick Copy */}
          <div
            style={{
              background: "linear-gradient(135deg, #FFF9F2 0%, #F5EDE2 100%)",
              border: "2px dashed #D68A45",
              borderRadius: "14px",
              padding: "18px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8B5E3C", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Active Promo Code
              </span>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2E1A0C", letterSpacing: "1.5px", marginTop: "2px" }}>
                {coupon.code}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#D68A45", marginTop: "4px" }}>
                {coupon.title}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              style={{
                padding: "8px 14px",
                background: copied ? "#15803D" : "#5C3A22",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
            >
              <span>{copied ? "✓ Copied!" : "📋 Copy"}</span>
            </button>
          </div>

          {/* Quick Stat Tiles Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "#FBF9F5", border: "1px solid #EDE3D4", borderRadius: "10px", padding: "12px 16px" }}>
              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}>Total Redemptions</span>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#2E1A0C", marginTop: "2px" }}>
                {(coupon.usageCount ?? 0).toLocaleString()}
              </div>
              <span style={{ fontSize: "0.75rem", color: "#15803D", fontWeight: 600 }}>
                {coupon.usageLimit ? `${percentUsed}% of quota` : "Unlimited tier"}
              </span>
            </div>

            <div style={{ background: "#FBF9F5", border: "1px solid #EDE3D4", borderRadius: "10px", padding: "12px 16px" }}>
              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}>Remaining Uses</span>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#D68A45", marginTop: "2px" }}>
                {remainingUses}
              </div>
              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}>
                Limit: {coupon.usageLimit ?? "No cap"}
              </span>
            </div>

            <div style={{ background: "#FBF9F5", border: "1px solid #EDE3D4", borderRadius: "10px", padding: "12px 16px" }}>
              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}>Discount Value</span>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#2E1A0C", marginTop: "2px" }}>
                {coupon.discountType === "PERCENTAGE"
                  ? `${coupon.discountValue}% OFF`
                  : coupon.discountType === "FIXED_AMOUNT"
                  ? `₹${coupon.discountValue} FLAT`
                  : "FREE SHIPPING"}
              </div>
              <span style={{ fontSize: "0.75rem", color: "#888" }}>
                {coupon.maxDiscountCap ? `Cap: ₹${coupon.maxDiscountCap}` : "No max cap"}
              </span>
            </div>

            <div style={{ background: "#FBF9F5", border: "1px solid #EDE3D4", borderRadius: "10px", padding: "12px 16px" }}>
              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}>Customer Savings</span>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#15803D", marginTop: "2px" }}>
                ₹{(estimatedSavings ?? 0).toLocaleString()}
              </div>
              <span style={{ fontSize: "0.75rem", color: "#888" }}>Generated to date</span>
            </div>
          </div>

          {/* Usage Quota Progress Bar */}
          {coupon.usageLimit && (
            <div style={{ background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "10px", padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>
                <span style={{ color: "#3D2E24" }}>Usage Quota Progress:</span>
                <span style={{ color: "#D68A45" }}>{coupon.usageCount} / {coupon.usageLimit} ({percentUsed}%)</span>
              </div>
              <div style={{ background: "#F0E8DE", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    background: percentUsed >= 90 ? "#DC2626" : percentUsed >= 60 ? "#D68A45" : "#15803D",
                    height: "100%",
                    width: `${percentUsed}%`,
                    transition: "width 0.4s",
                  }}
                />
              </div>
            </div>
          )}

          {/* Coupon Parameters Table */}
          <div style={{ background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "#FAF7F2", borderBottom: "1px solid #EDE3D4", fontWeight: 700, fontSize: "0.85rem", color: "#2E1A0C" }}>
              📋 Discount Rules & Conditions
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Discount Type:</span>
                <span style={{ fontWeight: 700, color: "#2E1A0C" }}>{coupon.discountType}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Minimum Order Value:</span>
                <span style={{ fontWeight: 700, color: "#2E1A0C" }}>₹{(coupon.minOrderValue ?? 0).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Valid Date Range:</span>
                <span style={{ fontWeight: 700, color: "#2E1A0C" }}>
                  {formatDateString(coupon.validFrom)} → {formatDateString(coupon.validUntil)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Current Status:</span>
                <span
                  style={{
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    background: coupon.status === "ACTIVE" ? "#DCFCE7" : coupon.status === "EXPIRED" ? "#FEE2E2" : "#F3F4F6",
                    color: coupon.status === "ACTIVE" ? "#15803D" : coupon.status === "EXPIRED" ? "#991B1B" : "#4B5563",
                  }}
                >
                  {coupon.status}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Redemptions Table */}
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#2E1A0C", marginBottom: "8px" }}>
              🛒 Recent Customer Redemptions
            </div>
            <div style={{ border: "1px solid #EDE3D4", borderRadius: "10px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #EDE3D4", color: "#666" }}>
                    <th style={{ padding: "8px 12px" }}>Order</th>
                    <th style={{ padding: "8px 12px" }}>Customer</th>
                    <th style={{ padding: "8px 12px" }}>Total</th>
                    <th style={{ padding: "8px 12px" }}>Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRedemptions.map((r, i) => (
                    <tr key={i} style={{ borderBottom: i !== mockRedemptions.length - 1 ? "1px solid #F0E8DE" : "none" }}>
                      <td style={{ padding: "8px 12px", fontWeight: 700, color: "#5C3A22" }}>{r.orderId}</td>
                      <td style={{ padding: "8px 12px", color: "#333" }}>{r.customer}</td>
                      <td style={{ padding: "8px 12px", color: "#666" }}>{r.orderTotal}</td>
                      <td style={{ padding: "8px 12px", fontWeight: 700, color: "#15803D" }}>{r.discount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #EDE3D4",
            background: "#FAF7F2",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() => onDelete(coupon.id, coupon.code)}
            style={{
              padding: "8px 14px",
              background: "#FEE2E2",
              border: "1px solid #FCA5A5",
              borderRadius: "8px",
              color: "#991B1B",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🗑️ Delete
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => onToggleStatus(coupon.id)}
              style={{
                padding: "8px 14px",
                background: "#FFFFFF",
                border: "1px solid #D1C7BD",
                borderRadius: "8px",
                color: "#5C3A22",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {coupon.status === "ACTIVE" ? "⏸️ Disable" : "▶️ Enable"}
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(coupon);
              }}
              style={{
                padding: "8px 16px",
                background: "#D68A45",
                border: "none",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "0.82rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(214, 138, 69, 0.3)",
              }}
            >
              ✏️ Edit Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
