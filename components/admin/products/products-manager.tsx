"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS, Product, CATEGORIES } from "@/lib/products-data";
import { ImageUploadField } from "@/components/admin/common/image-upload-field";
import {
  getAdminProductsAction,
  createAdminProductAction,
  updateAdminProductAction,
  deleteAdminProductAction,
  toggleProductStatusAction,
} from "@/app/actions/admin-products";
import { getAdminCategoriesAction } from "@/app/actions/admin-categories";

import { useAdminConfirm } from "@/components/admin/common/admin-confirm-dialog";

export function ProductsManager() {
  const { confirmAction, ConfirmDialog } = useAdminConfirm();
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string; slug: string }[]>(
    CATEGORIES.map((c) => ({ id: c.slug, name: c.name, slug: c.slug }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState<"ALL" | "IN_STOCK" | "OUT_OF_STOCK">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Add / Edit Modal
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    category: "Mailer Boxes",
    categorySlug: "mailer-boxes",
    size_inches: "6 inch X 4 inch X 2 inch",
    size_inches_short: "6x4x2",
    length_in: 6,
    width_in: 4,
    height_in: 2,
    description: "",
    image: "/images/box_4_4_1_5.png",
    price50: 250,
    price100: 470,
    price300: 1300,
    price500: 2450,
    availability: "In Stock",
    rating: 5.0,
    reviewsCount: 18,
    isPopular: false,
    offerBadge: "",
    offerDiscountPercent: 0,
    offerCouponCode: "",
  });

  const availableProductImages = [
    { label: "Mailer Box 4x4x1.5", url: "/images/box_4_4_1_5.png" },
    { label: "Corrugated Box Standard", url: "/images/corrugated-boxes.png" },
    { label: "Shipping Box Kraft", url: "/images/shipping-boxes.png" },
    { label: "Custom Printed Box", url: "/images/custom-printed-boxes.png" },
    { label: "Pizza Box Carton", url: "/images/pizza-boxes.png" },
    { label: "Mono Carton Retail", url: "/images/mono-cartons.png" },
    { label: "Courier Bag White", url: "/images/courier-bags.png" },
    { label: "Tape Roll Brown", url: "/images/tape-rolls.png" },
    { label: "Bubble Wrap Roll", url: "/images/bubble-wrap.png" },
    { label: "Corrugated Roll Flex", url: "/images/corrugated-rolls.png" },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getAdminProductsAction(),
        getAdminCategoriesAction(),
      ]);

      if (prodRes.success && prodRes.data && prodRes.data.length > 0) {
        setProductsList(prodRes.data as any);
      }
      if (catRes.success && catRes.data && catRes.data.length > 0) {
        setCategoriesList(catRes.data.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })));
      }
    } catch (err) {
      console.error("Failed to load products/categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.size_inches_short && p.size_inches_short.toLowerCase().includes(q));

      const matchesCategory =
        categoryFilter === "ALL" ||
        p.categorySlug === categoryFilter ||
        p.categoryId === categoryFilter ||
        (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());

      const isOut = p.availability === "Out of Stock";
      const matchesStock =
        stockFilter === "ALL" ||
        (stockFilter === "IN_STOCK" && !isOut) ||
        (stockFilter === "OUT_OF_STOCK" && isOut);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [productsList, searchQuery, categoryFilter, stockFilter]);

  // Open Modal for New Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      slug: "",
      category: categoriesList[0]?.name || "Mailer Boxes",
      categorySlug: categoriesList[0]?.slug || "mailer-boxes",
      size_inches: "6 inch X 4 inch X 2 inch",
      size_inches_short: "6x4x2",
      length_in: 6,
      width_in: 4,
      height_in: 2,
      description: "Premium corrugated box manufactured with high crush-resistance board.",
      image: "/images/box_4_4_1_5.png",
      price50: 250,
      price100: 470,
      price300: 1300,
      price500: 2450,
      availability: "In Stock",
      rating: 5.0,
      reviewsCount: 12,
      isPopular: false,
      offerBadge: "",
      offerDiscountPercent: 0,
      offerCouponCode: "",
    });
    setIsProductModalOpen(true);
  };

  // Open Modal for Edit Product
  const handleOpenEditProduct = (prod: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      category: prod.category || "Mailer Boxes",
      categorySlug: prod.categorySlug || "mailer-boxes",
      size_inches: prod.size_inches || "Standard Size",
      size_inches_short: prod.size_inches_short || "",
      length_in: prod.length_in || 0,
      width_in: prod.width_in || 0,
      height_in: prod.height_in || 0,
      description: prod.description || "",
      image: prod.image || "/images/box_4_4_1_5.png",
      price50: prod.prices?.["50"] || 250,
      price100: prod.prices?.["100"] || 470,
      price300: prod.prices?.["300"] || 1300,
      price500: prod.prices?.["500"] || 2450,
      availability: prod.availability || "In Stock",
      rating: prod.rating || 5.0,
      reviewsCount: prod.reviewsCount || 10,
      isPopular: !!prod.isPopular,
      offerBadge: prod.offerBadge || "",
      offerDiscountPercent: prod.offerDiscountPercent || 0,
      offerCouponCode: "",
    });
    setIsProductModalOpen(true);
  };

  // 1-Click Toggle Product Stock Status
  const handleToggleProductStock = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const product = productsList.find((p) => p.id === id);
    if (!product) return;

    const willBeInStock = product.availability === "Out of Stock";
    const newStatus = willBeInStock ? "In Stock" : "Out of Stock";
    const dbStatus = willBeInStock ? "ACTIVE" : "INACTIVE";

    confirmAction({
      title: "Toggle Product Stock Status",
      message: "Are you sure you want to do this?",
      description: `Change "${product.name}" availability to "${newStatus}".`,
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        // Optimistic UI update
        setProductsList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, availability: newStatus } : p))
        );

        // Persist via Server Action
        const res = await toggleProductStatusAction(id, dbStatus);
        if (!res.success) {
          showToast(`⚠️ Sync note: ${res.error}`);
          loadData();
        } else {
          showToast(`"${product.name}" is now ${newStatus === "In Stock" ? "In Stock 📦" : "Out of Stock 🛑"}`);
        }
      },
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const generatedSlug = productForm.slug.trim() ||
      productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const payload = {
      name: productForm.name.trim(),
      slug: generatedSlug,
      categoryId: productForm.categorySlug,
      description: productForm.description.trim(),
      status: (productForm.availability === "In Stock" ? "ACTIVE" : "INACTIVE") as "ACTIVE" | "INACTIVE",
      imageUrl: productForm.image,
      lengthIn: Number(productForm.length_in),
      widthIn: Number(productForm.width_in),
      heightIn: Number(productForm.height_in),
      material: "Corrugated Cardboard",
      price50: Number(productForm.price50),
      price100: Number(productForm.price100),
      price300: Number(productForm.price300),
      price500: Number(productForm.price500),
      stockQuantity: productForm.availability === "In Stock" ? 100 : 0,
      seoTitle: productForm.offerBadge
        ? `OFFER:${productForm.offerBadge}|${productForm.offerDiscountPercent || ""}|${productForm.offerCouponCode || ""}`
        : undefined,
    };

    confirmAction({
      title: editingProduct ? `Update Product: ${productForm.name}` : `Create Product: ${productForm.name}`,
      message: "Are you sure you want to do this?",
      description: `Commit SKU details for "${productForm.name}" to the database.`,
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          if (editingProduct) {
            const res = await updateAdminProductAction(editingProduct.id, payload);
            if (res.success && res.data) {
              showToast(`✓ Updated product "${productForm.name}" in database`);
              loadData();
            } else {
              showToast(`⚠️ ${res.error || "Failed to update product"}`);
            }
          } else {
            const res = await createAdminProductAction(payload);
            if (res.success && res.data) {
              showToast(`🎉 Created product SKU "${productForm.name}" in database`);
              loadData();
            } else {
              showToast(`⚠️ ${res.error || "Failed to create product"}`);
            }
          }
        } catch (err: any) {
          showToast(`⚠️ Error: ${err.message || "Failed to save product"}`);
        } finally {
          setIsSubmitting(false);
          setIsProductModalOpen(false);
        }
      },
    });
  };

  const handleDeleteProduct = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    confirmAction({
      title: `Delete Product: ${product.name}`,
      message: "This action cannot be undone. Are you sure you want to delete this?",
      description: `Product "${product.name}" will be removed or deactivated safely in the database.`,
      confirmLabel: "Continue to Verify",
      isDelete: true,
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          const res = await deleteAdminProductAction(product.id);
          if (res.success) {
            showToast(`✓ Removed product "${product.name}"`);
            loadData();
          } else {
            showToast(`⚠️ ${(res as any).error || "Failed to delete product"}`);
          }
        } catch (err: any) {
          showToast(`⚠️ Error: ${err.message || "Failed to delete"}`);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
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
            <span style={{ color: "#5C3A22" }}>Product Catalog</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#2E1A0C", margin: 0, letterSpacing: "-0.02em" }}>
              Products Management
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
              {productsList.length} SKUs in Catalog
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#6B6B6B", margin: "4px 0 0 0" }}>
            Manage box artwork images, custom upload photos, dimensions, volume tier pricing, and availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddProduct}
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
          <span>Add New Product</span>
        </button>
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

      {/* 3. Search & Filters Bar */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <span style={{ position: "absolute", left: "14px", top: "10px", color: "#8E8880", fontSize: "14px" }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search products by SKU name, dimensions, category, slug..."
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

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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
          <option value="ALL">All Packaging Categories</option>
          {categoriesList.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as any)}
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
          <option value="ALL">All Stock Status</option>
          <option value="IN_STOCK">📦 In Stock Only</option>
          <option value="OUT_OF_STOCK">🛑 Out of Stock Only</option>
        </select>

        {/* View Mode Toggle */}
        <div style={{ display: "flex", gap: "2px", background: "#EDE3D4", padding: "3px", borderRadius: "8px" }}>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: viewMode === "grid" ? "#FFFFFF" : "transparent",
              color: viewMode === "grid" ? "#5C3A22" : "#6B6B6B",
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: viewMode === "table" ? "#FFFFFF" : "transparent",
              color: viewMode === "table" ? "#5C3A22" : "#6B6B6B",
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            Table
          </button>
        </div>
      </div>

      {/* 4. Products Display Grid / Table */}
      {viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {filteredProducts.map((p) => {
            const isOut = p.availability === "Out of Stock";
            return (
              <div
                key={p.id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #EDE3D4",
                  borderRadius: "14px",
                  padding: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "10px",
                      background: "#F7F2EC",
                      border: "1px solid #EDE3D4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    />
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#D68A45", textTransform: "uppercase" }}>
                        {p.category}
                      </span>
                      {p.offerBadge && (
                        <span style={{ fontSize: "10px", fontWeight: 800, padding: "2px 6px", borderRadius: "5px", background: "linear-gradient(135deg, #DC2626, #EA580C)", color: "#FFFFFF" }}>
                          {p.offerBadge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "#2E1A0C", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#8E8880", marginTop: "2px" }}>
                      📐 {p.size_inches_short || p.size_inches}
                    </div>
                  </div>
                </div>

                {/* Price Tiers Summary */}
                <div style={{ background: "#FAF7F2", padding: "8px 10px", borderRadius: "8px", border: "1px solid #EDE3D4", display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                  <span style={{ color: "#6B6B6B" }}>50 pcs: <strong>₹{p.prices["50"] || "-"}</strong></span>
                  <span style={{ color: "#6B6B6B" }}>100 pcs: <strong>₹{p.prices["100"] || "-"}</strong></span>
                  <span style={{ color: "#5C3A22", fontWeight: 700 }}>500 pcs: ₹{p.prices["500"] || "-"}</span>
                </div>

                {/* Card Actions */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #F3EDE6" }}>
                  <button
                    type="button"
                    onClick={(e) => handleToggleProductStock(p.id, e)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: isOut ? "#FEE2E2" : "#ECFDF5",
                      border: isOut ? "1px solid #FECACA" : "1px solid #A7F3D0",
                      color: isOut ? "#DC2626" : "#065F46",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {isOut ? "🛑 Out of Stock" : "📦 In Stock"}
                  </button>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditProduct(p, e)}
                      style={{
                        padding: "4px 10px",
                        background: "#FFFFFF",
                        border: "1px solid #D1C7BD",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#5C3A22",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteProduct(p, e)}
                      style={{
                        padding: "4px 8px",
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#DC2626",
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div style={{ background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "14px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #EDE3D4", color: "#8E8880", fontWeight: 700, fontSize: "11px", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px" }}>Product</th>
                <th style={{ padding: "12px 16px" }}>Category</th>
                <th style={{ padding: "12px 16px" }}>Dimensions</th>
                <th style={{ padding: "12px 16px" }}>Price (50 / 500)</th>
                <th style={{ padding: "12px 16px" }}>Stock Status</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isOut = p.availability === "Out of Stock";
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F3EDE6" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={p.image} alt={p.name} style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "6px", border: "1px solid #EDE3D4" }} />
                        <div>
                          <div style={{ fontWeight: 800, color: "#2E1A0C" }}>{p.name}</div>
                          <code style={{ fontSize: "10px", color: "#8E8880" }}>{p.slug}</code>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#5C3A22", fontWeight: 600 }}>{p.category}</td>
                    <td style={{ padding: "12px 16px", color: "#6B6B6B" }}>{p.size_inches_short || p.size_inches}</td>
                    <td style={{ padding: "12px 16px", color: "#2E1A0C", fontWeight: 700 }}>
                      ₹{p.prices["50"]} / ₹{p.prices["500"]}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        type="button"
                        onClick={(e) => handleToggleProductStock(p.id, e)}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          background: isOut ? "#FEE2E2" : "#ECFDF5",
                          border: isOut ? "1px solid #FECACA" : "1px solid #A7F3D0",
                          color: isOut ? "#DC2626" : "#065F46",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {isOut ? "Out of Stock" : "In Stock"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditProduct(p, e)}
                          style={{ padding: "4px 8px", background: "#FFFFFF", border: "1px solid #D1C7BD", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: "#5C3A22", cursor: "pointer" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteProduct(p, e)}
                          style={{ padding: "4px 8px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: "#DC2626", cursor: "pointer" }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(30, 27, 24, 0.65)",
            backdropFilter: "blur(4px)",
            padding: "16px",
          }}
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "680px",
              maxHeight: "92vh",
              background: "#FFFFFF",
              border: "1px solid #EDE3D4",
              borderRadius: "18px",
              boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                background: "#FAF7F2",
                borderBottom: "1px solid #EDE3D4",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#2E1A0C" }}>
                  {editingProduct ? `Edit Product: "${editingProduct.name}"` : "Add New Box Product"}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6B6B6B" }}>
                  Configure box artwork image upload, dimensions, and tier pricing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                style={{
                  border: "none",
                  background: "#F0EBE3",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#5C3A22",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSaveProduct}
              style={{ padding: "20px 24px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Product Name & Slug */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Product Name <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 X 4 X 2 Inch Flap Mailer Box"
                    value={productForm.name}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    URL Slug <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mailer-box-6x4x2"
                    value={productForm.slug}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Category & Dimensions */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Category
                  </label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => {
                      const selCat = categoriesList.find((c) => c.slug === e.target.value);
                      setProductForm((prev) => ({
                        ...prev,
                        categorySlug: e.target.value,
                        category: selCat ? selCat.name : "Mailer Boxes",
                      }));
                    }}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", outline: "none" }}
                  >
                    {categoriesList.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Length (in)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={productForm.length_in}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, length_in: Number(e.target.value) }))}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Width (in)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={productForm.width_in}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, width_in: Number(e.target.value) }))}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Height (in)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={productForm.height_in}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, height_in: Number(e.target.value) }))}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD FIELD (Direct file upload / Library / URL) */}
              <div>
                <ImageUploadField
                  label="Product Box Artwork Image"
                  value={productForm.image}
                  onChange={(newUrl) => setProductForm((prev) => ({ ...prev, image: newUrl }))}
                  presetImages={availableProductImages}
                  helperText="Upload custom box artwork/photo (PNG/JPG) or select from catalog presets."
                />
              </div>

              {/* Promotional Offer & Discount Badge */}
              <div style={{ background: "#FAF7F2", border: "1px solid #EDE3D4", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 800, color: "#5C3A22", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span>🎁 Apply Product Promotional Offer & Discount</span>
                  </label>
                  {productForm.offerBadge && (
                    <span style={{ fontSize: "10px", fontWeight: 800, background: "linear-gradient(135deg, #DC2626, #EA580C)", color: "#FFFFFF", padding: "2px 8px", borderRadius: "6px" }}>
                      Active: {productForm.offerBadge}
                    </span>
                  )}
                </div>

                {/* Quick Presets */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                  {[
                    { badge: "⚡ 10% OFF", percent: 10 },
                    { badge: "🔥 15% OFF", percent: 15 },
                    { badge: "🎉 20% OFF", percent: 20 },
                    { badge: "🏷️ BUY 2 GET 1", percent: 33 },
                    { badge: "🚚 FREE SHIPPING", percent: 0 },
                    { badge: "⭐ BESTSELLER", percent: 0 },
                  ].map((preset) => (
                    <button
                      key={preset.badge}
                      type="button"
                      onClick={() => {
                        setProductForm((prev) => ({
                          ...prev,
                          offerBadge: preset.badge,
                          offerDiscountPercent: preset.percent,
                        }));
                      }}
                      style={{
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: 700,
                        borderRadius: "6px",
                        background: productForm.offerBadge === preset.badge ? "#5C3A22" : "#FFFFFF",
                        color: productForm.offerBadge === preset.badge ? "#FFFFFF" : "#5C3A22",
                        border: "1px solid #D1C7BD",
                        cursor: "pointer",
                      }}
                    >
                      {preset.badge}
                    </button>
                  ))}
                  {productForm.offerBadge && (
                    <button
                      type="button"
                      onClick={() => setProductForm((prev) => ({ ...prev, offerBadge: "", offerDiscountPercent: 0, offerCouponCode: "" }))}
                      style={{
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: 700,
                        borderRadius: "6px",
                        background: "#FEE2E2",
                        color: "#DC2626",
                        border: "1px solid #FECACA",
                        cursor: "pointer",
                      }}
                    >
                      ✕ Clear Offer
                    </button>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#6B6B6B", marginBottom: "3px" }}>
                      Offer Badge Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 🔥 15% OFF"
                      value={productForm.offerBadge}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, offerBadge: e.target.value }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "11px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#6B6B6B", marginBottom: "3px" }}>
                      Discount % (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      placeholder="e.g. 15"
                      value={productForm.offerDiscountPercent || ""}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, offerDiscountPercent: Number(e.target.value) || 0 }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "11px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#6B6B6B", marginBottom: "3px" }}>
                      Linked Coupon (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BOXCARE10"
                      value={productForm.offerCouponCode}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, offerCouponCode: e.target.value.toUpperCase() }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "11px", fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                {productForm.offerDiscountPercent > 0 && (
                  <div style={{ marginTop: "8px", fontSize: "10px", color: "#059669", fontWeight: 700 }}>
                    ✓ With {productForm.offerDiscountPercent}% discount applied: 50 pcs ≈ ₹{Math.round(productForm.price50 * (1 - productForm.offerDiscountPercent / 100))} | 500 pcs ≈ ₹{Math.round(productForm.price500 * (1 - productForm.offerDiscountPercent / 100))}
                  </div>
                )}
              </div>

              {/* Volume Price Tiers */}
              <div style={{ background: "#FAF7F2", padding: "12px", borderRadius: "10px", border: "1px solid #EDE3D4" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#5C3A22", display: "block", marginBottom: "8px" }}>
                  Volume Tier Pricing (₹ INR)
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
                  <div>
                    <label style={{ fontSize: "10px", color: "#6B6B6B" }}>50 pcs (₹)</label>
                    <input
                      type="number"
                      value={productForm.price50}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price50: Number(e.target.value) }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "#6B6B6B" }}>100 pcs (₹)</label>
                    <input
                      type="number"
                      value={productForm.price100}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price100: Number(e.target.value) }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "#6B6B6B" }}>300 pcs (₹)</label>
                    <input
                      type="number"
                      value={productForm.price300}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price300: Number(e.target.value) }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "#6B6B6B" }}>500 pcs (₹)</label>
                    <input
                      type="number"
                      value={productForm.price500}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price500: Number(e.target.value) }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              {/* Stock Status Selection */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Stock Availability
                  </label>
                  <select
                    value={productForm.availability}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, availability: e.target.value }))}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", outline: "none" }}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Made to Order">Made to Order</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", paddingTop: "18px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 700, color: "#2E1A0C" }}>
                    <input
                      type="checkbox"
                      checked={productForm.isPopular}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, isPopular: e.target.checked }))}
                      style={{ width: "16px", height: "16px", accentColor: "#5C3A22" }}
                    />
                    Featured / Popular Product
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Packaging material specs and customer notes..."
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", outline: "none", resize: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", paddingTop: "14px", borderTop: "1px solid #EDE3D4" }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  style={{ padding: "8px 16px", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "#4A4A4A", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", background: "#5C3A22", borderRadius: "8px", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", border: "none", cursor: "pointer", boxShadow: "0 2px 6px rgba(92, 58, 34, 0.25)" }}
                >
                  {editingProduct ? "Save Changes" : "Create Product SKU"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {/* Global 2-Step Action & Password Confirmation Dialog */}
      {ConfirmDialog}
    </div>
  );
}
