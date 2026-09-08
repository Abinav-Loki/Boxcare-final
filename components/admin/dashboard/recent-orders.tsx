"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAdminDashboardMetricsAction } from "@/app/actions/admin-dashboard";

export function RecentOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAdminDashboardMetricsAction();
        if (res.success && res.data && res.data.recentOrders) {
          setOrders(res.data.recentOrders);
        }
      } catch (err) {
        console.error("Failed to load dashboard recent orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #EDE3D4",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(43,43,43,0.04)",
        marginBottom: "24px",
      }}
    >
      {/* Table Header */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #EDE3D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#2B2B2B", margin: 0 }}>
            Recent Orders
          </h2>
          <p style={{ fontSize: "11px", color: "#8E8880", margin: "2px 0 0 0" }}>
            Latest customer orders and fulfillment pipeline
          </p>
        </div>

        <Link
          href="/admin/orders"
          style={{ fontSize: "12px", fontWeight: 700, color: "#5C3A22", textDecoration: "none" }}
        >
          View All Orders →
        </Link>
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F7F2EC", borderBottom: "1px solid #EDE3D4", fontSize: "11px", fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase" }}>
              <th style={{ padding: "12px 20px" }}>Order</th>
              <th style={{ padding: "12px 20px" }}>Customer</th>
              <th style={{ padding: "12px 20px" }}>Item Details</th>
              <th style={{ padding: "12px 20px" }}>Total</th>
              <th style={{ padding: "12px 20px" }}>Payment</th>
              <th style={{ padding: "12px 20px" }}>Status</th>
              <th style={{ padding: "12px 20px", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "12px" }}>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "24px", textAlign: "center", color: "#8E8880" }}>
                  No recent orders in database.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: "1px solid #EDE3D4",
                    background: "#FFFFFF",
                  }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 700, color: "#5C3A22" }}>{order.orderNumber}</div>
                    <div style={{ fontSize: "10px", color: "#8E8880", marginTop: "2px" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 600, color: "#2B2B2B" }}>{order.customerName}</div>
                    <div style={{ fontSize: "11px", color: "#8E8880" }}>{order.customerEmail}</div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ color: "#2B2B2B", fontWeight: 500 }}>
                      {order.items?.[0]?.productName || "Packaging Order"}
                    </div>
                    <div style={{ fontSize: "10px", color: "#8E8880" }}>Qty: {order.itemsCount} pcs</div>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: 800, color: "#2B2B2B" }}>
                    ₹{(order.totalRupees ?? 0).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    {order.paymentStatus === "SUCCESS" ? (
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}>
                        ● Paid
                      </span>
                    ) : (
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}>
                        ● {order.paymentStatus}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "6px", background: "#FDF4EB", color: "#5C3A22", border: "1px solid #EDE3D4" }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <Link
                      href="/admin/orders"
                      style={{
                        padding: "4px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#5C3A22",
                        background: "#F7F2EC",
                        borderRadius: "6px",
                        border: "1px solid #EDE3D4",
                        textDecoration: "none",
                      }}
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
