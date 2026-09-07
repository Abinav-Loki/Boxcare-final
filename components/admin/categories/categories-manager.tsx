"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminCategory, INITIAL_STOREFRONT_CATEGORIES } from "./category-types";
import { CategoryProductsView } from "./category-products-view";

interface CategoriesManagerProps {
  initialSelectedSlug?: string;
}

export function CategoriesManager({ initialSelectedSlug }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_STOREFRONT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(() => {
    if (initialSelectedSlug) {
      return INITIAL_STOREFRONT_CATEGORIES.find((c) => c.slug === initialSelectedSlug) || null;
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "/images/mailer-boxes.png",
    description: "",
    sortOrder: 1,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    stockStatus: "IN_STOCK" as "IN_STOCK" | "OUT_OF_STOCK",
    featured: false,
  });

  const availableImages = [
    { label: "Mailer Boxes", url: "/images/mailer-boxes.png" },
    { label: "Corrugated Boxes", url: "/images/corrugated-boxes.png" },
    { label: "Shipping Boxes", url: "/images/shipping-boxes.png" },
    { label: "Custom Printed Boxes", url: "/images/custom-printed-boxes.png" },
    { label: "Pizza Boxes", url: "/images/pizza-boxes.png" },
    { label: "Mono Cartons", url: "/images/mono-cartons.png" },
    { label: "Tape Rolls", url: "/images/tape-rolls.png" },
    { label: "Bubble Wrap", url: "/images/bubble-wrap.png" },
    { label: "Corrugated Rolls", url: "/images/corrugated-rolls.png" },
    { label: "Courier Bags", url: "/images/courier-bags.png" },
  ];

  const handleDeleteCategory = (id: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete the category "${name}"? This action cannot be undone.`)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (selectedCategory && selectedCategory.id === id) {
        setSelectedCategory(null);
      }
      setIsModalOpen(false);
    }
  };

  const handleToggleStockStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              stockStatus: c.stockStatus === "IN_STOCK" ? "OUT_OF_STOCK" : "IN_STOCK",
            }
          : c
      )
    );
  };

  // If a category is clicked/selected, render the CategoryProductsView
  if (selectedCategory) {
    return (
      <CategoryProductsView
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        onDeleteCategory={(catId, catName) => handleDeleteCategory(catId, catName)}
      />
    );
  }

  // Filtered categories
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "ACTIVE") return matchesSearch && cat.status === "ACTIVE";
    if (statusFilter === "INACTIVE") return matchesSearch && cat.status === "INACTIVE";
    if (statusFilter === "OUT_OF_STOCK") return matchesSearch && cat.stockStatus === "OUT_OF_STOCK";
    return matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      image: "/images/mailer-boxes.png",
      description: "",
      sortOrder: categories.length + 1,
      status: "ACTIVE",
      stockStatus: "IN_STOCK",
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: AdminCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      description: cat.description,
      sortOrder: cat.sortOrder,
      status: cat.status,
      stockStatus: cat.stockStatus || "IN_STOCK",
      featured: cat.featured,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slug,
    }));
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      // Update existing
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                ...formData,
              }
            : c
        )
      );
    } else {
      // Add new
      const newCat: AdminCategory = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.slug || "new-category",
        image: formData.image,
        description: formData.description || "Packaging catalog category.",
        productCount: 0,
        sortOrder: Number(formData.sortOrder) || categories.length + 1,
        status: formData.status,
        stockStatus: formData.stockStatus,
        featured: formData.featured,
      };
      setCategories((prev) => [newCat, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : c
      )
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Header & Quick Summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#2B2B2B", margin: 0, letterSpacing: "-0.02em" }}>
              Storefront Categories
            </h1>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#F7F2EC", color: "#5C3A22", border: "1px solid #EDE3D4" }}>
              {categories.length} Categories
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#6B6B6B", margin: "4px 0 0 0" }}>
            Manage category inventory stock status, storefront collections, and respective products.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleOpenAddModal}
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
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Controls Bar */}
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
        {/* Search input */}
        <div style={{ width: "300px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search categories by name or slug..."
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

        {/* Filter & View Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Status Filter */}
          <div style={{ display: "flex", background: "#F7F2EC", padding: "3px", borderRadius: "8px", border: "1px solid #EDE3D4", gap: "2px" }}>
            {[
              { id: "ALL", label: "All" },
              { id: "ACTIVE", label: "Active" },
              { id: "INACTIVE", label: "Inactive" },
              { id: "OUT_OF_STOCK", label: "Out of Stock" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                style={{
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: statusFilter === tab.id ? "#5C3A22" : "transparent",
                  color: statusFilter === tab.id ? "#FFFFFF" : "#6B6B6B",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Switcher */}
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
              Card Grid
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
              Table List
            </button>
          </div>
        </div>
      </div>

      {/* 3. Categories Render (Card Grid View) */}
      {viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredCategories.map((cat) => {
            const isOutOfStock = cat.stockStatus === "OUT_OF_STOCK";
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  border: isOutOfStock ? "1px solid #FECACA" : "1px solid #EDE3D4",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(43,43,43,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  opacity: isOutOfStock ? 0.92 : 1,
                }}
              >
                {/* Dedicated Top Status Strip (Zero Overlap with Image) */}
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
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "6px",
                        background: cat.status === "ACTIVE" ? "#ECFDF5" : "#F3F4F6",
                        color: cat.status === "ACTIVE" ? "#059669" : "#6B7280",
                        border: `1px solid ${cat.status === "ACTIVE" ? "#A7F3D0" : "#E5E7EB"}`,
                      }}
                    >
                      {cat.status === "ACTIVE" ? "● Visible" : "○ Hidden"}
                    </span>

                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "6px",
                        background: isOutOfStock ? "#FEE2E2" : "#EFF6FF",
                        color: isOutOfStock ? "#DC2626" : "#2563EB",
                        border: `1px solid ${isOutOfStock ? "#FECACA" : "#BFDBFE"}`,
                      }}
                    >
                      {isOutOfStock ? "Out of Stock" : "In Stock"}
                    </span>
                  </div>

                  {cat.featured && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "6px",
                        background: "#FEF3C7",
                        color: "#D97706",
                        border: "1px solid #FDE68A",
                      }}
                    >
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Clean Image Container (No overlapping badges) */}
                <div
                  style={{
                    height: "140px",
                    background: isOutOfStock ? "#FEF2F2" : "#F7F2EC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px",
                    borderBottom: "1px solid #EDE3D4",
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "80%",
                      objectFit: "contain",
                      filter: isOutOfStock ? "grayscale(40%) drop-shadow(0 4px 8px rgba(0,0,0,0.08))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.08))",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/200x150/F7F2EC/5C3A22?text=Packaging+Box";
                    }}
                  />
                </div>

                {/* Category Details */}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#2B2B2B", margin: 0 }}>
                        {cat.name}
                      </h3>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#5C3A22", background: "#FDF4EB", padding: "2px 6px", borderRadius: "6px", border: "1px solid #EDE3D4", whiteSpace: "nowrap" }}>
                        {cat.productCount} SKUs
                      </span>
                    </div>

                    <div style={{ fontSize: "11px", color: "#8E8880", fontFamily: "monospace", marginBottom: "8px" }}>
                      /category/{cat.slug}
                    </div>

                    <p style={{ fontSize: "11px", color: "#6B6B6B", lineHeight: "1.4", margin: 0, minHeight: "32px" }}>
                      {cat.description}
                    </p>
                  </div>

                  {/* Card Actions Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", marginTop: "14px", borderTop: "1px solid #F7F2EC" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#5C3A22", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <span>View Products</span>
                      <span>→</span>
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {/* 1-Click Toggle Out of Stock */}
                      <button
                        onClick={(e) => handleToggleStockStatus(cat.id, e)}
                        title={isOutOfStock ? "Mark as In Stock" : "Mark as Out of Stock"}
                        style={{
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: isOutOfStock ? "#ECFDF5" : "#FEF2F2",
                          border: `1px solid ${isOutOfStock ? "#A7F3D0" : "#FECACA"}`,
                          borderRadius: "6px",
                          color: isOutOfStock ? "#059669" : "#DC2626",
                          cursor: "pointer",
                        }}
                      >
                        {isOutOfStock ? "+ In Stock" : "Out of Stock"}
                      </button>

                      <button
                        onClick={(e) => handleOpenEditModal(cat, e)}
                        style={{
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: "#5C3A22",
                          border: "none",
                          borderRadius: "6px",
                          color: "#FFFFFF",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDeleteCategory(cat.id, cat.name, e)}
                        title="Delete Category"
                        style={{
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: "#FEE2E2",
                          border: "1px solid #FECACA",
                          borderRadius: "6px",
                          color: "#DC2626",
                          cursor: "pointer",
                        }}
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
        /* 4. Categories Table View */
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
                  <th style={{ padding: "12px 20px" }}>Order</th>
                  <th style={{ padding: "12px 20px" }}>Image</th>
                  <th style={{ padding: "12px 20px" }}>Category Name</th>
                  <th style={{ padding: "12px 20px" }}>Slug</th>
                  <th style={{ padding: "12px 20px" }}>Stock Status</th>
                  <th style={{ padding: "12px 20px" }}>Visibility</th>
                  <th style={{ padding: "12px 20px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "12px" }}>
                {filteredCategories.map((cat, i) => {
                  const isOutOfStock = cat.stockStatus === "OUT_OF_STOCK";
                  return (
                    <tr
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        borderBottom: i === filteredCategories.length - 1 ? "none" : "1px solid #EDE3D4",
                        background: isOutOfStock ? "#FFFDFD" : "#FFFFFF",
                        cursor: "pointer",
                      }}
                    >
                      <td style={{ padding: "12px 20px", fontWeight: 700, color: "#8E8880" }}>
                        #{cat.sortOrder}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "#F7F2EC", border: "1px solid #EDE3D4", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={cat.image} alt={cat.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                        </div>
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ fontWeight: 700, color: "#2B2B2B" }}>{cat.name}</div>
                        <div style={{ fontSize: "11px", color: "#8E8880", maxWidth: "260px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {cat.description}
                        </div>
                      </td>
                      <td style={{ padding: "12px 20px", fontFamily: "monospace", color: "#5C3A22" }}>
                        /category/{cat.slug}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <button
                          onClick={(e) => handleToggleStockStatus(cat.id, e)}
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: isOutOfStock ? "#FEE2E2" : "#ECFDF5",
                            color: isOutOfStock ? "#DC2626" : "#059669",
                            border: `1px solid ${isOutOfStock ? "#FECACA" : "#A7F3D0"}`,
                            cursor: "pointer",
                          }}
                        >
                          {isOutOfStock ? "Out of Stock" : "In Stock"}
                        </button>
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: "6px",
                            background: cat.status === "ACTIVE" ? "#ECFDF5" : "#F3F4F6",
                            color: cat.status === "ACTIVE" ? "#059669" : "#6B7280",
                            border: `1px solid ${cat.status === "ACTIVE" ? "#A7F3D0" : "#E5E7EB"}`,
                          }}
                        >
                          {cat.status === "ACTIVE" ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 20px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleOpenEditModal(cat, e)}
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
                            onClick={(e) => handleDeleteCategory(cat.id, cat.name, e)}
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
                            title="Delete Category"
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

      {/* 5. Add / Edit Category Modal */}
      {isModalOpen && (
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
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              border: "1px solid #EDE3D4",
              maxWidth: "520px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid #EDE3D4", paddingBottom: "12px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#2B2B2B", margin: 0 }}>
                {editingCategory ? "Edit Category" : "Add Storefront Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: "18px", color: "#8E8880", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mailer Boxes"
                  value={formData.name}
                  onChange={handleNameChange}
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
                  URL Slug (/category/...) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mailer-boxes"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
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

              {/* Storefront Image Asset Selection */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  Storefront Box Image Asset
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
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
                    {availableImages.map((img) => (
                      <option key={img.url} value={img.url}>
                        {img.label} ({img.url})
                      </option>
                    ))}
                  </select>
                  <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "#F7F2EC", border: "1px solid #EDE3D4", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}>
                    <img src={formData.image} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                  Description / SEO Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for customer storefront..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
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

              {/* Stock Status & Visibility */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Inventory Stock Status
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stockStatus: e.target.value as "IN_STOCK" | "OUT_OF_STOCK" }))}
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
                    <option value="IN_STOCK">In Stock (Available)</option>
                    <option value="OUT_OF_STOCK">Out of Stock (Sold Out)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A4A4A", marginBottom: "4px" }}>
                    Storefront Visibility
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as "ACTIVE" | "INACTIVE" }))}
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
                    <option value="ACTIVE">Active (Visible)</option>
                    <option value="INACTIVE">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div style={{ display: "flex", justifyContent: editingCategory ? "space-between" : "flex-end", alignItems: "center", gap: "10px", marginTop: "12px", paddingTop: "14px", borderTop: "1px solid #EDE3D4" }}>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(editingCategory.id, editingCategory.name)}
                    style={{
                      padding: "8px 14px",
                      background: "#FEE2E2",
                      border: "1px solid #FECACA",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#DC2626",
                      cursor: "pointer",
                    }}
                  >
                    Delete Category
                  </button>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                    {editingCategory ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
