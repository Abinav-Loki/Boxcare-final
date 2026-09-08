"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  AdminNavigationItem,
  NavigationItemType,
  NavigationMenuLocation,
  INITIAL_NAVIGATION_DATA,
} from "./navigation-types";
import { NavigationTreeList } from "./navigation-tree-list";
import { NavigationItemModal } from "./navigation-item-modal";
import { NavigationDeleteModal } from "./navigation-delete-modal";
import { NavigationPreviewPane } from "./navigation-preview-pane";
import {
  getAdminNavigationAction,
  createAdminNavigationItemAction,
  updateAdminNavigationItemAction,
  deleteAdminNavigationItemAction,
  reorderAdminNavigationAction,
} from "@/app/actions/admin-navigation";
import { useAdminConfirm } from "@/components/admin/common/admin-confirm-dialog";

export function NavigationManager() {
  const { confirmAction, ConfirmDialog } = useAdminConfirm();
  const [items, setItems] = useState<AdminNavigationItem[]>(INITIAL_NAVIGATION_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLocationTab, setActiveLocationTab] = useState<"ALL" | NavigationMenuLocation>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | NavigationItemType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "HIDDEN">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [mainViewMode, setMainViewMode] = useState<"structure" | "preview" | "split">("structure");

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminNavigationItem | null>(null);
  const [defaultParentForNew, setDefaultParentForNew] = useState<{ id: string; title: string } | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string; title: string } | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadNavigation = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminNavigationAction();
      if (res.success && res.data && res.data.length > 0) {
        setItems(res.data as any);
      }
    } catch (err) {
      console.error("Failed to load navigation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNavigation();
  }, []);

  // 1. KPI Stats Calculation
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.isActive).length;
    const dropdownParents = items.filter((i) => !i.parentId && items.some((c) => c.parentId === i.id)).length;
    const linkedCatalog = items.filter((i) => i.type === "CATEGORY" || i.type === "PRODUCT").length;

    return { total, active, dropdownParents, linkedCatalog };
  }, [items]);

  // 2. Filter & Search Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Location tab filter
      if (activeLocationTab !== "ALL" && item.location !== activeLocationTab) {
        return false;
      }
      // Type filter
      if (typeFilter !== "ALL" && item.type !== typeFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === "ACTIVE" && !item.isActive) return false;
      if (statusFilter === "HIDDEN" && item.isActive) return false;

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSelf =
          item.title.toLowerCase().includes(q) ||
          item.url.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q));

        if (matchesSelf) return true;

        const isParentOfMatching = items.some(
          (child) => child.parentId === item.id && (child.title.toLowerCase().includes(q) || child.url.toLowerCase().includes(q))
        );
        return isParentOfMatching;
      }

      return true;
    });
  }, [items, activeLocationTab, typeFilter, statusFilter, searchQuery]);

  // 3. Handlers
  const handleSaveItem = (savedItem: AdminNavigationItem) => {
    const payload = {
      label: savedItem.title,
      location: savedItem.location as any,
      type: savedItem.type as any,
      destination: savedItem.url,
      sortOrder: savedItem.sortOrder,
      isActive: savedItem.isActive,
    };

    confirmAction({
      title: editingItem ? `Update Menu Item: ${savedItem.title}` : `Add Menu Item: ${savedItem.title}`,
      message: "Are you sure you want to do this?",
      description: `Commit navigation link "${savedItem.title}" to the database.`,
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        if (editingItem) {
          setItems((prev) => prev.map((item) => (item.id === savedItem.id ? savedItem : item)));
          showToast(`✓ Updated navigation item "${savedItem.title}"`);
          const res = await updateAdminNavigationItemAction(savedItem.id, payload);
          if (!res.success) {
            showToast(`⚠️ Sync notice: ${res.error}`);
            loadNavigation();
          }
        } else {
          setItems((prev) => [...prev, savedItem]);
          showToast(`🎉 Added new menu item "${savedItem.title}"`);
          const res = await createAdminNavigationItemAction(payload);
          if (!res.success) {
            showToast(`⚠️ Sync notice: ${res.error}`);
            loadNavigation();
          }
        }
        setEditingItem(null);
        setDefaultParentForNew(null);
        setIsFormOpen(false);
      },
    });
  };

  const handleToggleActive = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const newStatus = !target.isActive;

    confirmAction({
      title: `${newStatus ? "Show" : "Hide"} Menu Item: ${target.title}`,
      message: "Are you sure you want to do this?",
      description: `Change navigation visibility to ${newStatus ? "Visible" : "Hidden"}.`,
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isActive: newStatus } : item))
        );
        showToast(`"${target.title}" is now ${newStatus ? "Visible on Storefront 👁️" : "Hidden 🙈"}`);

        const res = await updateAdminNavigationItemAction(id, { isActive: newStatus });
        if (!res.success) {
          showToast(`⚠️ Sync notice: ${res.error}`);
          loadNavigation();
        }
      },
    });
  };

  const handleMoveUp = (id: string) => {
    const itemToMove = items.find((i) => i.id === id);
    if (!itemToMove) return;

    const siblings = items
      .filter((i) => i.location === itemToMove.location && i.parentId === itemToMove.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const currentIndex = siblings.findIndex((i) => i.id === id);
    if (currentIndex <= 0) return;

    const prevSibling = siblings[currentIndex - 1];

    confirmAction({
      title: `Reorder Menu Item: ${itemToMove.title}`,
      message: "Are you sure you want to do this?",
      description: `Move "${itemToMove.title}" up in navigation ordering.`,
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        const newItems = items.map((item) => {
          if (item.id === itemToMove.id) return { ...item, sortOrder: prevSibling.sortOrder };
          if (item.id === prevSibling.id) return { ...item, sortOrder: itemToMove.sortOrder };
          return item;
        });

        setItems(newItems);
        showToast("Reordered item up ↑");

        await reorderAdminNavigationAction([
          { id: itemToMove.id, sortOrder: prevSibling.sortOrder },
          { id: prevSibling.id, sortOrder: itemToMove.sortOrder },
        ]);
      },
    });
  };

  const handleMoveDown = (id: string) => {
    const itemToMove = items.find((i) => i.id === id);
    if (!itemToMove) return;

    const siblings = items
      .filter((i) => i.location === itemToMove.location && i.parentId === itemToMove.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const currentIndex = siblings.findIndex((i) => i.id === id);
    if (currentIndex < 0 || currentIndex >= siblings.length - 1) return;

    const nextSibling = siblings[currentIndex + 1];

    confirmAction({
      title: `Reorder Menu Item: ${itemToMove.title}`,
      message: "Are you sure you want to do this?",
      description: `Move "${itemToMove.title}" down in navigation ordering.`,
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        const newItems = items.map((item) => {
          if (item.id === itemToMove.id) return { ...item, sortOrder: nextSibling.sortOrder };
          if (item.id === nextSibling.id) return { ...item, sortOrder: itemToMove.sortOrder };
          return item;
        });

        setItems(newItems);
        showToast("Reordered item down ↓");

        await reorderAdminNavigationAction([
          { id: itemToMove.id, sortOrder: nextSibling.sortOrder },
          { id: nextSibling.id, sortOrder: itemToMove.sortOrder },
        ]);
      },
    });
  };

  const handleDeleteItem = (target: { id: string; title: string }) => {
    confirmAction({
      title: `Delete Menu Item: ${target.title}`,
      message: "This action cannot be undone. Are you sure you want to delete this?",
      description: `Navigation item "${target.title}" and its children will be permanently removed.`,
      confirmLabel: "Continue to Verify",
      isDelete: true,
      onConfirm: async () => {
        setItems((prev) => prev.filter((item) => item.id !== target.id && item.parentId !== target.id));
        setDeletingItem(null);
        showToast(`🗑️ Deleted "${target.title}"`);

        const res = await deleteAdminNavigationItemAction(target.id);
        if (!res.success) {
          showToast(`⚠️ Sync notice: ${res.error}`);
          loadNavigation();
        }
      },
    });
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all BoxCare navigation menus to default seed layout? Custom changes will be restored.")) {
      setItems(INITIAL_NAVIGATION_DATA);
      showToast("🔄 Navigation reset to factory defaults.");
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(items, null, 2);
    navigator.clipboard.writeText(dataStr);
    showToast("📋 Navigation JSON config copied to clipboard!");
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
            <span style={{ color: "#5C3A22" }}>Navigation Manager</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#2E1A0C", margin: 0, letterSpacing: "-0.02em" }}>
              Storefront Navigation
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
              {items.length} Menu Links
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#6B6B6B", margin: "4px 0 0 0" }}>
            Configure main header navigation, mega dropdowns, quick category strip, mobile drawer, and footer columns.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleResetDefaults}
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
            <span>🔄</span>
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
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
            <span>📋</span>
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setDefaultParentForNew(null);
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
            <span>Add Navigation Item</span>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px" }}>
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
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Total Menu Items</span>
            <span style={{ fontSize: "18px" }}>🧭</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#2E1A0C", marginTop: "4px" }}>
            {stats.total}
          </div>
          <span style={{ fontSize: "11px", color: "#666" }}>Configured across store</span>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#065F46" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Active Links</span>
            <span style={{ fontSize: "18px" }}>👁️</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#065F46", marginTop: "4px" }}>
            {stats.active}
          </div>
          <span style={{ fontSize: "11px", color: "#666" }}>Visible to storefront buyers</span>
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
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Dropdown Parents</span>
            <span style={{ fontSize: "18px" }}>📂</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#D68A45", marginTop: "4px" }}>
            {stats.dropdownParents}
          </div>
          <span style={{ fontSize: "11px", color: "#666" }}>With nested sub-menus</span>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6B21A8" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Linked Catalog</span>
            <span style={{ fontSize: "18px" }}>📦</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#6B21A8", marginTop: "4px" }}>
            {stats.linkedCatalog}
          </div>
          <span style={{ fontSize: "11px", color: "#666" }}>Categories &amp; live products</span>
        </div>
      </div>

      {/* 4. Main View Mode Tabs (Structure vs Live Preview vs Split) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          background: "#FFFFFF",
          border: "1px solid #EDE3D4",
          borderRadius: "14px",
          padding: "8px 12px",
        }}
      >
        {/* Main View Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setMainViewMode("structure")}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: mainViewMode === "structure" ? "#5C3A22" : "transparent",
              color: mainViewMode === "structure" ? "#FFFFFF" : "#5C3A22",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: mainViewMode === "structure" ? "0 2px 6px rgba(92,58,34,0.2)" : "none",
            }}
          >
            <span>☰</span>
            <span>Menu Structure Tree</span>
          </button>

          <button
            type="button"
            onClick={() => setMainViewMode("preview")}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: mainViewMode === "preview" ? "#5C3A22" : "transparent",
              color: mainViewMode === "preview" ? "#FFFFFF" : "#5C3A22",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: mainViewMode === "preview" ? "0 2px 6px rgba(92,58,34,0.2)" : "none",
            }}
          >
            <span>👁️</span>
            <span>Live Storefront Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setMainViewMode("split")}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: mainViewMode === "split" ? "#5C3A22" : "transparent",
              color: mainViewMode === "split" ? "#FFFFFF" : "#5C3A22",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: mainViewMode === "split" ? "0 2px 6px rgba(92,58,34,0.2)" : "none",
            }}
          >
            <span>◫</span>
            <span>Split View</span>
          </button>
        </div>

        {/* Location Quick Filter Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {(
            [
              { key: "ALL", label: "All Locations" },
              { key: "HEADER", label: "Header Main" },
              { key: "CATEGORY_MENU", label: "Category Bar" },
              { key: "MOBILE_DRAWER", label: "Mobile Drawer" },
              { key: "FOOTER_PRODUCTS", label: "Footer: Products" },
              { key: "FOOTER_INDUSTRIES", label: "Footer: Industries" },
              { key: "FOOTER_SUPPORT", label: "Footer: Support" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveLocationTab(tab.key)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: activeLocationTab === tab.key ? "#D68A45" : "#F7F2EC",
                color: activeLocationTab === tab.key ? "#FFFFFF" : "#5C3A22",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Search & Dropdown Filters Bar */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search input */}
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <span style={{ position: "absolute", left: "14px", top: "10px", color: "#8E8880", fontSize: "14px" }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search navigation by label, route URL, badge or keyword..."
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

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
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
          <option value="ALL">All Link Types</option>
          <option value="PAGE">📄 Pages</option>
          <option value="CATEGORY">📦 Categories</option>
          <option value="PRODUCT">🏷️ Products</option>
          <option value="POLICY">📜 Policies</option>
          <option value="CUSTOM_URL">🔗 Custom URLs</option>
        </select>

        {/* Status filter */}
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
          <option value="ALL">All Status</option>
          <option value="ACTIVE">👁️ Visible (Active)</option>
          <option value="HIDDEN">🙈 Hidden</option>
        </select>
      </div>

      {/* 6. Main Content Layout */}
      {mainViewMode === "structure" && (
        <div>
          <NavigationTreeList
            items={filteredItems}
            onEdit={(item) => {
              setEditingItem(item);
              setIsFormOpen(true);
            }}
            onDelete={(id, title) => {
              handleDeleteItem({ id, title });
            }}
            onToggleActive={handleToggleActive}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onAddSubItem={(parentId, parentTitle) => {
              setDefaultParentForNew({ id: parentId, title: parentTitle });
              setEditingItem(null);
              setIsFormOpen(true);
            }}
          />
        </div>
      )}

      {mainViewMode === "preview" && (
        <div>
          <NavigationPreviewPane
            items={items}
            onEditItem={(item) => {
              setEditingItem(item);
              setIsFormOpen(true);
            }}
          />
        </div>
      )}

      {mainViewMode === "split" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#8E8880", textTransform: "uppercase", marginBottom: "10px" }}>
              Menu Structure ({filteredItems.length} items)
            </div>
            <NavigationTreeList
              items={filteredItems}
              onEdit={(item) => {
                setEditingItem(item);
                setIsFormOpen(true);
              }}
              onDelete={(id, title) => {
                handleDeleteItem({ id, title });
              }}
              onToggleActive={handleToggleActive}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onAddSubItem={(parentId, parentTitle) => {
                setDefaultParentForNew({ id: parentId, title: parentTitle });
                setEditingItem(null);
                setIsFormOpen(true);
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#8E8880", textTransform: "uppercase", marginBottom: "10px" }}>
              Live Storefront Preview
            </div>
            <NavigationPreviewPane
              items={items}
              onEditItem={(item) => {
                setEditingItem(item);
                setIsFormOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 7. Modal Form (Add / Edit) */}
      <NavigationItemModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
          setDefaultParentForNew(null);
        }}
        onSave={handleSaveItem}
        initialItem={editingItem}
        allItems={items}
        defaultLocation={activeLocationTab === "ALL" ? "HEADER" : activeLocationTab}
        defaultParentId={defaultParentForNew?.id || null}
      />

      {/* Global 2-Step Action & Password Confirmation Dialog */}
      {ConfirmDialog}
    </div>
  );
}
