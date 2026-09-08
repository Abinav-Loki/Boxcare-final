"use client";

import React from "react";
import { AdminNavigationItem, NavigationItemType } from "./navigation-types";

interface NavigationTreeListProps {
  items: AdminNavigationItem[];
  onEdit: (item: AdminNavigationItem) => void;
  onDelete: (id: string, title: string) => void;
  onToggleActive: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAddSubItem: (parentId: string, parentTitle: string) => void;
}

export function NavigationTreeList({
  items,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
  onAddSubItem,
}: NavigationTreeListProps) {
  // Separate into top-level items and children
  const topLevelItems = items
    .filter((item) => !item.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const getChildren = (parentId: string) => {
    return items
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const renderTypeBadge = (type: NavigationItemType) => {
    switch (type) {
      case "PAGE":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              background: "#EFF6FF",
              color: "#1D4ED8",
              border: "1px solid #BFDBFE",
            }}
          >
            📄 Page
          </span>
        );
      case "CATEGORY":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              background: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #A7F3D0",
            }}
          >
            📦 Category
          </span>
        );
      case "PRODUCT":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              background: "#FAF5FF",
              color: "#6B21A8",
              border: "1px solid #E9D5FF",
            }}
          >
            🏷️ Product
          </span>
        );
      case "POLICY":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              background: "#FFFBEB",
              color: "#92400E",
              border: "1px solid #FDE68A",
            }}
          >
            📜 Policy
          </span>
        );
      case "CUSTOM_URL":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              background: "#F3F4F6",
              color: "#374151",
              border: "1px solid #E5E7EB",
            }}
          >
            🔗 Custom Link
          </span>
        );
    }
  };

  if (topLevelItems.length === 0) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "2px dashed #D1C7BD",
          borderRadius: "16px",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "36px" }}>📂</div>
        <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#2E1A0C", marginTop: "12px" }}>
          No navigation items found
        </h4>
        <p style={{ fontSize: "13px", color: "#6B6B6B", maxWidth: "420px", margin: "6px auto 0" }}>
          Try clearing your search filters, switching location tabs, or click &quot;+ Add Navigation Item&quot; to create a new link.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {topLevelItems.map((parent, pIndex) => {
        const children = getChildren(parent.id);
        const hasChildren = children.length > 0;

        return (
          <div
            key={parent.id}
            style={{
              background: parent.isActive ? "#FFFFFF" : "#FBF9F6",
              border: parent.isActive ? "1px solid #EDE3D4" : "1px solid #E2D9CE",
              borderRadius: "14px",
              boxShadow: parent.isActive ? "0 2px 8px rgba(0,0,0,0.03)" : "none",
              opacity: parent.isActive ? 1 : 0.75,
              overflow: "hidden",
              transition: "all 0.15s ease",
            }}
          >
            {/* Top Level Item Row */}
            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px",
              }}
            >
              {/* Left Details */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, flex: 1 }}>
                {/* Reorder Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <button
                    type="button"
                    title="Move Up"
                    disabled={pIndex === 0}
                    onClick={() => onMoveUp(parent.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: pIndex === 0 ? "#D1C7BD" : "#5C3A22",
                      cursor: pIndex === 0 ? "not-allowed" : "pointer",
                      padding: "2px",
                      fontSize: "12px",
                      lineHeight: 1,
                    }}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    title="Move Down"
                    disabled={pIndex === topLevelItems.length - 1}
                    onClick={() => onMoveDown(parent.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: pIndex === topLevelItems.length - 1 ? "#D1C7BD" : "#5C3A22",
                      cursor: pIndex === topLevelItems.length - 1 ? "not-allowed" : "pointer",
                      padding: "2px",
                      fontSize: "12px",
                      lineHeight: 1,
                    }}
                  >
                    ▼
                  </button>
                </div>

                {/* Sort Order Badge */}
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "#F7F2EC",
                    border: "1px solid #EDE3D4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#5C3A22",
                    flexShrink: 0,
                  }}
                >
                  {parent.sortOrder}
                </div>

                {/* Title & Route info */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "#2E1A0C" }}>
                      {parent.title}
                    </span>

                    {parent.badge && (
                      <span
                        style={{
                          background: "#D68A45",
                          color: "#FFFFFF",
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: "6px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {parent.badge}
                      </span>
                    )}

                    {hasChildren && (
                      <span
                        style={{
                          background: "#FAF7F2",
                          color: "#5C3A22",
                          border: "1px solid #D1C7BD",
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        📂 {children.length} {children.length === 1 ? "Sub-menu" : "Sub-menus"}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "6px",
                      flexWrap: "wrap",
                      fontSize: "12px",
                    }}
                  >
                    {renderTypeBadge(parent.type)}

                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "6px",
                        background: "#F7F2EC",
                        color: "#6B6B6B",
                        fontSize: "11px",
                        fontWeight: 600,
                        border: "1px solid #EDE3D4",
                      }}
                    >
                      📍 {parent.location.replace(/_/g, " ")}
                    </span>

                    <code
                      style={{
                        fontFamily: "monospace",
                        fontSize: "12px",
                        color: "#5C3A22",
                        background: "#FAF7F2",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        border: "1px solid #EDE3D4",
                      }}
                    >
                      {parent.url}
                    </code>

                    {parent.targetBlank && (
                      <span style={{ fontSize: "11px", color: "#8E8880", fontWeight: 600 }}>
                        ↗ Opens New Tab
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                {/* Add Sub-Item */}
                <button
                  type="button"
                  title="Add Dropdown Sub-Item under this menu"
                  onClick={() => onAddSubItem(parent.id, parent.title)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "8px",
                    background: "#FAF7F2",
                    border: "1px solid #D1C7BD",
                    color: "#5C3A22",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>+</span>
                  <span>Sub-Item</span>
                </button>

                {/* Show/Hide Toggle */}
                <button
                  type="button"
                  title={parent.isActive ? "Hide from Storefront" : "Show on Storefront"}
                  onClick={() => onToggleActive(parent.id)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "8px",
                    background: parent.isActive ? "#ECFDF5" : "#F3F4F6",
                    border: parent.isActive ? "1px solid #A7F3D0" : "1px solid #E5E7EB",
                    color: parent.isActive ? "#065F46" : "#6B7280",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>{parent.isActive ? "👁️ Visible" : "🙈 Hidden"}</span>
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  title="Edit Navigation Item"
                  onClick={() => onEdit(parent)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "8px",
                    background: "#FFFFFF",
                    border: "1px solid #D1C7BD",
                    color: "#5C3A22",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  title="Delete Navigation Item"
                  onClick={() => onDelete(parent.id, parent.title)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "8px",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    color: "#DC2626",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Nested Child Items (Indented) */}
            {hasChildren && (
              <div
                style={{
                  background: "#FAF8F5",
                  borderTop: "1px solid #EDE3D4",
                  padding: "12px 20px 14px 44px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {children.map((child, cIndex) => (
                  <div
                    key={child.id}
                    style={{
                      background: child.isActive ? "#FFFFFF" : "#F9F8F6",
                      border: "1px solid #EDE3D4",
                      borderLeft: "4px solid #D68A45",
                      borderRadius: "10px",
                      padding: "10px 16px",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      opacity: child.isActive ? 1 : 0.7,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                      {/* Sub-item reorder */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                        <button
                          type="button"
                          disabled={cIndex === 0}
                          onClick={() => onMoveUp(child.id)}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: cIndex === 0 ? "#D1C7BD" : "#5C3A22",
                            cursor: cIndex === 0 ? "not-allowed" : "pointer",
                            fontSize: "10px",
                            lineHeight: 1,
                          }}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={cIndex === children.length - 1}
                          onClick={() => onMoveDown(child.id)}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: cIndex === children.length - 1 ? "#D1C7BD" : "#5C3A22",
                            cursor: cIndex === children.length - 1 ? "not-allowed" : "pointer",
                            fontSize: "10px",
                            lineHeight: 1,
                          }}
                        >
                          ▼
                        </button>
                      </div>

                      <span style={{ color: "#D68A45", fontWeight: 700, fontSize: "14px" }}>↳</span>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#2E1A0C" }}>
                            {child.title}
                          </span>
                          {child.badge && (
                            <span
                              style={{
                                background: "#5C3A22",
                                color: "#FFFFFF",
                                fontSize: "9px",
                                fontWeight: 800,
                                padding: "1px 5px",
                                borderRadius: "4px",
                              }}
                            >
                              {child.badge}
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                          {renderTypeBadge(child.type)}
                          <code
                            style={{
                              fontFamily: "monospace",
                              fontSize: "11px",
                              color: "#6B6B6B",
                              background: "#F7F2EC",
                              padding: "1px 5px",
                              borderRadius: "4px",
                            }}
                          >
                            {child.url}
                          </code>
                          {child.description && (
                            <span style={{ fontSize: "11px", color: "#8E8880" }}>
                              • {child.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sub-item actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => onToggleActive(child.id)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          background: child.isActive ? "#ECFDF5" : "#F3F4F6",
                          border: child.isActive ? "1px solid #A7F3D0" : "1px solid #E5E7EB",
                          color: child.isActive ? "#065F46" : "#6B7280",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {child.isActive ? "👁️" : "🙈"}
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(child)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          background: "#FFFFFF",
                          border: "1px solid #D1C7BD",
                          color: "#5C3A22",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(child.id, child.title)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          background: "#FEF2F2",
                          border: "1px solid #FECACA",
                          color: "#DC2626",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
