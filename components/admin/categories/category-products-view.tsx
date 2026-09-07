"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AdminCategory } from "./category-types";
import { PRODUCTS, Product, getUnitPrice } from "@/lib/products-data";

interface CategoryProductsViewProps {
  category: AdminCategory;
  onBack: () => void;
  onDeleteCategory?: (id: string, name: string) => void;
}

export function CategoryProductsView({ category, onBack, onDeleteCategory }: CategoryProductsViewProps) {
  // Initialize matching products list in state
  const [productsList, setProductsList] = useState<Product[]>(() => {
    return PRODUCTS.filter((p) => {
      if (p.categorySlug && p.categorySlug === category.slug) return true;
      if (p.categoryId && p.categoryId === category.slug) return true;
      if (p.category && p.category.toLowerCase().includes(category.name.toLowerCase().split(" ")[0])) return true;
      return false;
    });
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"ALL" | "IN_STOCK" | "OUT_OF_STOCK">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    rating: 5.0,
    reviewsCount: 24,
  });

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

  // Filter products by search & stock status
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.size_inches && p.size_inches.toLowerCase().includes(q));

      const isOut = p.availability === "Out of Stock";
      if (stockFilter === "IN_STOCK") return matchesSearch && !isOut;
      if (stockFilter === "OUT_OF_STOCK") return matchesSearch && isOut;
      return matchesSearch;
    });
  }, [productsList, searchQuery, stockFilter]);

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
      rating: 5.0,
      reviewsCount: 18,
    });
    setIsProductModalOpen(true);
  };

  // Open Modal for Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
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
      price50: prod.prices["50"] || 0,
      price100: prod.prices["100"] || 0,
      price300: prod.prices["300"] || 0,
      price500: prod.prices["500"] || 0,
      availability: prod.availability || "In Stock",
      rating: prod.rating || 5.0,
      reviewsCount: prod.reviewsCount || 10,
    });
    setIsProductModalOpen(true);
  };

  // 1-Click Toggle Product Stock Status
  const handleToggleProductStock = (id: string) => {
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              availability: p.availability === "Out of Stock" ? "In Stock" : "Out of Stock",
            }
          : p
      )
    );
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

    if (editingProduct) {
      // Update
      setProductsList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: productForm.name,
                slug: productForm.slug,
                size_inches: productForm.size_inches,
                size_inches_short: productForm.size_inches_short,
                length_in: Number(productForm.length_in),
                width_in: Number(productForm.width_in),
                height_in: Number(productForm.height_in),
                description: productForm.description,
                image: productForm.image,
                availability: productForm.availability,
                prices: {
                  ...p.prices,
                  "50": Number(productForm.price50),
                  "100": Number(productForm.price100),
                  "300": Number(productForm.price300),
                  "500": Number(productForm.price500),
                },
              }
            : p
        )
      );
    } else {
      // Add new
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productForm.name,
        slug: productForm.slug || `product-${Date.now()}`,
        category: category.name,
        categorySlug: category.slug,
        categoryId: category.slug,
        size_inches: productForm.size_inches,
        size_inches_short: productForm.size_inches_short,
        size_cm: `${(Number(productForm.length_in) * 2.54).toFixed(1)} cm x ${(Number(productForm.width_in) * 2.54).toFixed(1)} cm x ${(Number(productForm.height_in) * 2.54).toFixed(1)} cm`,
        length_in: Number(productForm.length_in),
        width_in: Number(productForm.width_in),
        height_in: Number(productForm.height_in),
        length_cm: Number(productForm.length_in) * 2.54,
        width_cm: Number(productForm.width_in) * 2.54,
        height_cm: Number(productForm.height_in) * 2.54,
        description: productForm.description,
        features: ["Self-Locking Flaps", "High-Grade E-Flute", "Eco-Friendly Kraft"],
        prices: {
          "50": Number(productForm.price50),
          "100": Number(productForm.price100),
          "300": Number(productForm.price300),
          "500": Number(productForm.price500),
        },
        contact_number: "+91 89039 27262",
        availability: productForm.availability,
        image: productForm.image,
        specifications: { "Box Type": category.name, "Material": "Corrugated Cardboard" },
        rating: 5.0,
        reviewsCount: 1,
        isPopular: true,
      };
      setProductsList((prev) => [newProduct, ...prev]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from ${category.name}?`)) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
            {onDeleteCategory && (
              <button
                onClick={() => onDeleteCategory(category.id, category.name)}
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
            )}
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

        {/* Stock Filter & View Mode */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", background: "#F7F2EC", padding: "3px", borderRadius: "8px", border: "1px solid #EDE3D4", gap: "2px" }}>
            {[
              { id: "ALL", label: "All SKUs" },
              { id: "IN_STOCK", label: "In Stock" },
              { id: "OUT_OF_STOCK", label: "Out of Stock" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStockFilter(tab.id as any)}
                style={{
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: stockFilter === tab.id ? "#5C3A22" : "transparent",
                  color: stockFilter === tab.id ? "#FFFFFF" : "#6B6B6B",
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
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredProducts.map((product) => {
            const minUnit = getUnitPrice(product, 500);
            const isProductOut = product.availability === "Out of Stock";
            return (
              <div
                key={product.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  border: isProductOut ? "1px solid #FECACA" : "1px solid #EDE3D4",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(43,43,43,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  opacity: isProductOut ? 0.9 : 1,
                }}
              >
                {/* Product Card Top Status Header (Zero Overlap) */}
                <div
                  style={{
                    padding: "8px 12px",
                    background: "#FAF7F2",
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

                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "6px",
                      background: isProductOut ? "#FEE2E2" : "#ECFDF5",
                      color: isProductOut ? "#DC2626" : "#059669",
                      border: `1px solid ${isProductOut ? "#FECACA" : "#A7F3D0"}`,
                    }}
                  >
                    {isProductOut ? "Out of Stock" : "In Stock"}
                  </span>
                </div>

                {/* Clean Image Container */}
                <div
                  style={{
                    height: "135px",
                    background: isProductOut ? "#FEF2F2" : "#F7F2EC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px",
                    borderBottom: "1px solid #EDE3D4",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "80%",
                      objectFit: "contain",
                      filter: isProductOut ? "grayscale(40%) drop-shadow(0 4px 8px rgba(0,0,0,0.08))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.08))",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/200x150/F7F2EC/5C3A22?text=Box";
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: isProductOut ? "#6B6B6B" : "#2B2B2B", margin: "0 0 4px 0", lineHeight: 1.3 }}>
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
                      <div style={{ fontSize: "10px", color: isProductOut ? "#DC2626" : "#059669", fontWeight: 700, marginTop: "2px" }}>
                        {isProductOut ? "Unavailable for order" : `Starting from ₹${minUnit.toFixed(2)}/unit`}
                      </div>
                    </div>
                  </div>

                  {/* Actions & 1-Click Stock Toggle */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F7F2EC", paddingTop: "12px" }}>
                    <button
                      onClick={() => handleToggleProductStock(product.id)}
                      style={{
                        padding: "4px 8px",
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

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        style={{
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: "#5C3A22",
                          color: "#FFF",
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
                  <th style={{ padding: "12px 20px" }}>Image</th>
                  <th style={{ padding: "12px 20px" }}>Product Name</th>
                  <th style={{ padding: "12px 20px" }}>Size</th>
                  <th style={{ padding: "12px 20px" }}>50 Pcs Price</th>
                  <th style={{ padding: "12px 20px" }}>500 Pcs Price</th>
                  <th style={{ padding: "12px 20px" }}>Stock Status</th>
                  <th style={{ padding: "12px 20px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "12px" }}>
                {filteredProducts.map((product, i) => {
                  const isProductOut = product.availability === "Out of Stock";
                  return (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: i === filteredProducts.length - 1 ? "none" : "1px solid #EDE3D4",
                        background: isProductOut ? "#FFFDFD" : "#FFFFFF",
                      }}
                    >
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#F7F2EC", border: "1px solid #EDE3D4", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={product.image} alt={product.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                        </div>
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ fontWeight: 700, color: "#2B2B2B" }}>{product.name}</div>
                        <div style={{ fontSize: "10px", color: "#8E8880", fontFamily: "monospace" }}>{product.slug}</div>
                      </td>
                      <td style={{ padding: "12px 20px", fontWeight: 600, color: "#5C3A22" }}>
                        {product.size_inches}
                      </td>
                      <td style={{ padding: "12px 20px", fontWeight: 700, color: "#2B2B2B" }}>
                        ₹{product.prices["50"] || "-"}
                      </td>
                      <td style={{ padding: "12px 20px", fontWeight: 700, color: "#059669" }}>
                        ₹{product.prices["500"] || "-"}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <button
                          onClick={() => handleToggleProductStock(product.id)}
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: isProductOut ? "#FEE2E2" : "#ECFDF5",
                            color: isProductOut ? "#DC2626" : "#059669",
                            border: `1px solid ${isProductOut ? "#FECACA" : "#A7F3D0"}`,
                            cursor: "pointer",
                          }}
                        >
                          {isProductOut ? "Out of Stock" : "In Stock"}
                        </button>
                      </td>
                      <td style={{ padding: "12px 20px", textAlign: "right" }}>
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
              overflowY: "auto",
              padding: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid #EDE3D4", paddingBottom: "12px" }}>
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

            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Product Name */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8 X 5 X 3 Inch Flap Mailer Box"
                  value={productForm.name}
                  onChange={handleProductNameChange}
                  style={{
                    width: "100%",
                    background: "#F7F2EC",
                    border: "1px solid #EDE3D4",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    color: "#2B2B2B",
                    outline: "none",
                  }}
                />
              </div>

              {/* Slug */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  URL Slug (/product/...) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mailer-box-8x5x3"
                  value={productForm.slug}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
                  style={{
                    width: "100%",
                    background: "#F7F2EC",
                    border: "1px solid #EDE3D4",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: "#5C3A22",
                    outline: "none",
                  }}
                />
              </div>

              {/* Dimensions (Length, Width, Height) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Length (in)
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
                    Width (in)
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
                    Height (in)
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

              {/* Product Box Image Selection */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  Product Box Artwork Image
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select
                    value={productForm.image}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                    style={{
                      flex: 1,
                      background: "#F7F2EC",
                      border: "1px solid #EDE3D4",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      fontSize: "12px",
                      color: "#2B2B2B",
                      outline: "none",
                    }}
                  >
                    {availableProductImages.map((img) => (
                      <option key={img.url} value={img.url}>
                        {img.label} ({img.url})
                      </option>
                    ))}
                  </select>
                  <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "#F7F2EC", border: "1px solid #EDE3D4", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}>
                    <img src={productForm.image} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                  </div>
                </div>
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

              {/* Modal Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", paddingTop: "14px", borderTop: "1px solid #EDE3D4" }}>
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
    </div>
  );
}
