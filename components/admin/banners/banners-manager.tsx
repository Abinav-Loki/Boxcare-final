"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ImageUploadField } from "@/components/admin/common/image-upload-field";
import {
  getAdminBannersAction,
  createAdminBannerAction,
  updateAdminBannerAction,
  deleteAdminBannerAction,
  toggleBannerActiveAction,
} from "@/app/actions/admin-banners";
import { useAdminConfirm } from "@/components/admin/common/admin-confirm-dialog";

export interface FormattedBanner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  location: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BANNER_LOCATIONS = [
  { id: "ALL", label: "All Placements" },
  { id: "HOME_HERO", label: "Home Hero Slider" },
  { id: "OFFER_STRIP", label: "Top Offer Strip" },
  { id: "CATEGORY_PROMO", label: "Category Banner" },
  { id: "POPUP", label: "Promo Popup / Modal" },
];

export function BannersManager() {
  const { confirmAction, ConfirmDialog } = useAdminConfirm();
  const [banners, setBanners] = useState<FormattedBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<FormattedBanner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<FormattedBanner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "/images/mailer-boxes.png",
    linkUrl: "/products",
    location: "HOME_HERO",
    sortOrder: 1,
    isActive: true,
  });

  const availableBannerImages = [
    { label: "Mailer Boxes Banner", url: "/images/mailer-boxes.png" },
    { label: "Corrugated Boxes Collection", url: "/images/corrugated-boxes.png" },
    { label: "Shipping Boxes Kraft", url: "/images/shipping-boxes.png" },
    { label: "Custom Printed Packaging", url: "/images/custom-printed-boxes.png" },
    { label: "Pizza Boxes Special", url: "/images/pizza-boxes.png" },
    { label: "Mono Cartons Retail", url: "/images/mono-cartons.png" },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminBannersAction();
      if (res.success && res.data) {
        setBanners(res.data as any);
      }
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const matchesSearch =
        !searchQuery ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.subtitle && b.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.linkUrl && b.linkUrl.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation = locationFilter === "ALL" || b.location === locationFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && b.isActive) ||
        (statusFilter === "INACTIVE" && !b.isActive);

      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [banners, searchQuery, locationFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "/images/mailer-boxes.png",
      linkUrl: "/products",
      location: locationFilter !== "ALL" ? locationFilter : "HOME_HERO",
      sortOrder: banners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: FormattedBanner) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || "",
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl || "",
      location: b.location,
      sortOrder: b.sortOrder,
      isActive: b.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string, current: boolean, title: string) => {
    confirmAction({
      title: `${current ? "Hide" : "Publish"} Banner: ${title}`,
      message: "Are you sure you want to do this?",
      description: `Change banner visibility to ${!current ? "Active" : "Hidden"}.`,
      defaultCommitPreview: !current ? "Banner published" : "Banner unpublished",
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        setBanners((prev) =>
          prev.map((b) => (b.id === id ? { ...b, isActive: !current } : b))
        );
        showToast(`Banner status updated to ${!current ? "Active 🟢" : "Hidden ⏸️"}`);

        const res = await toggleBannerActiveAction(id, !current, commitNote);
        if (!res.success) {
          showToast(`⚠️ Sync notice: ${res.error}`);
          loadBanners();
        }
      },
    });
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      showToast("⚠️ Title and Image URL are required");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || undefined,
      imageUrl: formData.imageUrl.trim(),
      linkUrl: formData.linkUrl.trim() || undefined,
      location: formData.location,
      sortOrder: Number(formData.sortOrder) || 1,
      isActive: Boolean(formData.isActive),
    };

    confirmAction({
      title: editingBanner ? `Update Banner: ${formData.title}` : `Create Banner: ${formData.title}`,
      message: "Are you sure you want to do this?",
      description: `Save banner settings for "${formData.title}" to the database.`,
      defaultCommitPreview: editingBanner ? "Banner updated" : "Banner created",
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        setIsSubmitting(true);
        try {
          if (editingBanner) {
            const res = await updateAdminBannerAction(editingBanner.id, payload, commitNote);
            if (res.success) {
              showToast(`✓ Updated banner "${formData.title}"`);
              loadBanners();
            } else {
              showToast(`⚠️ ${res.error || "Failed to update banner"}`);
            }
          } else {
            const res = await createAdminBannerAction(payload, commitNote);
            if (res.success) {
              showToast(`🎉 Created banner "${formData.title}"`);
              loadBanners();
            } else {
              showToast(`⚠️ ${res.error || "Failed to create banner"}`);
            }
          }
        } catch (err: any) {
          showToast(`⚠️ Error: ${err.message || "Failed to save banner"}`);
        } finally {
          setIsSubmitting(false);
          setIsModalOpen(false);
        }
      },
    });
  };

  const handleDeleteBanner = (b: FormattedBanner) => {
    confirmAction({
      title: `Delete Banner: ${b.title}`,
      message: "This action cannot be undone. Are you sure you want to delete this?",
      description: `Banner "${b.title}" will be permanently removed from the database.`,
      defaultCommitPreview: "Banner deleted",
      confirmLabel: "Continue to Verify",
      isDelete: true,
      onConfirm: async (commitNote?: string) => {
        setBanners((prev) => prev.filter((item) => item.id !== b.id));
        showToast(`🗑️ Deleting banner "${b.title}"...`);

        const res = await deleteAdminBannerAction(b.id, commitNote);
        if (res.success) {
          showToast(`🗑️ Removed banner "${b.title}"`);
          loadBanners();
        } else {
          showToast(`⚠️ ${res.error || "Failed to delete banner"}`);
          loadBanners();
        }
      },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "48px" }}>
      {/* 1. Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 700, color: "#8E8880" }}>
            <Link href="/admin/dashboard" style={{ color: "#8E8880", textDecoration: "none" }}>
              Admin
            </Link>
            <span>/</span>
            <span style={{ color: "#5C3A22" }}>Storefront Banners</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#2E1A0C", margin: 0, letterSpacing: "-0.02em" }}>
              Banners & Promotions
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
              {banners.length} Active Banners
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#6B6B6B", margin: "4px 0 0 0" }}>
            Control hero carousels, offer strips, category promotional spots, and modal announcements.
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
          <span>Add New Banner</span>
        </button>
      </div>

      {/* 2. Toast */}
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

      {/* 3. Controls & Filter Bar */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <span style={{ position: "absolute", left: "14px", top: "10px", color: "#8E8880", fontSize: "14px" }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search banners by title, subtitle, target URL..."
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
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
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
          {BANNER_LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.label}
            </option>
          ))}
        </select>

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
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">🟢 Active Only</option>
          <option value="INACTIVE">⏸️ Inactive / Hidden</option>
        </select>
      </div>

      {/* 4. Banner Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {filteredBanners.map((banner) => (
          <div
            key={banner.id}
            style={{
              background: "#FFFFFF",
              border: "1px solid #EDE3D4",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(46, 26, 12, 0.04)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s ease",
            }}
          >
            {/* Banner Preview Area */}
            <div
              style={{
                position: "relative",
                height: "160px",
                background: "#FAF7F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderBottom: "1px solid #EDE3D4",
              }}
            >
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ color: "#A89F91", fontSize: "12px", fontWeight: 600 }}>No Image Attached</div>
              )}

              {/* Location Badge */}
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  background: "rgba(46, 26, 12, 0.8)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(4px)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {banner.location}
              </span>

              {/* Status Badge */}
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: banner.isActive ? "#ECFDF5" : "#FEF2F2",
                  color: banner.isActive ? "#065F46" : "#991B1B",
                  border: `1px solid ${banner.isActive ? "#A7F3D0" : "#FECACA"}`,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                {banner.isActive ? "● Active" : "○ Hidden"}
              </span>
            </div>

            {/* Banner Info */}
            <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#2E1A0C" }}>
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6B6B6B", lineHeight: 1.4 }}>
                    {banner.subtitle}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "#8E8880" }}>
                <span>🎯 Target: <code style={{ color: "#5C3A22", background: "#FAF7F2", padding: "2px 6px", borderRadius: "4px" }}>{banner.linkUrl || "None"}</code></span>
                <span>•</span>
                <span>Order: <strong>#{banner.sortOrder}</strong></span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #F0EBE3" }}>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(banner)}
                  style={{
                    flex: 1,
                    padding: "7px 12px",
                    background: "#F7F2EC",
                    border: "1px solid #EDE3D4",
                    borderRadius: "8px",
                    color: "#5C3A22",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleActive(banner.id, banner.isActive, banner.title)}
                  style={{
                    padding: "7px 12px",
                    background: banner.isActive ? "#FEF3C7" : "#DCFCE7",
                    border: `1px solid ${banner.isActive ? "#FDE68A" : "#BBF7D0"}`,
                    borderRadius: "8px",
                    color: banner.isActive ? "#92400E" : "#166534",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {banner.isActive ? "Hide" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBanner(banner)}
                  style={{
                    padding: "7px 12px",
                    background: "#FEE2E2",
                    border: "1px solid #FECACA",
                    borderRadius: "8px",
                    color: "#DC2626",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
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
              maxWidth: "520px",
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
                {editingBanner ? "Edit Storefront Banner" : "Create New Banner"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "#8E8880" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBanner} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                  Banner Title <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bulk Packaging Mega Discount"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #D1C7BD",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                  Subtitle / Promo Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Save up to 25% on 500+ packs today"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #D1C7BD",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                    Placement Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1C7BD",
                      borderRadius: "8px",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="HOME_HERO">Home Hero Slider</option>
                    <option value="OFFER_STRIP">Top Offer Strip</option>
                    <option value="CATEGORY_PROMO">Category Promo</option>
                    <option value="POPUP">Promo Popup Modal</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1C7BD",
                      borderRadius: "8px",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#2E1A0C", marginBottom: "4px" }}>
                  Target Link URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /category/mailer-boxes or /products"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #D1C7BD",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Image selector */}
              <ImageUploadField
                label="Banner Artwork Image"
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                presetImages={availableBannerImages}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "9px 16px",
                    background: "#F0EBE3",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#5C3A22",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "9px 20px",
                    background: "#5C3A22",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  {isSubmitting ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
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
