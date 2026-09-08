"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  getAdminShipmentsAction,
  createAdminShipmentAction,
  updateAdminShipmentAction,
  updateAdminShipmentStatusAction,
} from "@/app/actions/admin-shipments";
import { getAdminOrdersAction } from "@/app/actions/admin-orders";
import { ShipmentStatus } from "@/generated/prisma/client";
import { useAdminConfirm } from "@/components/admin/common/admin-confirm-dialog";

export interface FormattedShipment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  courierPartner: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  status: ShipmentStatus;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  notes: string | null;
  itemsCount: number;
  totalRupees: number;
  createdAt: Date;
  updatedAt: Date;
}

const COURIER_PARTNERS = [
  "Delhivery",
  "BlueDart",
  "DTDC",
  "Xpressbees",
  "Shadowfax",
  "Porter",
  "Blr Logistics / Local",
  "Self-Fulfillment",
];

export function ShipmentsManager() {
  const { confirmAction, ConfirmDialog } = useAdminConfirm();
  const [shipments, setShipments] = useState<FormattedShipment[]>([]);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ShipmentStatus>("ALL");
  const [courierFilter, setCourierFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<FormattedShipment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    orderId: "",
    courierPartner: "Delhivery",
    trackingNumber: "",
    trackingUrl: "",
    status: "SHIPPED" as ShipmentStatus,
    notes: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [shipRes, ordRes] = await Promise.all([
        getAdminShipmentsAction(),
        getAdminOrdersAction(),
      ]);

      if (shipRes.success && shipRes.data) {
        setShipments(shipRes.data as any);
      }
      if (ordRes.success && ordRes.data) {
        setAvailableOrders(ordRes.data as any);
      }
    } catch (err) {
      console.error("Failed to load shipments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter((s) => s.status === "SHIPPED" || s.status === "OUT_FOR_DELIVERY" || s.status === "PACKED").length;
    const delivered = shipments.filter((s) => s.status === "DELIVERED").length;
    const returned = shipments.filter((s) => s.status === "RETURNED").length;

    return { total, inTransit, delivered, returned };
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.orderNumber.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.customerPhone.includes(q) ||
        (s.trackingNumber && s.trackingNumber.toLowerCase().includes(q)) ||
        (s.courierPartner && s.courierPartner.toLowerCase().includes(q)) ||
        (s.shippingAddress && s.shippingAddress.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
      const matchesCourier = courierFilter === "ALL" || s.courierPartner === courierFilter;

      return matchesSearch && matchesStatus && matchesCourier;
    });
  }, [shipments, searchQuery, statusFilter, courierFilter]);

  const handleOpenAdd = () => {
    setEditingShipment(null);
    setFormData({
      orderId: availableOrders[0]?.id || "",
      courierPartner: "Delhivery",
      trackingNumber: "",
      trackingUrl: "",
      status: "SHIPPED",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: FormattedShipment) => {
    setEditingShipment(s);
    setFormData({
      orderId: s.orderId,
      courierPartner: s.courierPartner || "Delhivery",
      trackingNumber: s.trackingNumber || "",
      trackingUrl: s.trackingUrl || "",
      status: s.status,
      notes: s.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = (shipmentId: string, newStatus: ShipmentStatus, orderNumber?: string) => {
    const num = orderNumber || shipments.find((s) => s.id === shipmentId)?.orderNumber || shipmentId;

    confirmAction({
      title: `Update Shipment: Order #${num}`,
      message: "Are you sure you want to do this?",
      description: `Change shipment status of order #${num} to "${newStatus}".`,
      defaultCommitPreview: "Shipment status changed",
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        setShipments((prev) =>
          prev.map((s) => (s.id === shipmentId ? { ...s, status: newStatus } : s))
        );
        showToast(`Shipment updated to ${newStatus}`);

        const res = await updateAdminShipmentStatusAction(shipmentId, newStatus, commitNote);
        if (!res.success) {
          showToast(`⚠️ Sync notice: ${res.error}`);
          loadData();
        }
      },
    });
  };

  const handleSaveShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderId) {
      showToast("⚠️ Please select an Order");
      return;
    }

    const payload = {
      orderId: formData.orderId,
      courierPartner: formData.courierPartner,
      trackingNumber: formData.trackingNumber.trim() || null,
      trackingUrl: formData.trackingUrl.trim() || null,
      status: formData.status,
      notes: formData.notes.trim() || null,
    };

    confirmAction({
      title: editingShipment ? `Update Shipment: Order #${editingShipment.orderNumber}` : `Create Shipment Record`,
      message: "Are you sure you want to do this?",
      description: `Save courier tracking details to the database.`,
      defaultCommitPreview: editingShipment ? "Shipment updated" : "Shipment status changed",
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        setIsSubmitting(true);
        try {
          if (editingShipment) {
            const res = await updateAdminShipmentAction(editingShipment.id, payload, commitNote);
            if (res.success) {
              showToast("✓ Updated shipment details");
              loadData();
            } else {
              showToast(`⚠️ ${res.error || "Failed to update shipment"}`);
            }
          } else {
            const res = await createAdminShipmentAction(payload as any, commitNote);
            if (res.success) {
              showToast("🎉 Created shipment & synced with Order");
              loadData();
            } else {
              showToast(`⚠️ ${res.error || "Failed to create shipment"}`);
            }
          }
        } catch (err: any) {
          showToast(`⚠️ Error: ${err.message}`);
        } finally {
          setIsSubmitting(false);
          setIsModalOpen(false);
        }
      },
    });
  };

  const getShipmentBadge = (status: ShipmentStatus) => {
    const map: Record<ShipmentStatus, { bg: string; color: string; border: string }> = {
      NOT_SHIPPED: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
      PROCESSING: { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE" },
      PACKED: { bg: "#F3E8FF", color: "#6B21A8", border: "#E9D5FF" },
      SHIPPED: { bg: "#E0F2FE", color: "#0369A1", border: "#BAE6FD" },
      OUT_FOR_DELIVERY: { bg: "#EDE9FE", color: "#5B21B6", border: "#DDD6FE" },
      DELIVERED: { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
      RETURNED: { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
    };
    const s = map[status] || map.NOT_SHIPPED;
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
            <span style={{ color: "#5C3A22" }}>Logistics & Dispatch</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#2E1A0C", margin: 0, letterSpacing: "-0.02em" }}>
              Shipments & Tracking
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
              {shipments.length} Recorded Shipments
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#6B6B6B", margin: "4px 0 0 0" }}>
            Assign courier partners, record AWB numbers, track dispatch progress, and sync status to customer orders.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          style={{
            padding: "9px 18px",
            background: "#5C3A22",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(92, 58, 34, 0.25)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>+</span>
          <span>Create Shipment</span>
        </button>
      </div>

      {/* 2. KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
        {[
          { label: "Total Shipments", val: stats.total, color: "#2E1A0C" },
          { label: "Active In Transit", val: stats.inTransit, color: "#0284C7" },
          { label: "Successfully Delivered", val: stats.delivered, color: "#059669" },
          { label: "Returned / Cancelled", val: stats.returned, color: "#DC2626" },
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
            placeholder="Search by Order #, AWB Tracking #, Courier, Customer..."
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
          <option value="ALL">All Shipment Statuses</option>
          <option value="NOT_SHIPPED">Not Shipped</option>
          <option value="PROCESSING">Processing</option>
          <option value="PACKED">Packed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="RETURNED">Returned</option>
        </select>

        <select
          value={courierFilter}
          onChange={(e) => setCourierFilter(e.target.value)}
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
          <option value="ALL">All Courier Partners</option>
          {COURIER_PARTNERS.map((cp) => (
            <option key={cp} value={cp}>
              {cp}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Shipments Table */}
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
                <th style={{ padding: "12px 16px" }}>Order Info</th>
                <th style={{ padding: "12px 16px" }}>Customer & Destination</th>
                <th style={{ padding: "12px 16px" }}>Courier & Tracking #</th>
                <th style={{ padding: "12px 16px" }}>Shipment Status</th>
                <th style={{ padding: "12px 16px" }}>Timeline</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#8E8880" }}>
                    No shipments found. Click &ldquo;Create Shipment&rdquo; to dispatch an order.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #F0EBE3" }}>
                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 800, color: "#2E1A0C" }}>{s.orderNumber}</div>
                      <div style={{ fontSize: "11px", color: "#8E8880", marginTop: "2px" }}>
                        {s.itemsCount} pcs • ₹{s.totalRupees}
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, color: "#2E1A0C" }}>{s.customerName}</div>
                      <div style={{ fontSize: "12px", color: "#6B6B6B" }}>{s.customerPhone}</div>
                      <div style={{ fontSize: "11px", color: "#8E8880" }}>{s.shippingAddress}</div>
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, color: "#5C3A22" }}>{s.courierPartner || "Standard Shipping"}</div>
                      {s.trackingNumber ? (
                        <div style={{ fontSize: "12px", marginTop: "2px" }}>
                          {s.trackingUrl ? (
                            <a
                              href={s.trackingUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#0284C7", textDecoration: "underline", fontWeight: 600 }}
                            >
                              {s.trackingNumber} ↗
                            </a>
                          ) : (
                            <code style={{ background: "#F7F2EC", padding: "2px 6px", borderRadius: "4px" }}>
                              {s.trackingNumber}
                            </code>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: "11px", color: "#8E8880" }}>No AWB generated</div>
                      )}
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                      <select
                        value={s.status}
                        onChange={(e) => handleStatusChange(s.id, e.target.value as ShipmentStatus, s.orderNumber)}
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
                        <option value="NOT_SHIPPED">NOT SHIPPED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="RETURNED">RETURNED</option>
                      </select>
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top", fontSize: "11px", color: "#6B6B6B" }}>
                      {s.shippedAt && (
                        <div>
                          Shipped: <strong>{new Date(s.shippedAt).toLocaleDateString("en-IN")}</strong>
                        </div>
                      )}
                      {s.deliveredAt && (
                        <div style={{ color: "#059669" }}>
                          Delivered: <strong>{new Date(s.deliveredAt).toLocaleDateString("en-IN")}</strong>
                        </div>
                      )}
                      {!s.shippedAt && !s.deliveredAt && <div>Created: {new Date(s.createdAt).toLocaleDateString("en-IN")}</div>}
                    </td>

                    <td style={{ padding: "14px 16px", verticalAlign: "top", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
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
                        Edit ✏️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Create / Edit Shipment Modal */}
      {isModalOpen && (
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
              maxWidth: "500px",
              width: "100%",
              overflow: "hidden",
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
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#2E1A0C" }}>
                {editingShipment ? "Edit Shipment & Courier Details" : "Create New Shipment"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "#8E8880" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShipment} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                  Select Target Order <span style={{ color: "#DC2626" }}>*</span>
                </label>
                {editingShipment ? (
                  <input
                    type="text"
                    disabled
                    value={`Order #${editingShipment.orderNumber} (${editingShipment.customerName})`}
                    style={{ width: "100%", padding: "8px", background: "#FAF7F2", border: "1px solid #EDE3D4", borderRadius: "8px", fontSize: "12px", boxSizing: "border-box" }}
                  />
                ) : (
                  <select
                    required
                    value={formData.orderId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, orderId: e.target.value }))}
                    style={{ width: "100%", padding: "8px", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "12px" }}
                  >
                    <option value="">-- Choose Order --</option>
                    {availableOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} - {o.customerName} (₹{o.totalRupees})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                    Courier Partner
                  </label>
                  <select
                    value={formData.courierPartner}
                    onChange={(e) => setFormData((prev) => ({ ...prev, courierPartner: e.target.value }))}
                    style={{ width: "100%", padding: "8px", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "12px" }}
                  >
                    {COURIER_PARTNERS.map((cp) => (
                      <option key={cp} value={cp}>
                        {cp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                    Dispatch Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as ShipmentStatus }))}
                    style={{ width: "100%", padding: "8px", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "12px" }}
                  >
                    <option value="NOT_SHIPPED">NOT SHIPPED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="PACKED">PACKED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="RETURNED">RETURNED</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                  AWB Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. DEL1234567890"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, trackingNumber: e.target.value }))}
                  style={{ width: "100%", padding: "8px", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                  Tracking Link / Portal URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.delhivery.com/track/package/DEL1234567890"
                  value={formData.trackingUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, trackingUrl: e.target.value }))}
                  style={{ width: "100%", padding: "8px", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                  Delivery Notes / Dispatch Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dispatched via Express 2-day priority cargo"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  style={{ width: "100%", padding: "8px", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "8px 14px", background: "#F0EBE3", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, color: "#5C3A22", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: "8px 16px", background: "#5C3A22", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", cursor: "pointer" }}
                >
                  {isSubmitting ? "Saving..." : editingShipment ? "Update Shipment" : "Confirm Shipment"}
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
