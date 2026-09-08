"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AdminNavigationItem,
  NavigationItemType,
  NavigationMenuLocation,
  MOCK_PAGES_LIBRARY,
  MOCK_CATEGORIES_LIBRARY,
  MOCK_PRODUCTS_LIBRARY,
  MOCK_POLICIES_LIBRARY,
  MockResourceItem,
} from "./navigation-types";

interface NavigationItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: AdminNavigationItem) => void;
  initialItem?: AdminNavigationItem | null;
  allItems: AdminNavigationItem[];
  defaultLocation?: NavigationMenuLocation;
  defaultParentId?: string | null;
}

export function NavigationItemModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
  allItems,
  defaultLocation = "HEADER",
  defaultParentId = null,
}: NavigationItemModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<NavigationItemType>("PAGE");
  const [location, setLocation] = useState<NavigationMenuLocation>(defaultLocation);
  const [parentId, setParentId] = useState<string | null>(defaultParentId);
  const [isActive, setIsActive] = useState(true);
  const [targetBlank, setTargetBlank] = useState(false);
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  // Resource picker search
  const [resourceSearch, setResourceSearch] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title);
      setUrl(initialItem.url);
      setType(initialItem.type);
      setLocation(initialItem.location);
      setParentId(initialItem.parentId || null);
      setIsActive(initialItem.isActive);
      setTargetBlank(!!initialItem.targetBlank);
      setBadge(initialItem.badge || "");
      setDescription(initialItem.description || "");
      setSortOrder(initialItem.sortOrder || 1);
      setSelectedResourceId(initialItem.resourceId || null);
    } else {
      setTitle("");
      setUrl("/");
      setType("PAGE");
      setLocation(defaultLocation);
      setParentId(defaultParentId);
      setIsActive(true);
      setTargetBlank(false);
      setBadge("");
      setDescription("");
      setSortOrder(allItems.length + 1);
      setSelectedResourceId(null);
    }
    setResourceSearch("");
  }, [initialItem, isOpen, defaultLocation, defaultParentId, allItems.length]);

  // Available top-level parents in this location
  const availableParents = useMemo(() => {
    return allItems.filter(
      (item) =>
        item.location === location &&
        !item.parentId &&
        (!initialItem || item.id !== initialItem.id)
    );
  }, [allItems, location, initialItem]);

  // Current Resource Library items
  const currentLibraryItems = useMemo<MockResourceItem[]>(() => {
    switch (type) {
      case "PAGE":
        return MOCK_PAGES_LIBRARY;
      case "CATEGORY":
        return MOCK_CATEGORIES_LIBRARY;
      case "PRODUCT":
        return MOCK_PRODUCTS_LIBRARY;
      case "POLICY":
        return MOCK_POLICIES_LIBRARY;
      default:
        return [];
    }
  }, [type]);

  // Filtered resource items by search query
  const filteredLibraryItems = useMemo(() => {
    if (!resourceSearch.trim()) return currentLibraryItems;
    const q = resourceSearch.toLowerCase();
    return currentLibraryItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  }, [currentLibraryItems, resourceSearch]);

  const handleSelectResource = (item: MockResourceItem) => {
    setSelectedResourceId(item.id);
    setTitle(item.title);
    setUrl(item.url);
    if (item.badge && !badge) {
      setBadge(item.badge);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a menu title/label.");
      return;
    }
    if (!url.trim()) {
      alert("Please provide a destination URL.");
      return;
    }

    const newItem: AdminNavigationItem = {
      id: initialItem ? initialItem.id : `nav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      url: url.trim(),
      type,
      location,
      parentId: parentId || null,
      sortOrder: Number(sortOrder) || 1,
      isActive,
      targetBlank,
      badge: badge.trim() || undefined,
      description: description.trim() || undefined,
      resourceId: selectedResourceId || undefined,
      children: initialItem?.children,
    };

    onSave(newItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #D68A45 0%, #B8702A 100%)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "15px",
                boxShadow: "0 2px 6px rgba(184, 112, 42, 0.3)",
              }}
            >
              🧭
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#2E1A0C" }}>
                {initialItem ? `Edit Navigation Item: "${initialItem.title}"` : "Add Navigation Menu Item"}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6B6B6B" }}>
                Configure destination page, category, product, or custom URL.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
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

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "20px 24px",
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* 1. Destination Type Tabs */}
          <div>
            <label style={{ fontSize: "11px", fontWeight: 800, color: "#8E8880", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
              1. Choose Destination Type
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "8px",
                background: "#F7F2EC",
                padding: "5px",
                borderRadius: "12px",
                border: "1px solid #EDE3D4",
              }}
            >
              {(
                [
                  { key: "PAGE", label: "Page", icon: "📄" },
                  { key: "CATEGORY", label: "Category", icon: "📦" },
                  { key: "PRODUCT", label: "Product", icon: "🏷️" },
                  { key: "POLICY", label: "Policy", icon: "📜" },
                  { key: "CUSTOM_URL", label: "Custom", icon: "🔗" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setType(tab.key);
                    setSelectedResourceId(null);
                    setResourceSearch("");
                  }}
                  style={{
                    padding: "8px 4px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    background: type === tab.key ? "#5C3A22" : "transparent",
                    color: type === tab.key ? "#FFFFFF" : "#5C3A22",
                    boxShadow: type === tab.key ? "0 2px 6px rgba(92,58,34,0.25)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interactive Resource Picker / Search (if not custom URL) */}
          {type !== "CUSTOM_URL" && (
            <div
              style={{
                background: "#FAF7F2",
                border: "1px solid #EDE3D4",
                borderRadius: "12px",
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#2E1A0C" }}>
                  Select from {type === "PAGE" ? "Store Pages" : type === "CATEGORY" ? "Categories" : type === "PRODUCT" ? "Live Products (48 catalog items)" : "Policies"}
                </span>
                <span style={{ fontSize: "11px", color: "#8E8880" }}>
                  Click an item to auto-fill title and URL
                </span>
              </div>

              {/* Search bar */}
              <input
                type="text"
                placeholder={`Search ${type.toLowerCase()}s by name or keyword...`}
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1C7BD",
                  fontSize: "12px",
                  background: "#FFFFFF",
                  color: "#2E1A0C",
                  boxSizing: "border-box",
                  marginBottom: "8px",
                }}
              />

              {/* Resource List */}
              <div style={{ maxHeight: "170px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                {filteredLibraryItems.length === 0 ? (
                  <div style={{ padding: "16px", textAlign: "center", fontSize: "12px", color: "#8E8880" }}>
                    No {type.toLowerCase()} found matching &quot;{resourceSearch}&quot;
                  </div>
                ) : (
                  filteredLibraryItems.map((item) => {
                    const isSelected = selectedResourceId === item.id || url === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResource(item)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: isSelected ? "#F3EDE6" : "#FFFFFF",
                          border: isSelected ? "1.5px solid #5C3A22" : "1px solid #EDE3D4",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{
                                width: "28px",
                                height: "28px",
                                objectFit: "contain",
                                borderRadius: "6px",
                                border: "1px solid #EDE3D4",
                                background: "#FFF",
                              }}
                            />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C" }}>
                                {item.title}
                              </span>
                              {item.badge && (
                                <span style={{ background: "#D68A45", color: "#FFF", fontSize: "9px", fontWeight: 800, padding: "1px 5px", borderRadius: "4px" }}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.subtitle && (
                              <div style={{ fontSize: "11px", color: "#8E8880", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                        </div>

                        <code style={{ fontSize: "11px", fontFamily: "monospace", color: "#5C3A22", background: "#FAF7F2", padding: "2px 6px", borderRadius: "4px" }}>
                          {item.url}
                        </code>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 3. Title & URL Inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C", display: "block", marginBottom: "4px" }}>
                Menu Label / Title <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mailer Boxes, Bulk Orders"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1C7BD",
                  fontSize: "13px",
                  color: "#2E1A0C",
                  background: "#FFFFFF",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C", display: "block", marginBottom: "4px" }}>
                Destination URL / Path <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. /category/mailer-boxes"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1C7BD",
                  fontSize: "13px",
                  fontFamily: "monospace",
                  color: "#2E1A0C",
                  background: "#FFFFFF",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* 4. Menu Location & Parent Menu Nesting */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C", display: "block", marginBottom: "4px" }}>
                Navigation Location
              </label>
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value as NavigationMenuLocation);
                  setParentId(null);
                }}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1C7BD",
                  fontSize: "13px",
                  color: "#2E1A0C",
                  background: "#FFFFFF",
                  boxSizing: "border-box",
                }}
              >
                <option value="HEADER">Header Main Navigation</option>
                <option value="CATEGORY_MENU">Category Quick-Bar</option>
                <option value="MOBILE_DRAWER">Mobile Drawer Menu</option>
                <option value="FOOTER_PRODUCTS">Footer — Products Column</option>
                <option value="FOOTER_INDUSTRIES">Footer — Industries Column</option>
                <option value="FOOTER_SUPPORT">Footer — Support &amp; Policies</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C", display: "block", marginBottom: "4px" }}>
                Parent Dropdown Menu
              </label>
              <select
                value={parentId || ""}
                onChange={(e) => setParentId(e.target.value || null)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1C7BD",
                  fontSize: "13px",
                  color: "#2E1A0C",
                  background: "#FFFFFF",
                  boxSizing: "border-box",
                }}
              >
                <option value="">None (Top Level Root Item)</option>
                {availableParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    ↳ Under &quot;{parent.title}&quot; (Dropdown Sub-item)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Highlight Badge & Subtitle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C" }}>
                  Highlight Pill Badge (Optional)
                </label>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["HOT", "NEW", "SALE", "20% OFF", "3D"].map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => setBadge(badge === pill ? "" : pill)}
                      style={{
                        padding: "2px 6px",
                        fontSize: "9px",
                        fontWeight: 800,
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                        background: badge === pill ? "#5C3A22" : "#EDE3D4",
                        color: badge === pill ? "#FFFFFF" : "#5C3A22",
                      }}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g. HOT, POPULAR, NEW"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1C7BD",
                  fontSize: "13px",
                  color: "#2E1A0C",
                  background: "#FFFFFF",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C", display: "block", marginBottom: "4px" }}>
                Subtitle / Description (Dropdown Sub-items)
              </label>
              <input
                type="text"
                placeholder="Short descriptive snippet for dropdowns"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1C7BD",
                  fontSize: "13px",
                  color: "#2E1A0C",
                  background: "#FFFFFF",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* 6. Settings Toggles */}
          <div
            style={{
              background: "#FAF7F2",
              border: "1px solid #EDE3D4",
              borderRadius: "10px",
              padding: "12px 16px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 700, color: "#2E1A0C" }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#5C3A22" }}
              />
              Visible on Storefront (Active)
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px", color: "#6B6B6B" }}>
              <input
                type="checkbox"
                checked={targetBlank}
                onChange={(e) => setTargetBlank(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#5C3A22" }}
              />
              Open in new tab (`target=&quot;_blank&quot;`)
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#6B6B6B" }}>
              <span>Sort Priority:</span>
              <input
                type="number"
                min={1}
                max={99}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                style={{
                  width: "50px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid #D1C7BD",
                  fontSize: "12px",
                  textAlign: "center",
                  background: "#FFFFFF",
                }}
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div
          style={{
            padding: "16px 24px",
            background: "#FAF7F2",
            borderTop: "1px solid #EDE3D4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: "12px", color: "#8E8880" }}>
            Route: <code style={{ color: "#5C3A22", fontWeight: 700 }}>{url || "/"}</code>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 16px",
                borderRadius: "10px",
                border: "1px solid #D1C7BD",
                background: "#FFFFFF",
                color: "#5C3A22",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#5C3A22",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(92,58,34,0.25)",
              }}
            >
              {initialItem ? "Save Changes" : "Create Menu Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
