"use client";

import React from "react";
import Link from "next/link";

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  itemsSummary: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: "SUCCESS" | "PENDING";
  fulfillmentStatus: "PROCESSING" | "SHIPPED" | "DELIVERED";
}

export function RecentOrdersTable() {
  const recentOrders: OrderItem[] = [
    {
      id: "ord-101",
      orderNumber: "#BX-1048",
      customerName: "Aakash Mehta",
      customerEmail: "aakash.m@crafts.in",
      date: "Today, 4:25 PM",
      itemsSummary: "Mailer Box 3.3x2.75x1",
      quantity: 500,
      totalAmount: 4850,
      paymentStatus: "SUCCESS",
      fulfillmentStatus: "PROCESSING",
    },
    {
      id: "ord-102",
      orderNumber: "#BX-1047",
      customerName: "Priya Sharma",
      customerEmail: "priya@organickit.com",
      date: "Today, 2:10 PM",
      itemsSummary: "Custom 3-Ply Box (8x6x4)",
      quantity: 300,
      totalAmount: 7620,
      paymentStatus: "SUCCESS",
      fulfillmentStatus: "SHIPPED",
    },
    {
      id: "ord-103",
      orderNumber: "#BX-1046",
      customerName: "Vikram Malhotra",
      customerEmail: "vikram@malhotratech.com",
      date: "Today, 11:45 AM",
      itemsSummary: "Shipping Box 10x8x6",
      quantity: 100,
      totalAmount: 2450,
      paymentStatus: "PENDING",
      fulfillmentStatus: "PROCESSING",
    },
    {
      id: "ord-104",
      orderNumber: "#BX-1045",
      customerName: "Sneha Patel",
      customerEmail: "sneha.couture@gmail.com",
      date: "Yesterday",
      itemsSummary: "Premium White Mailer Box",
      quantity: 500,
      totalAmount: 6900,
      paymentStatus: "SUCCESS",
      fulfillmentStatus: "DELIVERED",
    },
  ];

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
            {recentOrders.map((order, i) => (
              <tr
                key={order.id}
                style={{
                  borderBottom: i === recentOrders.length - 1 ? "none" : "1px solid #EDE3D4",
                  background: "#FFFFFF",
                }}
              >
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#5C3A22" }}>{order.orderNumber}</div>
                  <div style={{ fontSize: "10px", color: "#8E8880", marginTop: "2px" }}>{order.date}</div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ fontWeight: 600, color: "#2B2B2B" }}>{order.customerName}</div>
                  <div style={{ fontSize: "11px", color: "#8E8880" }}>{order.customerEmail}</div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ color: "#2B2B2B", fontWeight: 500 }}>{order.itemsSummary}</div>
                  <div style={{ fontSize: "10px", color: "#8E8880" }}>Qty: {order.quantity} pcs</div>
                </td>
                <td style={{ padding: "14px 20px", fontWeight: 800, color: "#2B2B2B" }}>
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  {order.paymentStatus === "SUCCESS" ? (
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}>
                      ● Paid
                    </span>
                  ) : (
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}>
                      ● Pending
                    </span>
                  )}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  {order.fulfillmentStatus === "DELIVERED" && (
                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "6px", background: "#F7F2EC", color: "#4A4A4A" }}>
                      Delivered
                    </span>
                  )}
                  {order.fulfillmentStatus === "SHIPPED" && (
                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "6px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>
                      Shipped
                    </span>
                  )}
                  {order.fulfillmentStatus === "PROCESSING" && (
                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "6px", background: "#FDF4EB", color: "#5C3A22", border: "1px solid #EDE3D4" }}>
                      Processing
                    </span>
                  )}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
