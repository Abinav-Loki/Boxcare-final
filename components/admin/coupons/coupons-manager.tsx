"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AdminCoupon,
  CouponDiscountType,
  CouponStatus,
  INITIAL_COUPONS_DATA,
  INITIAL_OFFERS_DATA,
} from "./coupon-types";
import { CouponModalForm } from "./coupon-modal-form";
import { CouponDetailsDrawer } from "./coupon-details-drawer";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { OffersSection } from "./offers-section";
import {
  getAdminCouponsAction,
  createAdminCouponAction,
  updateAdminCouponAction,
  deleteAdminCouponAction,
  toggleCouponActiveAction,
} from "@/app/actions/admin-coupons";
import { useAdminConfirm } from "@/components/admin/common/admin-confirm-dialog";

function formatDateString(val: any): string {
  if (!val) return "";
  if (val instanceof Date) return val.toISOString().split("T")[0];
  return String(val);
}

export function CouponsManager() {
  const { confirmAction, ConfirmDialog } = useAdminConfirm();
  const [coupons, setCoupons] = useState<AdminCoupon[]>(INITIAL_COUPONS_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | CouponStatus>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | CouponDiscountType>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Drawers state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [viewingCoupon, setViewingCoupon] = useState<AdminCoupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<{ id: string; code: string } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminCouponsAction();
      if (res.success && res.data && res.data.length > 0) {
        const formatted: AdminCoupon[] = res.data.map((c: any) => {
          const validFrom = c.startDate
            ? (c.startDate instanceof Date ? c.startDate.toISOString().split("T")[0] : String(c.startDate).split("T")[0])
            : "2026-01-01";
          const validUntil = c.endDate
            ? (c.endDate instanceof Date ? c.endDate.toISOString().split("T")[0] : String(c.endDate).split("T")[0])
            : "2026-12-31";
          const createdAtStr = c.createdAt
            ? (c.createdAt instanceof Date ? c.createdAt.toISOString().split("T")[0] : String(c.createdAt).split("T")[0])
            : "2026-01-01";
          const usageCount = Number(c.usedCount ?? c.usageCount ?? 0);
          const usageLimit = c.usageLimit !== null && c.usageLimit !== undefined ? Number(c.usageLimit) : null;

          let status: CouponStatus = "ACTIVE";
          if (!c.isActive) {
            status = "INACTIVE";
          } else if (c.endDate && new Date(c.endDate).getTime() < Date.now()) {
            status = "EXPIRED";
          } else if (usageLimit !== null && usageCount >= usageLimit) {
            status = "USED_UP";
          }

          return {
            id: c.id,
            code: c.code,
            title: c.title || (c.code ? `${c.code} Discount Offer` : "Special Promo"),
            description:
              c.description ||
              (c.discountType === "PERCENTAGE"
                ? `${c.discountValue}% off packaging cartons & boxes`
                : `Flat ₹${c.discountValue} discount`),
            discountType: c.discountType as CouponDiscountType,
            discountValue: Number(c.discountValue) || 0,
            minOrderValue: c.minOrderRupees ?? (c.minOrderPaise ? Math.round(c.minOrderPaise / 100) : 0),
            maxDiscountCap: c.maxDiscountRupees ?? (c.maxDiscountPaise ? Math.round(c.maxDiscountPaise / 100) : undefined),
            usageCount,
            usageLimit,
            validFrom,
            validUntil,
            status,
            createdAt: createdAtStr,
            isFeatured: Boolean(c.isFeatured),
          };
        });
        setCoupons(formatted);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // 1. KPI Statistics Calculations
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.status === "ACTIVE").length;
    const expired = coupons.filter((c) => c.status === "EXPIRED").length;
    const inactive = coupons.filter((c) => c.status === "INACTIVE").length;
    const usedUp = coupons.filter((c) => c.status === "USED_UP").length;
    const totalRedemptions = coupons.reduce((acc, c) => acc + c.usageCount, 0);

    return { total, active, expired, inactive, usedUp, totalRedemptions };
  }, [coupons]);

  // 2. Filter & Search logic
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchesSearch =
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchesType = typeFilter === "ALL" || c.discountType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchQuery, statusFilter, typeFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage) || 1;
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCoupons.slice(start, start + itemsPerPage);
  }, [filteredCoupons, currentPage, itemsPerPage]);

  // 3. Handlers
  const handleSaveCoupon = (coupon: AdminCoupon) => {
    const payload = {
      code: coupon.code,
      discountType: coupon.discountType as any,
      discountValue: coupon.discountValue,
      minOrderRupees: coupon.minOrderValue,
      maxDiscountRupees: coupon.maxDiscountCap,
      startDate: coupon.validFrom ? new Date(coupon.validFrom) : null,
      endDate: coupon.validUntil ? new Date(coupon.validUntil) : null,
      usageLimit: coupon.usageLimit,
      isActive: coupon.status === "ACTIVE",
    };

    confirmAction({
      title: editingCoupon ? `Update Coupon: ${coupon.code}` : `Create Coupon: ${coupon.code}`,
      message: "Are you sure you want to do this?",
      description: `Save promo discount details for "${coupon.code}" to the database.`,
      defaultCommitPreview: editingCoupon ? "Coupon updated" : "Coupon created",
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        if (editingCoupon) {
          setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? coupon : c)));
          showToast(`✓ Coupon "${coupon.code}" updated successfully!`);
          const res = await updateAdminCouponAction(coupon.id, payload, commitNote);
          if (!res.success) {
            showToast(`⚠️ Sync notice: ${res.error}`);
            loadCoupons();
          }
        } else {
          setCoupons((prev) => [coupon, ...prev]);
          showToast(`🎉 Coupon "${coupon.code}" created successfully!`);
          const res = await createAdminCouponAction(payload, commitNote);
          if (!res.success) {
            showToast(`⚠️ Sync notice: ${res.error}`);
            loadCoupons();
          }
        }
        setEditingCoupon(null);
      },
    });
  };

  const handleToggleStatus = (id: string) => {
    const target = coupons.find((c) => c.id === id);
    if (!target) return;
    const newStatus: CouponStatus = target.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const newActive = newStatus === "ACTIVE";

    confirmAction({
      title: `${newActive ? "Activate" : "Deactivate"} Coupon: ${target.code}`,
      message: "Are you sure you want to do this?",
      description: `Change coupon "${target.code}" status to "${newStatus}" in the database.`,
      defaultCommitPreview: newActive ? "Coupon activated" : "Coupon deactivated",
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
        showToast(`Coupon "${target.code}" is now ${newStatus === "ACTIVE" ? "Enabled ▶️" : "Disabled ⏸️"}`);

        if (viewingCoupon && viewingCoupon.id === id) {
          setViewingCoupon((prev) => (prev ? { ...prev, status: newStatus } : null));
        }

        const res = await toggleCouponActiveAction(id, newActive, commitNote);
        if (!res.success) {
          showToast(`⚠️ Sync notice: ${res.error}`);
          loadCoupons();
        }
      },
    });
  };

  const handleDeleteCoupon = (target: { id: string; code: string }) => {
    confirmAction({
      title: `Delete Coupon: ${target.code}`,
      message: "This action cannot be undone. Are you sure you want to delete this?",
      description: `Coupon "${target.code}" will be permanently removed from the database.`,
      defaultCommitPreview: "Coupon deleted",
      confirmLabel: "Continue to Verify",
      isDelete: true,
      onConfirm: async (commitNote?: string) => {
        setCoupons((prev) => prev.filter((c) => c.id !== target.id));
        if (viewingCoupon && viewingCoupon.id === target.id) {
          setViewingCoupon(null);
        }
        setDeletingCoupon(null);
        showToast(`🗑️ Coupon "${target.code}" deleted.`);

        const res = await deleteAdminCouponAction(target.id, commitNote);
        if (!res.success) {
          showToast(`⚠️ Sync notice: ${res.error}`);
          loadCoupons();
        }
      },
    });
  };

  const handleExportCSV = () => {
    const headers = ["Coupon Code", "Title", "Discount Type", "Discount Value", "Usage Count", "Usage Limit", "Valid From", "Valid Until", "Status"];
    const rows = filteredCoupons.map((c) => [
      c.code,
      `"${c.title}"`,
      c.discountType,
      c.discountValue,
      c.usageCount,
      c.usageLimit ?? "Unlimited",
      c.validFrom,
      c.validUntil,
      c.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `boxcare_coupons_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📥 Exported coupons to CSV file!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "60px" }}>
      {/* 1. Header & Primary Add CTA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#2B2B2B", margin: 0, letterSpacing: "-0.02em" }}>
              Coupons & Offers
            </h1>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#F7F2EC", color: "#5C3A22", border: "1px solid #EDE3D4" }}>
              {coupons.length} Total Codes
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#6B6B6B", margin: "4px 0 0 0" }}>
            Create promotional discounts, manage bulk vouchers, configure usage quotas, and track redemption metrics.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleExportCSV}
            style={{
              padding: "9px 16px",
              background: "#FFFFFF",
              border: "1px solid #D1C7BD",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#5C3A22",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingCoupon(null);
              setIsFormOpen(true);
            }}
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
            <span>Add Coupon</span>
          </button>
        </div>
      </div>

      {/* 2. Toast Notification */}
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. KPI Statistics Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #EDE3D4",
            borderRadius: "14px",
            padding: "16px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#888" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Total Coupons</span>
            <span style={{ fontSize: "18px" }}>🎟️</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#2E1A0C", marginTop: "4px" }}>
            {stats.total}
          </div>
          <span style={{ fontSize: "11px", color: "#666" }}>All promo campaigns</span>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #EDE3D4",
            borderRadius: "14px",
            padding: "16px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#15803D" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Active Coupons</span>
            <span style={{ fontSize: "18px" }}>🟢</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#15803D", marginTop: "4px" }}>
            {stats.active}
          </div>
          <span style={{ fontSize: "11px", color: "#16A34A" }}>Live on storefront checkout</span>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #EDE3D4",
            borderRadius: "14px",
            padding: "16px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#DC2626" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Expired Coupons</span>
            <span style={{ fontSize: "18px" }}>🔴</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#DC2626", marginTop: "4px" }}>
            {stats.expired}
          </div>
          <span style={{ fontSize: "11px", color: "#888" }}>Past validity date</span>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #EDE3D4",
            borderRadius: "14px",
            padding: "16px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6B7280" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Inactive / Paused</span>
            <span style={{ fontSize: "18px" }}>⚪</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#4B5563", marginTop: "4px" }}>
            {stats.inactive + stats.usedUp}
          </div>
          <span style={{ fontSize: "11px", color: "#888" }}>{stats.usedUp} used up • {stats.inactive} paused</span>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #EDE3D4",
            borderRadius: "14px",
            padding: "16px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#D68A45" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Total Redemptions</span>
            <span style={{ fontSize: "18px" }}>⚡</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#D68A45", marginTop: "4px" }}>
            {(stats.totalRedemptions ?? 0).toLocaleString()}
          </div>
          <span style={{ fontSize: "11px", color: "#8B5E3C" }}>Customer orders saved</span>
        </div>
      </div>

      {/* 4. Promotional Offers Section */}
      <OffersSection offers={INITIAL_OFFERS_DATA} />

      {/* 5. Search & Multi-criteria Filter Toolbar */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EDE3D4",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: "0 1px 3px rgba(43,43,43,0.03)",
        }}
      >
        {/* Search by code or title */}
        <div style={{ width: "320px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search by coupon code, title, description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              padding: "8px 12px 8px 34px",
              borderRadius: "8px",
              border: "1px solid #D1C7BD",
              fontSize: "12px",
              outline: "none",
              color: "#2B2B2B",
            }}
          />
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: "12px" }}>
            🔍
          </span>
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#666" }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #D1C7BD",
                fontSize: "12px",
                fontWeight: 600,
                color: "#2E1A0C",
                background: "#FFFFFF",
                outline: "none",
              }}
            >
              <option value="ALL">All Statuses ({coupons.length})</option>
              <option value="ACTIVE">🟢 Active ({stats.active})</option>
              <option value="INACTIVE">⚪ Inactive ({stats.inactive})</option>
              <option value="EXPIRED">🔴 Expired ({stats.expired})</option>
              <option value="USED_UP">🟠 Used Up ({stats.usedUp})</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#666" }}>Discount Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #D1C7BD",
                fontSize: "12px",
                fontWeight: 600,
                color: "#2E1A0C",
                background: "#FFFFFF",
                outline: "none",
              }}
            >
              <option value="ALL">All Types</option>
              <option value="PERCENTAGE">% Percentage</option>
              <option value="FIXED_AMOUNT">₹ Flat Amount</option>
              <option value="FREE_SHIPPING">🚚 Free Shipping</option>
            </select>
          </div>

          {(searchQuery || statusFilter !== "ALL" || typeFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setTypeFilter("ALL");
                setCurrentPage(1);
              }}
              style={{
                padding: "6px 10px",
                background: "transparent",
                border: "none",
                color: "#8B5E3C",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 6. Coupons Data Table */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #EDE3D4",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #EDE3D4", color: "#5C3A22" }}>
                <th style={{ padding: "14px 18px", fontWeight: 800 }}>Coupon Code</th>
                <th style={{ padding: "14px 18px", fontWeight: 800 }}>Discount / Offer</th>
                <th style={{ padding: "14px 18px", fontWeight: 800 }}>Discount Type</th>
                <th style={{ padding: "14px 18px", fontWeight: 800 }}>Usage / Limit</th>
                <th style={{ padding: "14px 18px", fontWeight: 800 }}>Remaining</th>
                <th style={{ padding: "14px 18px", fontWeight: 800 }}>Validity Range</th>
                <th style={{ padding: "14px 18px", fontWeight: 800 }}>Status</th>
                <th style={{ padding: "14px 18px", fontWeight: 800, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px 24px", textAlign: "center", color: "#888" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🎟️</div>
                    <div style={{ fontWeight: 700, color: "#2E1A0C", fontSize: "15px" }}>No coupons found</div>
                    <p style={{ margin: "4px 0 16px 0", fontSize: "12px" }}>
                      Try adjusting your search criteria or create a new coupon code.
                    </p>
                    <button
                      onClick={() => {
                        setEditingCoupon(null);
                        setIsFormOpen(true);
                      }}
                      style={{
                        padding: "8px 16px",
                        background: "#5C3A22",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      + Create Coupon
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedCoupons.map((c) => {
                  const remaining = c.usageLimit === null ? "Unlimited" : Math.max(0, c.usageLimit - c.usageCount);
                  const isExpiringSoon =
                    new Date(c.validUntil).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 &&
                    new Date(c.validUntil).getTime() > Date.now();

                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: "1px solid #F0E8DE",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Column 1: Code & Copy */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontWeight: 900,
                              fontSize: "13px",
                              color: "#2E1A0C",
                              background: "#FAF7F2",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #EDE3D4",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {c.code}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(c.code);
                              showToast(`Copied "${c.code}" to clipboard!`);
                            }}
                            title="Copy Code"
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "13px",
                              padding: "2px",
                              opacity: 0.6,
                            }}
                          >
                            📋
                          </button>
                        </div>
                        <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                          Created: {formatDateString(c.createdAt)}
                        </div>
                      </td>

                      {/* Column 2: Title & Details */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 800, color: "#2E1A0C" }}>{c.title}</div>
                        <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>
                          Min order: ₹{(c.minOrderValue ?? 0).toLocaleString()}
                          {c.maxDiscountCap ? ` • Max cap: ₹${c.maxDiscountCap}` : ""}
                        </div>
                      </td>

                      {/* Column 3: Discount Type */}
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            color:
                              c.discountType === "PERCENTAGE"
                                ? "#8B4513"
                                : c.discountType === "FIXED_AMOUNT"
                                ? "#0369A1"
                                : "#15803D",
                          }}
                        >
                          {c.discountType === "PERCENTAGE"
                            ? `${c.discountValue}% OFF`
                            : c.discountType === "FIXED_AMOUNT"
                            ? `₹${c.discountValue} FLAT`
                            : "FREE SHIPPING"}
                        </span>
                        <div style={{ fontSize: "11px", color: "#888" }}>{c.discountType.replace("_", " ")}</div>
                      </td>

                      {/* Column 4: Usage Count / Limit */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 800, color: "#2E1A0C" }}>
                          {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : "uses"}
                        </div>
                        {c.usageLimit && (
                          <div style={{ width: "90px", height: "4px", background: "#EDE3D4", borderRadius: "2px", marginTop: "6px", overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${Math.min(100, (c.usageCount / c.usageLimit) * 100)}%`,
                                background: c.usageCount >= c.usageLimit ? "#DC2626" : "#D68A45",
                              }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Column 5: Remaining */}
                      <td style={{ padding: "14px 18px", fontWeight: 700, color: "#555" }}>
                        {remaining}
                      </td>

                      {/* Column 6: Validity Range */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontSize: "12px", color: "#2E1A0C", fontWeight: 600 }}>
                          {formatDateString(c.validFrom)} → {formatDateString(c.validUntil)}
                        </div>
                        {isExpiringSoon && (
                          <span style={{ fontSize: "10px", fontWeight: 800, color: "#DC2626", background: "#FEE2E2", padding: "1px 6px", borderRadius: "4px" }}>
                            ⚠️ Expiring Soon
                          </span>
                        )}
                      </td>

                      {/* Column 7: Status Badge */}
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            display: "inline-block",
                            background:
                              c.status === "ACTIVE"
                                ? "#DCFCE7"
                                : c.status === "EXPIRED"
                                ? "#FEE2E2"
                                : c.status === "USED_UP"
                                ? "#FFEDD5"
                                : "#F3F4F6",
                            color:
                              c.status === "ACTIVE"
                                ? "#15803D"
                                : c.status === "EXPIRED"
                                ? "#991B1B"
                                : c.status === "USED_UP"
                                ? "#C2410C"
                                : "#4B5563",
                          }}
                        >
                          {c.status === "ACTIVE"
                            ? "🟢 Active"
                            : c.status === "EXPIRED"
                            ? "🔴 Expired"
                            : c.status === "USED_UP"
                            ? "🟠 Used Up"
                            : "⚪ Inactive"}
                        </span>
                      </td>

                      {/* Column 8: Actions */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px" }}>
                          {/* View details */}
                          <button
                            onClick={() => setViewingCoupon(c)}
                            title="View Coupon Analytics"
                            style={{
                              padding: "5px 9px",
                              background: "#F4EDE4",
                              border: "1px solid #D6C7B2",
                              borderRadius: "6px",
                              color: "#5C3A22",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            👁️ View
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setEditingCoupon(c);
                              setIsFormOpen(true);
                            }}
                            title="Edit Coupon"
                            style={{
                              padding: "5px 9px",
                              background: "#FAF7F2",
                              border: "1px solid #D1C7BD",
                              borderRadius: "6px",
                              color: "#2E1A0C",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Edit
                          </button>

                          {/* Quick Enable/Disable toggle */}
                          <button
                            onClick={() => handleToggleStatus(c.id)}
                            title={c.status === "ACTIVE" ? "Disable Coupon" : "Enable Coupon"}
                            style={{
                              padding: "5px 8px",
                              background: c.status === "ACTIVE" ? "#FEF3C7" : "#DCFCE7",
                              border: `1px solid ${c.status === "ACTIVE" ? "#FCD34D" : "#86EFAC"}`,
                              borderRadius: "6px",
                              color: c.status === "ACTIVE" ? "#92400E" : "#166534",
                              fontSize: "11px",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            {c.status === "ACTIVE" ? "⏸️" : "▶️"}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteCoupon({ id: c.id, code: c.code })}
                            title="Delete Coupon"
                            style={{
                              padding: "5px 8px",
                              background: "#FEE2E2",
                              border: "1px solid #FCA5A5",
                              borderRadius: "6px",
                              color: "#991B1B",
                              fontSize: "11px",
                              cursor: "pointer",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {filteredCoupons.length > itemsPerPage && (
          <div
            style={{
              padding: "14px 18px",
              borderTop: "1px solid #EDE3D4",
              background: "#FAF7F2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
            <span style={{ color: "#666" }}>
              Showing {Math.min(filteredCoupons.length, (currentPage - 1) * itemsPerPage + 1)} to{" "}
              {Math.min(filteredCoupons.length, currentPage * itemsPerPage)} of {filteredCoupons.length} coupons
            </span>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                style={{
                  padding: "5px 12px",
                  background: "#FFFFFF",
                  border: "1px solid #D1C7BD",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    border: "1px solid #D1C7BD",
                    background: currentPage === i + 1 ? "#5C3A22" : "#FFFFFF",
                    color: currentPage === i + 1 ? "#FFFFFF" : "#2E1A0C",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                style={{
                  padding: "5px 12px",
                  background: "#FFFFFF",
                  border: "1px solid #D1C7BD",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. Modal Form (Add / Edit) */}
      <CouponModalForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCoupon(null);
        }}
        onSave={handleSaveCoupon}
        couponToEdit={editingCoupon}
      />

      {/* 8. Details Drawer (View) */}
      <CouponDetailsDrawer
        coupon={viewingCoupon}
        onClose={() => setViewingCoupon(null)}
        onEdit={(coupon) => {
          setEditingCoupon(coupon);
          setIsFormOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={(id, code) => handleDeleteCoupon({ id, code })}
      />

      {/* Global 2-Step Action & Password Confirmation Dialog */}
      {ConfirmDialog}
    </div>
  );
}
