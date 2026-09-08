"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  getAdminOrdersAction,
  updateOrderStatusAction,
  overrideOrderPaymentStatusAction,
} from "@/app/actions/admin-orders";
import { OrderStatus, PaymentStatus, ShipmentStatus } from "@/generated/prisma/client";
import { useAdminConfirm } from "@/components/admin/common/admin-confirm-dialog";

export interface FormattedOrderItem {
  id: string;
  productName: string;
  sku: string | null;
  material: string | null;
  packQuantity: number | null;
  unitPriceRupees: number;
  quantity: number;
  totalPriceRupees: number;
}

export interface FormattedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  subtotalRupees: number;
  discountRupees: number;
  shippingFeeRupees: number;
  taxRupees: number;
  totalRupees: number;
  couponCode: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shipmentStatus: ShipmentStatus;
  itemsCount: number;
  createdAt: Date;
  updatedAt: Date;
  items: FormattedOrderItem[];
  paymentTrackingId: string | null;
  courierPartner: string | null;
  trackingNumber: string | null;
}

export function OrdersManager() {
  const { confirmAction, ConfirmDialog } = useAdminConfirm();
  const [orders, setOrders] = useState<FormattedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<"ALL" | PaymentStatus>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Order for Details View
  const [viewingOrder, setViewingOrder] = useState<FormattedOrder | null>(null);

  // Payment Override Modal State
  const [overrideOrder, setOverrideOrder] = useState<FormattedOrder | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<PaymentStatus>("SUCCESS");
  const [overrideReason, setOverrideReason] = useState("");
  const [isOverriding, setIsOverriding] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminOrdersAction();
      if (res.success && res.data) {
        setOrders(res.data as any);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "PENDING_PAYMENT" || o.status === "PROCESSING").length;
    const packed = orders.filter((o) => o.status === "PACKED").length;
    const shipped = orders.filter((o) => o.status === "SHIPPED").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const revenue = orders
      .filter((o) => o.paymentStatus === "SUCCESS")
      .reduce((acc, o) => acc + o.totalRupees, 0);

    return { total, pending, packed, shipped, delivered, revenue };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.shippingAddress && o.shippingAddress.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      const matchesPayment = paymentFilter === "ALL" || o.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus, orderNumber?: string) => {
    const num = orderNumber || orders.find((o) => o.id === orderId)?.orderNumber || orderId;

    confirmAction({
      title: `Update Status: Order #${num}`,
      message: "Are you sure you want to do this?",
      description: `Change fulfillment status of order #${num} to "${newStatus}".`,
      defaultCommitPreview: "Order status changed",
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (viewingOrder && viewingOrder.id === orderId) {
          setViewingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(`Order status updated to ${newStatus}`);

        const res = await updateOrderStatusAction(orderId, newStatus, commitNote);
        if (!res.success) {
          showToast(`⚠️ Sync notice: ${res.error}`);
          loadOrders();
        }
      },
    });
  };

  const handlePaymentOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideOrder) return;
    if (!overrideReason.trim() || overrideReason.trim().length < 5) {
      showToast("⚠️ Audit reason must be at least 5 characters");
      return;
    }

    const orderId = overrideOrder.id;
    const orderNumber = overrideOrder.orderNumber;
    const targetStatus = overrideStatus;
    const reason = overrideReason.trim();

    confirmAction({
      title: `Override Payment: Order #${orderNumber}`,
      message: "Are you sure you want to do this?",
      description: `Manually set payment status to "${targetStatus}" with reason: "${reason}".`,
      defaultCommitPreview: `Payment override to ${targetStatus}: ${reason}`,
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        setIsOverriding(true);
        try {
          const res = await overrideOrderPaymentStatusAction(orderId, {
            paymentStatus: targetStatus,
            overrideReason: reason,
          }, commitNote);
          if (res.success) {
            showToast(`✓ Payment status overridden to ${targetStatus} with audit log`);
            setOverrideOrder(null);
            setOverrideReason("");
            loadOrders();
          } else {
            showToast(`⚠️ ${res.error || "Failed to override payment status"}`);
          }
        } catch (err: any) {
          showToast(`⚠️ Error: ${err.message}`);
        } finally {
          setIsOverriding(false);
        }
      },
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const map: Record<OrderStatus, { bg: string; color: string; border: string }> = {
      PENDING_PAYMENT: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
      PAYMENT_FAILED: { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
      PAYMENT_CONFIRMED: { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
      PROCESSING: { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE" },
      PACKED: { bg: "#F3E8FF", color: "#6B21A8", border: "#E9D5FF" },
      SHIPPED: { bg: "#E0F2FE", color: "#0369A1", border: "#BAE6FD" },
      OUT_FOR_DELIVERY: { bg: "#EDE9FE", color: "#5B21B6", border: "#DDD6FE" },
      DELIVERED: { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
      CANCELLED: { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
      RETURNED: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
      REFUNDED: { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" },
    };
    const s = map[status] || map.PROCESSING;
    return (
      <span
        style={{
          background: s.bg,
          color: s.color,
          border: `1px solid ${s.border}`,
          padding: "3px 8px",
          borderRadius: "6px",
          fontSize: "11px",
          fontWeight: 700,
        }}
      >
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    const map: Record<PaymentStatus, { bg: string; color: string; border: string }> = {
      SUCCESS: { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
      PENDING: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
      FAILED: { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
      CANCELLED: { bg: "#F3F4F6", color: "#4B5563", border: "#E5E7EB" },
      REFUNDED: { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" },
    };
    const s = map[status] || map.PENDING;
    return (
      <span
        style={{
          background: s.bg,
          color: s.color,
          border: `1px solid ${s.border}`,
          padding: "3px 8px",
          borderRadius: "6px",
          fontSize: "11px",
          fontWeight: 700,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "48px" }}>
      {/* 1. Header & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 700, color: "#8E8880" }}>
            <Link href="/admin/dashboard" style={{ color: "#8E8880", textDecoration: "none" }}>
              Admin
            </Link>
            <span>/</span>
            <span style={{ color: "#5C3A22" }}>Orders Pipeline</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#2E1A0C", margin: 0, letterSpacing: "-0.02em" }}>
              Orders Management
            </h1>
            <span
              style={{
                background: "#FAF7F2",
                color: "#5C3A22",
                border: "1px solid #D1C7BD",
                fontSize: "12px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "12px",
              }}
            >
              {orders.length} Total Orders
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#6B6B6B", margin: "4px 0 0 0" }}>
            View customer purchases, packaging configurations, immutable price snapshots, and fulfillment status.
          </p>
        </div>

        <Link
          href="/admin/shipments"
          style={{
            padding: "9px 18px",
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
          <span>🚚</span>
          <span>Open Shipments Hub</span>
        </Link>
      </div>

      {/* 2. KPI Metrics Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
        {[
          { label: "Total Orders", val: stats.total, color: "#2E1A0C" },
          { label: "Processing / Pending", val: stats.pending, color: "#D97706" },
          { label: "Packed & Ready", val: stats.packed, color: "#7C3AED" },
          { label: "Dispatched (In Transit)", val: stats.shipped, color: "#0284C7" },
          { label: "Delivered", val: stats.delivered, color: "#059669" },
          { label: "Confirmed Revenue", val: `₹${(stats.revenue ?? 0).toLocaleString("en-IN")}`, color: "#166534" },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              background: "#FFFFFF",
              border: "1px solid #EDE3D4",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase" }}>{k.label}</div>
            <div style={{ fontSize: "20px", fontWeight: 900, color: k.color, marginTop: "4px" }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* 3. Toast */}
      {toastMessage && (
        <div
          style={{
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            padding: "12px 18px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* 4. Controls & Filters */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <span style={{ position: "absolute", left: "14px", top: "10px", color: "#8E8880", fontSize: "14px" }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by Order #, customer name, phone, email, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              background: "#FFFFFF",
              border: "1px solid #D1C7BD",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#2E1A0C",
              boxSizing: "border-box",
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{
            padding: "10px 14px",
            background: "#FFFFFF",
            border: "1px solid #D1C7BD",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#2E1A0C",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <option value="ALL">All Fulfillment Statuses</option>
          <option value="PENDING_PAYMENT">Pending Payment</option>
          <option value="PROCESSING">Processing</option>
          <option value="PACKED">Packed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as any)}
          style={{
            padding: "10px 14px",
            background: "#FFFFFF",
            border: "1px solid #D1C7BD",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#2E1A0C",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="SUCCESS">Payment Success</option>
          <option value="PENDING">Payment Pending</option>
          <option value="FAILED">Payment Failed</option>
          <option value="REFUNDED">Payment Refunded</option>
        </select>
      </div>

      {/* 5. Orders Table */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #EDE3D4",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #EDE3D4", color: "#5C3A22", fontWeight: 700 }}>
                <th style={{ padding: "12px 16px" }}>Order Number</th>
                <th style={{ padding: "12px 16px" }}>Customer Details</th>
                <th style={{ padding: "12px 16px" }}>Items</th>
                <th style={{ padding: "12px 16px" }}>Total Amount</th>
                <th style={{ padding: "12px 16px" }}>Payment</th>
                <th style={{ padding: "12px 16px" }}>Fulfillment Status</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "#8E8880" }}>
                    No orders matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid #F0EBE3", transition: "background 0.15s ease" }}
                  >
                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 800, color: "#2E1A0C" }}>{order.orderNumber}</div>
                      <div style={{ fontSize: "11px", color: "#8E8880", marginTop: "2px" }}>
                        {new Date(order.createdAt || Date.now()).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, color: "#2E1A0C" }}>{order.customerName}</div>
                      <div style={{ fontSize: "12px", color: "#6B6B6B" }}>{order.customerPhone}</div>
                      <div style={{ fontSize: "11px", color: "#8E8880" }}>{order.shippingAddress || order.customerEmail}</div>
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <span style={{ fontWeight: 700, color: "#5C3A22" }}>{order.itemsCount} pcs</span>
                      <div style={{ fontSize: "11px", color: "#8E8880" }}>{order.items.length} line item(s)</div>
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 900, color: "#166534", fontSize: "14px" }}>
                        ₹{(order.totalRupees ?? 0).toLocaleString("en-IN")}
                      </div>
                      {order.discountRupees > 0 && (
                        <div style={{ fontSize: "11px", color: "#059669" }}>
                          -₹{order.discountRupees} off ({order.couponCode || "promo"})
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                        {getPaymentBadge(order.paymentStatus)}
                        <button
                          type="button"
                          onClick={() => {
                            setOverrideOrder(order);
                            setOverrideStatus(order.paymentStatus === "SUCCESS" ? "REFUNDED" : "SUCCESS");
                          }}
                          style={{
                            fontSize: "10px",
                            color: "#5C3A22",
                            textDecoration: "underline",
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                          }}
                        >
                          Override ⚙️
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus, order.orderNumber)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          border: "1px solid #D1C7BD",
                          background: "#FFFFFF",
                          cursor: "pointer",
                          color: "#2E1A0C",
                        }}
                      >
                        <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => setViewingOrder(order)}
                        style={{
                          padding: "6px 12px",
                          background: "#F7F2EC",
                          border: "1px solid #EDE3D4",
                          borderRadius: "6px",
                          color: "#5C3A22",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Details 👁️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Order Detail Modal / Drawer */}
      {viewingOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #EDE3D4",
                background: "#FAF7F2",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#2E1A0C" }}>
                  Order #{viewingOrder.orderNumber}
                </h2>
                <span style={{ fontSize: "11px", color: "#8E8880" }}>
                  Placed on {new Date(viewingOrder.createdAt || Date.now()).toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "#8E8880" }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Customer & Shipping summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "#FAF7F2", padding: "14px", borderRadius: "10px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase" }}>Customer Information</div>
                  <div style={{ fontWeight: 700, color: "#2E1A0C", marginTop: "4px" }}>{viewingOrder.customerName}</div>
                  <div style={{ fontSize: "12px", color: "#5C3A22" }}>{viewingOrder.customerPhone}</div>
                  <div style={{ fontSize: "12px", color: "#6B6B6B" }}>{viewingOrder.customerEmail}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase" }}>Shipping Address</div>
                  <div style={{ fontSize: "12px", color: "#2E1A0C", marginTop: "4px", lineHeight: 1.4 }}>
                    {viewingOrder.shippingAddress || "Not specified"}
                  </div>
                </div>
              </div>

              {/* Immutable Line Items Snapshot */}
              <div>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: 800, color: "#2E1A0C" }}>
                  📦 Historical Line Items (Immutable Snapshot)
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "#F7F2EC", color: "#5C3A22", fontWeight: 700, textAlign: "left" }}>
                      <th style={{ padding: "8px 10px" }}>Item Description</th>
                      <th style={{ padding: "8px 10px" }}>Material / Pack</th>
                      <th style={{ padding: "8px 10px" }}>Unit Price</th>
                      <th style={{ padding: "8px 10px" }}>Quantity</th>
                      <th style={{ padding: "8px 10px", textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingOrder.items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #F0EBE3" }}>
                        <td style={{ padding: "10px" }}>
                          <div style={{ fontWeight: 700, color: "#2E1A0C" }}>{item.productName}</div>
                          {item.sku && <div style={{ fontSize: "10px", color: "#8E8880" }}>SKU: {item.sku}</div>}
                        </td>
                        <td style={{ padding: "10px", color: "#6B6B6B" }}>
                          {item.material || "Corrugated"} {item.packQuantity ? `(${item.packQuantity} pack)` : ""}
                        </td>
                        <td style={{ padding: "10px", color: "#2E1A0C" }}>₹{item.unitPriceRupees}</td>
                        <td style={{ padding: "10px", fontWeight: 700 }}>{item.quantity}</td>
                        <td style={{ padding: "10px", textAlign: "right", fontWeight: 800, color: "#166534" }}>
                          ₹{item.totalPriceRupees}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Breakdown */}
              <div style={{ marginLeft: "auto", width: "240px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#6B6B6B" }}>
                  <span>Subtotal:</span>
                  <span>₹{viewingOrder.subtotalRupees}</span>
                </div>
                {viewingOrder.discountRupees > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#059669" }}>
                    <span>Discount:</span>
                    <span>-₹{viewingOrder.discountRupees}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", color: "#6B6B6B" }}>
                  <span>Tax (GST):</span>
                  <span>₹{viewingOrder.taxRupees}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#6B6B6B" }}>
                  <span>Shipping Fee:</span>
                  <span>₹{viewingOrder.shippingFeeRupees}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "15px", color: "#2E1A0C", borderTop: "1px solid #EDE3D4", paddingTop: "6px" }}>
                  <span>Total Paid:</span>
                  <span style={{ color: "#166534" }}>₹{viewingOrder.totalRupees}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Controlled Payment Override Modal */}
      {overrideOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "460px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 800, color: "#2E1A0C" }}>
              Controlled Payment Override ⚙️
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#6B6B6B", lineHeight: 1.4 }}>
              Payment status should normally sync through CCavenue webhooks. Manual admin overrides require an explicit audit explanation.
            </p>

            <form onSubmit={handlePaymentOverride} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#8E8880", marginBottom: "4px" }}>
                  Target Order
                </label>
                <input
                  type="text"
                  disabled
                  value={`${overrideOrder.orderNumber} (₹${overrideOrder.totalRupees})`}
                  style={{ width: "100%", padding: "8px", background: "#FAF7F2", border: "1px solid #EDE3D4", borderRadius: "8px", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                  New Payment Status
                </label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as PaymentStatus)}
                  style={{ width: "100%", padding: "8px", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "12px" }}
                >
                  <option value="SUCCESS">SUCCESS (Verified Bank Transfer / Direct Wire)</option>
                  <option value="PENDING">PENDING (Awaiting Gateway Confirmation)</option>
                  <option value="FAILED">FAILED (Transaction Aborted)</option>
                  <option value="REFUNDED">REFUNDED (Processed Refund)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                  Audit Reason / Proof Reference <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Bank wire transfer received on ICICI account ref #TXN123456"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  style={{ width: "100%", padding: "8px", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setOverrideOrder(null)}
                  style={{ padding: "8px 14px", background: "#F0EBE3", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, color: "#5C3A22", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOverriding}
                  style={{ padding: "8px 16px", background: "#5C3A22", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", cursor: "pointer" }}
                >
                  {isOverriding ? "Processing..." : "Confirm Override"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global 2-Step Action & Password Confirmation Dialog */}
      {ConfirmDialog}
    </div>
  );
}
