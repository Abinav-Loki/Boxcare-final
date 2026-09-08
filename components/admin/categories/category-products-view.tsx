"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AdminCategory } from "./category-types";
import { PRODUCTS, Product, getUnitPrice } from "@/lib/products-data";
import { ImageUploadField } from "@/components/admin/common/image-upload-field";
import {
  getAdminProductsAction,
  createAdminProductAction,
  updateAdminProductAction,
  deleteAdminProductAction,
  toggleProductStatusAction,
} from "@/app/actions/admin-products";
import { deleteAdminCategoryAction } from "@/app/actions/admin-categories";

import { useAdminConfirm } from "@/components/admin/common/admin-confirm-dialog";

interface CategoryProductsViewProps {
  category: AdminCategory;
  onBack: () => void;
  onDeleteCategory?: (id: string, name: string) => void;
}

export function CategoryProductsView({ category, onBack, onDeleteCategory }: CategoryProductsViewProps) {
  const { confirmAction, ConfirmDialog } = useAdminConfirm();

  // Initialize matching products list in state
  const [productsList, setProductsList] = useState<Product[]>(() => {
    return PRODUCTS.filter((p) => {
      if (p.categorySlug && p.categorySlug === category.slug) return true;
      if (p.categoryId && p.categoryId === category.slug) return true;
      if (p.category && p.category.toLowerCase().includes(category.name.toLowerCase().split(" ")[0])) return true;
      return false;
    });
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "VISIBLE" | "HIDDEN" | "IN_STOCK" | "OUT_OF_STOCK">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
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
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    rating: 5.0,
    reviewsCount: 24,
    offerBadge: "",
    offerDiscountPercent: 0,
    offerCouponCode: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminProductsAction({ categorySlug: category.slug });
      if (res.success && res.data && res.data.length > 0) {
        setProductsList(res.data as any);
      }
    } catch (err) {
      console.error("Failed to load category products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category.slug]);

  const availableProductImages = [
    { label: "Mailer Box 4x4x1.5", url: "/images/box_4_4_1_5.png" },
    { label: "Mailer Box 4x4x2", url: "/images/box_4_4_2.png" },
    { label: "Mailer Box 6x4x2", url: "/images/box_6_4_2.png" },
    { label: "Mailer Box 6.5x5x1.5", url: "/images/box_6_5_1_5.png" },
    { label: "Standard Mailer Collection", url: "/images/mailer-boxes.png" },
    { label: "Corrugated Box", url: "/images/corrugated-boxes.png" },
    { label: "Shipping Box", url: "/images/shipping-boxes.png" },
    { label: "Custom Printed Box", url: "/images/custom-printed-boxes.png" },
    { label: "Pizza Box", url: "/images/pizza-boxes.png" },
    { label: "Mono Carton", url: "/images/mono-cartons.png" },
    { label: "Tape Rolls", url: "/images/tape-rolls.png" },
    { label: "Bubble Wrap Roll", url: "/images/bubble-wrap.png" },
    { label: "Corrugated Roll", url: "/images/corrugated-rolls.png" },
    { label: "Courier Bag", url: "/images/courier-bags.png" },
  ];

  // Filter products by search & visibility / stock status
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.size_inches && p.size_inches.toLowerCase().includes(q));

      const isHidden = p.status === "INACTIVE" || p.isHidden === true;
      const isOut = p.availability === "Out of Stock";

      if (filterTab === "VISIBLE") return matchesSearch && !isHidden;
      if (filterTab === "HIDDEN") return matchesSearch && isHidden;
      if (filterTab === "IN_STOCK") return matchesSearch && !isOut && !isHidden;
      if (filterTab === "OUT_OF_STOCK") return matchesSearch && isOut;
      return matchesSearch;
    });
  }, [productsList, searchQuery, filterTab]);

  // Counts for quick filter pills
  const visibleCount = useMemo(() => productsList.filter((p) => p.status !== "INACTIVE" && !p.isHidden).length, [productsList]);
  const hiddenCount = useMemo(() => productsList.filter((p) => p.status === "INACTIVE" || p.isHidden).length, [productsList]);

  // Open Modal for New Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    const defaultName = `${category.name} SKU #${productsList.length + 1}`;
    const defaultSlug = `${category.slug}-sku-${productsList.length + 1}`;
    setProductForm({
      name: defaultName,
      slug: defaultSlug,
      size_inches: "6 inch X 4 inch X 2 inch",
      size_inches_short: "6x4x2",
      length_in: 6,
      width_in: 4,
      height_in: 2,
      description: `Premium ${category.name} manufactured with durable corrugated material.`,
      image: category.image || "/images/box_4_4_1_5.png",
      price50: 250,
      price100: 470,
      price300: 1300,
      price500: 2450,
      availability: "In Stock",
      status: "ACTIVE",
      rating: 5.0,
      reviewsCount: 18,
      offerBadge: "",
      offerDiscountPercent: 0,
      offerCouponCode: "",
    });
    setIsProductModalOpen(true);
  };

  // Open Modal for Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    const isHidden = prod.status === "INACTIVE" || prod.isHidden === true;
    setProductForm({
      name: prod.name,
      slug: prod.slug,
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
      status: isHidden ? "INACTIVE" : "ACTIVE",
      rating: prod.rating || 5.0,
      reviewsCount: prod.reviewsCount || 10,
      offerBadge: prod.offerBadge || "",
      offerDiscountPercent: prod.offerDiscountPercent || 0,
      offerCouponCode: "",
    });
    setIsProductModalOpen(true);
  };

  // 1-Click Toggle Product Hide/Show (Storefront Visibility)
  const handleToggleProductVisibility = (id: string) => {
    const product = productsList.find((p) => p.id === id);
    if (!product) return;

    const isCurrentlyHidden = product.status === "INACTIVE" || product.isHidden === true;
    const willBeVisible = isCurrentlyHidden;
    const newDbStatus = willBeVisible ? "ACTIVE" : "INACTIVE";

    confirmAction({
      title: "Toggle Product Visibility",
      message: "Are you sure you want to do this?",
      description: `Change "${product.name}" status to ${willBeVisible ? "Visible in Storefront" : "Hidden from Storefront"}.`,
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        setProductsList((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: newDbStatus,
                  isHidden: !willBeVisible,
                }
              : p
          )
        );

        const res = await toggleProductStatusAction(id, newDbStatus);
        if (!res.success) {
          showToast(`⚠️ Sync note: ${res.error}`);
          loadProducts();
        } else {
          showToast(
            willBeVisible
              ? `👁️ "${product.name}" is now VISIBLE on Storefront`
              : `🚫 "${product.name}" is now HIDDEN from Storefront`
          );
        }
      },
    });
  };

  // 1-Click Toggle Product Stock Status
  const handleToggleProductStock = (id: string) => {
    const product = productsList.find((p) => p.id === id);
    if (!product) return;

    const willBeInStock = product.availability === "Out of Stock";
    const newStatus = willBeInStock ? "In Stock" : "Out of Stock";
    const dbStatus = willBeInStock ? "ACTIVE" : "INACTIVE";

    confirmAction({
      title: "Toggle Product Stock Status",
      message: "Are you sure you want to do this?",
      description: `Set "${product.name}" availability to "${newStatus}".`,
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        setProductsList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, availability: newStatus } : p))
        );

        const res = await toggleProductStatusAction(id, dbStatus);
        if (!res.success) {
          showToast(`⚠️ Sync note: ${res.error}`);
          loadProducts();
        } else {
          showToast(`"${product.name}" is now ${newStatus === "In Stock" ? "In Stock 📦" : "Out of Stock 🛑"}`);
        }
      },
    });
  };

  // Auto update slug on name change
  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setProductForm((prev) => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : slug,
    }));
  };

  // Save product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const shortSize = `${productForm.length_in}x${productForm.width_in}x${productForm.height_in}`;
    const fullSize = `${productForm.length_in} inch X ${productForm.width_in} inch X ${productForm.height_in} inch`;

    const generatedSlug = productForm.slug.trim() ||
      productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const payload = {
      name: productForm.name.trim(),
      slug: generatedSlug,
      categoryId: category.slug,
      description: productForm.description.trim(),
      status: productForm.status,
      imageUrl: productForm.image,
      lengthIn: Number(productForm.length_in),
      widthIn: Number(productForm.width_in),
      heightIn: Number(productForm.height_in),
      material: "Corrugated Cardboard",
      price50: Number(productForm.price50),
      price100: Number(productForm.price100),
      price300: Number(productForm.price300),
      price500: Number(productForm.price500),
      stockQuantity: productForm.status === "ACTIVE" && productForm.availability === "In Stock" ? 100 : 0,
      seoTitle: productForm.offerBadge
        ? `OFFER:${productForm.offerBadge}|${productForm.offerDiscountPercent || ""}|${productForm.offerCouponCode || ""}`
        : undefined,
    };

    confirmAction({
      title: editingProduct ? `Update Product: ${productForm.name}` : `Add Product to ${category.name}`,
      message: "Are you sure you want to do this?",
      description: `Commit SKU details for "${productForm.name}" to the database.`,
      defaultCommitPreview: editingProduct ? "Product updated" : "Product created",
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        setIsSubmitting(true);
        try {
          if (editingProduct) {
            const res = await updateAdminProductAction(editingProduct.id, payload, commitNote);
            if (res.success && res.data) {
              setProductsList((prev) =>
                prev.map((p) => (p.id === editingProduct.id ? (res.data as any) : p))
              );
              showToast(`✓ Product "${productForm.name}" updated successfully!`);
              await loadProducts();
              setIsProductModalOpen(false);
            } else {
              showToast(`⚠️ ${res.error || "Failed to update product"}`);
            }
          } else {
            const res = await createAdminProductAction(payload, commitNote);
            if (res.success && res.data) {
              setProductsList((prev) => [res.data as any, ...prev.filter((p) => p.id !== (res.data as any).id)]);
              showToast(`🎉 Product SKU "${productForm.name}" added to ${category.name}!`);
              await loadProducts();
              setIsProductModalOpen(false);
            } else {
              showToast(`⚠️ ${res.error || "Failed to create product"}`);
            }
          }
        } catch (err: any) {
          showToast(`⚠️ Error: ${err.message || "Failed to save product"}`);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    confirmAction({
      title: `Delete Product: ${name}`,
      message: "This action cannot be undone. Are you sure you want to delete this?",
      description: `Product SKU: ${name} (ID: ${id})`,
      defaultCommitPreview: "Product deleted",
      isDestructive: true,
      confirmLabel: "Continue to Delete",
      onConfirm: async (commitNote?: string) => {
        setProductsList((prev) => prev.filter((p) => p.id !== id));
        showToast(`🗑️ Deleting "${name}"...`);

        const res = await deleteAdminProductAction(id, commitNote);
        if (res.success) {
          if ((res as any).softDeleted) {
            showToast(`🛡️ "${name}" was safely deactivated (has order history).`);
          } else {
            showToast(`🗑️ "${name}" permanently removed.`);
          }
          await loadProducts();
        } else {
          showToast(`⚠️ ${(res as any).error || "Failed to delete product"}`);
          await loadProducts();
        }
      },
    });
  };

  const handleDeleteThisCategory = () => {
    confirmAction({
      title: `Delete Category: ${category.name}`,
      message: "This action cannot be undone. Are you sure you want to delete this category?",
      description: `Category: ${category.name} (ID: ${category.id})`,
      defaultCommitPreview: "Category deleted",
      isDestructive: true,
      confirmLabel: "Continue to Delete",
      onConfirm: async (commitNote?: string) => {
        showToast(`🗑️ Deleting category "${category.name}"...`);
        const res = await deleteAdminCategoryAction(category.id, commitNote);
        if (res.success) {
          if (onDeleteCategory) {
            onDeleteCategory(category.id, category.name);
          }
          onBack();
        } else {
          showToast(`⚠️ ${(res as any).error || "Failed to delete category"}`);
        }
      },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
      {/* Toast Pop-Up Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "28px",
            zIndex: 99999,
            background: toastMessage.includes("⚠️") || toastMessage.includes("Error") ? "#FEF2F2" : "#ECFDF5",
            border: `1.5px solid ${toastMessage.includes("⚠️") || toastMessage.includes("Error") ? "#F87171" : "#34D399"}`,
            color: toastMessage.includes("⚠️") || toastMessage.includes("Error") ? "#991B1B" : "#065F46",
            padding: "14px 20px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "adminModalPop 0.2s ease-out",
          }}
        >
          <span>{toastMessage.includes("⚠️") ? "⚠️" : "✓"}</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: "14px",
              marginLeft: "6px",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Breadcrumbs & Header */}
      <div>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            color: "#5C3A22",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: "12px",
            padding: 0,
          }}
        >
          <span>←</span>
          <span>Back to All Categories</span>
        </button>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            border: "1px solid #EDE3D4",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            boxShadow: "0 2px 8px rgba(43,43,43,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "14px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                flexShrink: 0,
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100/F7F2EC/5C3A22?text=Box";
                }}
              />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#2B2B2B", margin: 0 }}>
                  {category.name}
                </h1>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "8px", background: "#FDF4EB", color: "#5C3A22", border: "1px solid #EDE3D4" }}>
                  {productsList.length} Products
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "6px",
                    background: category.stockStatus === "OUT_OF_STOCK" ? "#FEE2E2" : "#ECFDF5",
                    color: category.stockStatus === "OUT_OF_STOCK" ? "#DC2626" : "#059669",
                    border: `1px solid ${category.stockStatus === "OUT_OF_STOCK" ? "#FECACA" : "#A7F3D0"}`,
                  }}
                >
                  {category.stockStatus === "OUT_OF_STOCK" ? "Category Out of Stock" : "Category In Stock"}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#6B6B6B", margin: "4px 0 0 0", maxWidth: "600px" }}>
                {category.description}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link
              href={`/category/${category.slug}`}
              target="_blank"
              style={{
                padding: "8px 14px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#5C3A22",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>Storefront View</span>
              <span style={{ color: "#D68A45" }}>↗</span>
            </Link>
            <button
              onClick={handleOpenAddProduct}
              style={{
                padding: "8px 16px",
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
              <span>Add Product</span>
            </button>
            <button
              onClick={handleDeleteThisCategory}
              style={{
                padding: "8px 12px",
                background: "#FEE2E2",
                border: "1px solid #FECACA",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#DC2626",
                cursor: "pointer",
              }}
              title="Delete this entire category"
            >
              Delete Category
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EDE3D4",
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: "0 1px 3px rgba(43,43,43,0.03)",
        }}
      >
        <div style={{ width: "300px", position: "relative" }}>
          <input
            type="text"
            placeholder={`Search ${category.name} products...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "#F7F2EC",
              border: "1px solid #EDE3D4",
              borderRadius: "8px",
              padding: "7px 12px 7px 32px",
              fontSize: "12px",
              color: "#2B2B2B",
              outline: "none",
            }}
          />
          <svg
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#8E8880" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Stock / Visibility Filter & View Mode */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", background: "#F7F2EC", padding: "3px", borderRadius: "8px", border: "1px solid #EDE3D4", gap: "2px", flexWrap: "wrap" }}>
            {[
              { id: "ALL", label: `All (${productsList.length})` },
              { id: "VISIBLE", label: `👁️ Visible (${visibleCount})` },
              { id: "HIDDEN", label: `🚫 Hidden (${hiddenCount})` },
              { id: "IN_STOCK", label: "In Stock" },
              { id: "OUT_OF_STOCK", label: "Out of Stock" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                style={{
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: filterTab === tab.id ? "#5C3A22" : "transparent",
                  color: filterTab === tab.id ? "#FFFFFF" : "#6B6B6B",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", background: "#F7F2EC", padding: "3px", borderRadius: "8px", border: "1px solid #EDE3D4", gap: "2px" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: viewMode === "grid" ? "#D68A45" : "transparent",
                color: viewMode === "grid" ? "#FFFFFF" : "#6B6B6B",
              }}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: viewMode === "table" ? "#D68A45" : "transparent",
                color: viewMode === "table" ? "#FFFFFF" : "#6B6B6B",
              }}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* 3. Products Render */}
      {filteredProducts.length === 0 ? (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EDE3D4",
            padding: "48px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📦</div>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#2B2B2B", margin: 0 }}>
            No products match your filter
          </h3>
          <p style={{ fontSize: "12px", color: "#8E8880", margin: "4px 0 16px 0" }}>
            Add new products to this category using the button below.
          </p>
          <button
            onClick={handleOpenAddProduct}
            style={{
              padding: "8px 18px",
              background: "#5C3A22",
              color: "#FFF",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            + Add Product to {category.name}
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredProducts.map((product) => {
            const minUnit = getUnitPrice(product, 500);
            const isProductOut = product.availability === "Out of Stock";
            const isProductHidden = product.status === "INACTIVE" || product.isHidden === true;

            return (
              <div
                key={product.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  border: isProductHidden ? "1px dashed #F59E0B" : isProductOut ? "1px solid #FECACA" : "1px solid #EDE3D4",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(43,43,43,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  opacity: isProductHidden ? 0.85 : isProductOut ? 0.92 : 1,
                }}
              >
                {/* Top Status Header */}
                <div
                  style={{
                    padding: "8px 12px",
                    background: isProductHidden ? "#FFFBEB" : "#FAF7F2",
                    borderBottom: "1px solid #EDE3D4",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "6px",
                      background: "#D68A45",
                      color: "#FFFFFF",
                    }}
                  >
                    {product.size_inches_short || product.size_inches || "Standard"}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    {/* Visibility Badge */}
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "6px",
                        background: isProductHidden ? "#FEF3C7" : "#ECFDF5",
                        color: isProductHidden ? "#D97706" : "#059669",
                        border: `1px solid ${isProductHidden ? "#FDE68A" : "#A7F3D0"}`,
                      }}
                    >
                      {isProductHidden ? "🚫 Hidden" : "👁️ Visible"}
                    </span>

                    {/* Stock Status Badge */}
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "6px",
                        background: isProductOut ? "#FEE2E2" : "#F3F4F6",
                        color: isProductOut ? "#DC2626" : "#4B5563",
                        border: `1px solid ${isProductOut ? "#FECACA" : "#E5E7EB"}`,
                      }}
                    >
                      {isProductOut ? "Out of Stock" : "In Stock"}
                    </span>
                  </div>
                </div>

                {/* Clean Image Container */}
                <div
                  style={{
                    height: "135px",
                    background: isProductHidden ? "#FFFDF5" : isProductOut ? "#FEF2F2" : "#F7F2EC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px",
                    borderBottom: "1px solid #EDE3D4",
                    position: "relative",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "80%",
                      objectFit: "contain",
                      filter: isProductHidden ? "grayscale(30%) opacity(0.85)" : isProductOut ? "grayscale(40%)" : "drop-shadow(0 4px 8px rgba(0,0,0,0.08))",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/200x150/F7F2EC/5C3A22?text=Box";
                    }}
                  />
                  {isProductHidden && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "6px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(217, 119, 6, 0.9)",
                        color: "#FFFFFF",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        whiteSpace: "nowrap",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Hidden from Storefront
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: isProductHidden ? "#8E8880" : isProductOut ? "#6B6B6B" : "#2B2B2B", margin: "0 0 4px 0", lineHeight: 1.3 }}>
                      {product.name}
                    </h3>
                    <div style={{ fontSize: "11px", color: "#8E8880", marginBottom: "8px" }}>
                      Dimensions: {product.size_inches}
                    </div>

                    {/* Price Tiers Preview */}
                    <div style={{ background: "#F7F2EC", borderRadius: "8px", padding: "8px 10px", marginBottom: "12px", border: "1px solid #EDE3D4" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#2B2B2B" }}>
                        <span>50 pcs: ₹{product.prices["50"] || "-"}</span>
                        <span>500 pcs: ₹{product.prices["500"] || "-"}</span>
                      </div>
                      <div style={{ fontSize: "10px", color: isProductHidden ? "#D97706" : isProductOut ? "#DC2626" : "#059669", fontWeight: 700, marginTop: "2px" }}>
                        {isProductHidden ? "🚫 Hidden from customer catalog" : isProductOut ? "Unavailable for order" : `Starting from ₹${minUnit.toFixed(2)}/unit`}
                      </div>
                    </div>
                  </div>

                  {/* Actions: 1-Click Hide/Show & Stock Toggle & Edit */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #F7F2EC", paddingTop: "10px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {/* Hide / Show Toggle Button */}
                      <button
                        onClick={() => handleToggleProductVisibility(product.id)}
                        style={{
                          flex: 1,
                          padding: "5px 8px",
                          fontSize: "10px",
                          fontWeight: 700,
                          background: isProductHidden ? "#ECFDF5" : "#FEF3C7",
                          border: `1px solid ${isProductHidden ? "#A7F3D0" : "#FDE68A"}`,
                          borderRadius: "6px",
                          color: isProductHidden ? "#059669" : "#B45309",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                        title={isProductHidden ? "Click to Show on Storefront" : "Click to Hide from Storefront"}
                      >
                        <span>{isProductHidden ? "👁️ Show" : "🚫 Hide"}</span>
                      </button>

                      {/* Stock Toggle Button */}
                      <button
                        onClick={() => handleToggleProductStock(product.id)}
                        style={{
                          flex: 1,
                          padding: "5px 8px",
                          fontSize: "10px",
                          fontWeight: 700,
                          background: isProductOut ? "#ECFDF5" : "#FEF2F2",
                          border: `1px solid ${isProductOut ? "#A7F3D0" : "#FECACA"}`,
                          borderRadius: "6px",
                          color: isProductOut ? "#059669" : "#DC2626",
                          cursor: "pointer",
                        }}
                      >
                        {isProductOut ? "Make In Stock" : "Mark Out of Stock"}
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        style={{
                          flex: 1,
                          padding: "5px 10px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: "#5C3A22",
                          color: "#FFF",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Edit SKU
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        style={{
                          padding: "5px 10px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: "#FEE2E2",
                          color: "#DC2626",
                          borderRadius: "6px",
                          border: "1px solid #FECACA",
                          cursor: "pointer",
                        }}
                        title="Delete SKU"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EDE3D4",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(43,43,43,0.04)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F7F2EC", borderBottom: "1px solid #EDE3D4", fontSize: "11px", fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 18px" }}>Image</th>
                  <th style={{ padding: "12px 18px" }}>Product Name</th>
                  <th style={{ padding: "12px 18px" }}>Size</th>
                  <th style={{ padding: "12px 18px" }}>50 Pcs Price</th>
                  <th style={{ padding: "12px 18px" }}>500 Pcs Price</th>
                  <th style={{ padding: "12px 18px" }}>Visibility</th>
                  <th style={{ padding: "12px 18px" }}>Stock Status</th>
                  <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "12px" }}>
                {filteredProducts.map((product, i) => {
                  const isProductOut = product.availability === "Out of Stock";
                  const isProductHidden = product.status === "INACTIVE" || product.isHidden === true;

                  return (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: i === filteredProducts.length - 1 ? "none" : "1px solid #EDE3D4",
                        background: isProductHidden ? "#FFFDF5" : isProductOut ? "#FFFDFD" : "#FFFFFF",
                      }}
                    >
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#F7F2EC", border: "1px solid #EDE3D4", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={product.image} alt={product.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                        </div>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 700, color: isProductHidden ? "#8E8880" : "#2B2B2B" }}>{product.name}</div>
                        <div style={{ fontSize: "10px", color: "#8E8880", fontFamily: "monospace" }}>{product.slug}</div>
                      </td>
                      <td style={{ padding: "12px 18px", fontWeight: 600, color: "#5C3A22" }}>
                        {product.size_inches}
                      </td>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: "#2B2B2B" }}>
                        ₹{product.prices["50"] || "-"}
                      </td>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: "#059669" }}>
                        ₹{product.prices["500"] || "-"}
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        {/* 1-Click Hide/Show Toggle */}
                        <button
                          onClick={() => handleToggleProductVisibility(product.id)}
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: isProductHidden ? "#FEF3C7" : "#ECFDF5",
                            color: isProductHidden ? "#D97706" : "#059669",
                            border: `1px solid ${isProductHidden ? "#FDE68A" : "#A7F3D0"}`,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title={isProductHidden ? "Click to Show on Storefront" : "Click to Hide from Storefront"}
                        >
                          <span>{isProductHidden ? "🚫 Hidden" : "👁️ Visible"}</span>
                        </button>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <button
                          onClick={() => handleToggleProductStock(product.id)}
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: isProductOut ? "#FEE2E2" : "#F3F4F6",
                            color: isProductOut ? "#DC2626" : "#4B5563",
                            border: `1px solid ${isProductOut ? "#FECACA" : "#E5E7EB"}`,
                            cursor: "pointer",
                          }}
                        >
                          {isProductOut ? "Out of Stock" : "In Stock"}
                        </button>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            style={{
                              padding: "4px 10px",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#FFFFFF",
                              background: "#5C3A22",
                              borderRadius: "6px",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#DC2626",
                              background: "#FEE2E2",
                              borderRadius: "6px",
                              border: "1px solid #FECACA",
                              cursor: "pointer",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Add / Edit Product Modal Inside Category */}
      {isProductModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              border: "1px solid #EDE3D4",
              maxWidth: "560px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pinned Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #EDE3D4", flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#2B2B2B", margin: 0 }}>
                  {editingProduct ? `Edit ${editingProduct.name}` : `Add Product to ${category.name}`}
                </h2>
                <span style={{ fontSize: "11px", color: "#8E8880" }}>
                  Category: <strong style={{ color: "#5C3A22" }}>{category.name}</strong>
                </span>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: "18px", color: "#8E8880", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Modal Form Body */}
            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              {/* Storefront Visibility (Show / Hide Option) */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "6px" }}>
                  Storefront Visibility *
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setProductForm((prev) => ({ ...prev, status: "ACTIVE" }))}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: productForm.status === "ACTIVE" ? "2px solid #059669" : "1px solid #EDE3D4",
                      background: productForm.status === "ACTIVE" ? "#ECFDF5" : "#FFFFFF",
                      color: productForm.status === "ACTIVE" ? "#059669" : "#6B6B6B",
                      fontWeight: 700,
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <span>👁️</span>
                    <span>Show (Visible in Store)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm((prev) => ({ ...prev, status: "INACTIVE" }))}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: productForm.status === "INACTIVE" ? "2px solid #DC2626" : "1px solid #EDE3D4",
                      background: productForm.status === "INACTIVE" ? "#FEF2F2" : "#FFFFFF",
                      color: productForm.status === "INACTIVE" ? "#DC2626" : "#6B6B6B",
                      fontWeight: 700,
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <span>🚫</span>
                    <span>Hide (Hidden from Store)</span>
                  </button>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6x4x2 Corrugated Mailer Box"
                  value={productForm.name}
                  onChange={handleProductNameChange}
                  style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#2B2B2B", outline: "none" }}
                />
              </div>

              {/* Slug */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6x4x2-mailer-box"
                  value={productForm.slug}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
                  style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#2B2B2B", fontFamily: "monospace", outline: "none" }}
                />
              </div>

              {/* Dimensions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Length (in) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={productForm.length_in}
                    onChange={(e) => {
                      const l = Number(e.target.value);
                      setProductForm((prev) => ({
                        ...prev,
                        length_in: l,
                        size_inches: `${l} inch X ${prev.width_in} inch X ${prev.height_in} inch`,
                        size_inches_short: `${l}x${prev.width_in}x${prev.height_in}`,
                      }));
                    }}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Width (in) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={productForm.width_in}
                    onChange={(e) => {
                      const w = Number(e.target.value);
                      setProductForm((prev) => ({
                        ...prev,
                        width_in: w,
                        size_inches: `${prev.length_in} inch X ${w} inch X ${prev.height_in} inch`,
                        size_inches_short: `${prev.length_in}x${w}x${prev.height_in}`,
                      }));
                    }}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Height (in) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={productForm.height_in}
                    onChange={(e) => {
                      const h = Number(e.target.value);
                      setProductForm((prev) => ({
                        ...prev,
                        height_in: h,
                        size_inches: `${prev.length_in} inch X ${prev.width_in} inch X ${h} inch`,
                        size_inches_short: `${prev.length_in}x${prev.width_in}x${h}`,
                      }));
                    }}
                    style={{ width: "100%", background: "#F7F2EC", border: "1px solid #EDE3D4", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", outline: "none" }}
                  />
                </div>
              </div>

              {/* Product Box Image Selection / Upload */}
              <div>
                <ImageUploadField
                  label="Product Box Artwork Image"
                  value={productForm.image}
                  onChange={(newUrl) => setProductForm((prev) => ({ ...prev, image: newUrl }))}
                  presetImages={availableProductImages}
                  helperText="Upload custom box artwork/photo or pick from BoxCare catalog assets."
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "10px", color: "#6B6B6B" }}>50 pcs total (₹)</label>
                    <input
                      type="number"
                      value={productForm.price50}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price50: Number(e.target.value) }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "#6B6B6B" }}>100 pcs total (₹)</label>
                    <input
                      type="number"
                      value={productForm.price100}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price100: Number(e.target.value) }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "#6B6B6B" }}>300 pcs total (₹)</label>
                    <input
                      type="number"
                      value={productForm.price300}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price300: Number(e.target.value) }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "#6B6B6B" }}>500 pcs total (₹)</label>
                    <input
                      type="number"
                      value={productForm.price500}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price500: Number(e.target.value) }))}
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid #EDE3D4", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", outline: "none" }}
                    />
                  </div>
                </div>
              </div>

              {/* Stock Status Selection */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  Availability / Stock Status
                </label>
                <select
                  value={productForm.availability}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, availability: e.target.value }))}
                  style={{
                    width: "100%",
                    background: "#F7F2EC",
                    border: "1px solid #EDE3D4",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    fontSize: "12px",
                    color: "#2B2B2B",
                    outline: "none",
                  }}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Made to Order">Made to Order</option>
                </select>
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
                  style={{
                    width: "100%",
                    background: "#F7F2EC",
                    border: "1px solid #EDE3D4",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    color: "#2B2B2B",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </div>

              {/* Sticky Action Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "14px",
                  paddingTop: "14px",
                  borderTop: "1px solid #EDE3D4",
                  position: "sticky",
                  bottom: "-20px",
                  background: "#FFFFFF",
                  paddingBottom: "4px",
                  zIndex: 10,
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    background: "#F7F2EC",
                    border: "1px solid #EDE3D4",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#4A4A4A",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    background: "#5C3A22",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(92, 58, 34, 0.25)",
                  }}
                >
                  {editingProduct ? "Save Changes" : `Add to ${category.name}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {ConfirmDialog}
    </div>
  );
}
