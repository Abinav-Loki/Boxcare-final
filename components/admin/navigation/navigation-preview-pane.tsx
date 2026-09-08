"use client";

import React, { useState } from "react";
import { AdminNavigationItem } from "./navigation-types";

interface NavigationPreviewPaneProps {
  items: AdminNavigationItem[];
  onEditItem?: (item: AdminNavigationItem) => void;
}

export function NavigationPreviewPane({ items, onEditItem }: NavigationPreviewPaneProps) {
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile" | "footer">("desktop");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  const [expandedMobileParentId, setExpandedMobileParentId] = useState<string | null>(null);

  const activeItems = items.filter((item) => item.isActive);

  // Group top-level header items and their children
  const headerTopItems = activeItems
    .filter((item) => item.location === "HEADER" && !item.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((parent) => ({
      ...parent,
      children: activeItems
        .filter((child) => child.parentId === parent.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));

  const categoryMenuItems = activeItems
    .filter((item) => item.location === "CATEGORY_MENU")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const mobileDrawerItems = activeItems
    .filter((item) => item.location === "MOBILE_DRAWER" || (item.location === "HEADER" && !item.parentId))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((parent) => ({
      ...parent,
      children: activeItems
        .filter((child) => child.parentId === parent.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));

  const footerProductsItems = activeItems
    .filter((item) => item.location === "FOOTER_PRODUCTS")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const footerIndustriesItems = activeItems
    .filter((item) => item.location === "FOOTER_INDUSTRIES")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const footerSupportItems = activeItems
    .filter((item) => item.location === "FOOTER_SUPPORT")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #EDE3D4",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Preview Header */}
      <div
        style={{
          padding: "14px 20px",
          background: "#FAF7F2",
          borderBottom: "1px solid #EDE3D4",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10B981",
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#2E1A0C" }}>
            Live Storefront Preview
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              background: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #A7F3D0",
              padding: "1px 6px",
              borderRadius: "10px",
            }}
          >
            Real-time
          </span>
        </div>

        {/* View Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "#EDE3D4",
            padding: "3px",
            borderRadius: "10px",
          }}
        >
          {(
            [
              { key: "desktop", label: "Desktop Header", icon: "💻" },
              { key: "mobile", label: "Mobile Drawer", icon: "📱" },
              { key: "footer", label: "Footer Columns", icon: "📜" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setPreviewTab(tab.key)}
              style={{
                padding: "5px 10px",
                borderRadius: "7px",
                fontSize: "11px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: previewTab === tab.key ? "#FFFFFF" : "transparent",
                color: previewTab === tab.key ? "#5C3A22" : "#6B6B6B",
                boxShadow: previewTab === tab.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Body Canvas */}
      <div style={{ padding: "20px", background: "#F7F2EC", minHeight: "480px" }}>
        {/* ================= DESKTOP PREVIEW ================= */}
        {previewTab === "desktop" && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #EDE3D4",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            {/* Store Announcement Bar */}
            <div
              style={{
                background: "#122A1E",
                color: "#6EE7B7",
                padding: "8px 16px",
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              ⚡ Factory-Direct Corrugated Boxes &amp; Custom Packaging • Express All-India Shipping
            </div>

            {/* Store Header Top Bar */}
            <div
              style={{
                padding: "12px 20px",
                borderBottom: "1px solid #EDE3D4",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#FFFFFF",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#065F46",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "13px",
                  }}
                >
                  BC
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "14px", color: "#1E1B18", letterSpacing: "-0.02em" }}>
                    BOX<span style={{ color: "#059669" }}>CARE</span>
                  </div>
                  <div style={{ fontSize: "9px", color: "#888", fontWeight: 700, textTransform: "uppercase" }}>
                    Packaging Store
                  </div>
                </div>
              </div>

              {/* Search Mock */}
              <div
                style={{
                  background: "#F7F2EC",
                  border: "1px solid #EDE3D4",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "11px",
                  color: "#888",
                  width: "220px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>🔍</span>
                <span>Search boxes, mailers...</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px" }}>
                <span style={{ color: "#065F46", fontWeight: 700, fontSize: "11px" }}>📞 +91 89039 27262</span>
                <span style={{ cursor: "pointer" }}>🛒 (2)</span>
              </div>
            </div>

            {/* Navigation Strip */}
            <div
              style={{
                background: "#FAF7F2",
                borderBottom: "1px solid #EDE3D4",
                padding: "4px 16px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                overflowX: "auto",
                position: "relative",
              }}
            >
              {headerTopItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isOpen = activeDropdownId === item.id;

                return (
                  <div
                    key={item.id}
                    style={{ position: "relative" }}
                    onMouseEnter={() => hasChildren && setActiveDropdownId(item.id)}
                    onMouseLeave={() => setActiveDropdownId(null)}
                  >
                    <button
                      type="button"
                      onClick={() => hasChildren && setActiveDropdownId(isOpen ? null : item.id)}
                      style={{
                        padding: "7px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        background: isOpen ? "#E8DFD5" : "transparent",
                        color: isOpen ? "#2E1A0C" : "#5C3A22",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span>{item.title}</span>
                      {item.badge && (
                        <span
                          style={{
                            background: "#059669",
                            color: "#FFFFFF",
                            fontSize: "9px",
                            fontWeight: 800,
                            padding: "1px 5px",
                            borderRadius: "4px",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {hasChildren && <span style={{ fontSize: "9px", color: "#8E8880" }}>▼</span>}
                    </button>

                    {/* Megamenu Dropdown */}
                    {hasChildren && isOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 30,
                          marginTop: "4px",
                          width: "280px",
                          background: "#FFFFFF",
                          border: "1px solid #EDE3D4",
                          borderRadius: "12px",
                          boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                          padding: "8px",
                        }}
                      >
                        <div
                          style={{
                            padding: "4px 8px 6px",
                            fontSize: "10px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "#8E8880",
                            borderBottom: "1px solid #F3EDE6",
                            marginBottom: "4px",
                          }}
                        >
                          {item.title} Options
                        </div>
                        {item.children.map((child) => (
                          <div
                            key={child.id}
                            onClick={() => onEditItem && onEditItem(child)}
                            style={{
                              padding: "8px 10px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF7F2")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C" }}>
                                  {child.title}
                                </span>
                                {child.badge && (
                                  <span style={{ background: "#D68A45", color: "#FFF", fontSize: "8px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px" }}>
                                    {child.badge}
                                  </span>
                                )}
                              </div>
                              {child.description && (
                                <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>
                                  {child.description}
                                </div>
                              )}
                            </div>
                            <span style={{ fontSize: "11px", color: "#D1C7BD" }}>→</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Category Quick Strip */}
            <div style={{ background: "#1E1B18", color: "#FFF", padding: "6px 16px", display: "flex", alignItems: "center", gap: "10px", overflowX: "auto" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#D68A45", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                ⚡ Quick Categories:
              </span>
              {categoryMenuItems.map((cat) => (
                <span
                  key={cat.id}
                  style={{
                    fontSize: "11px",
                    color: "#D1C7BD",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>{cat.title}</span>
                  {cat.badge && (
                    <span style={{ background: "#059669", color: "#FFF", fontSize: "8px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px" }}>
                      {cat.badge}
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Mock Body */}
            <div style={{ padding: "40px 20px", textAlign: "center", background: "#FDFBF8" }}>
              <div style={{ fontSize: "28px" }}>📦</div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#2E1A0C", marginTop: "8px" }}>
                Storefront Canvas Area
              </div>
              <p style={{ fontSize: "12px", color: "#888", margin: "4px 0 0" }}>
                Hover over &quot;All Products&quot; or &quot;Industries&quot; in the header above to test your dropdown menus.
              </p>
            </div>
          </div>
        )}

        {/* ================= MOBILE PREVIEW ================= */}
        {previewTab === "mobile" && (
          <div
            style={{
              maxWidth: "340px",
              margin: "0 auto",
              background: "#1E1B18",
              borderRadius: "28px",
              padding: "8px",
              boxShadow: "0 16px 36px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: "440px",
              }}
            >
              {/* Mobile Status Header */}
              <div
                style={{
                  background: "#122A1E",
                  color: "#FFF",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#6EE7B7",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    ☰
                  </button>
                  <span style={{ fontSize: "12px", fontWeight: 900, color: "#FFF" }}>
                    BOX<span style={{ color: "#34D399" }}>CARE</span>
                  </span>
                </div>
                <span style={{ fontSize: "11px" }}>🛒 (2)</span>
              </div>

              {/* Mobile Drawer */}
              {mobileMenuOpen ? (
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#8E8880", textTransform: "uppercase", marginBottom: "8px" }}>
                    Mobile Menu Drawer
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {mobileDrawerItems.map((item) => {
                      const hasChildren = item.children && item.children.length > 0;
                      const isExpanded = expandedMobileParentId === item.id;

                      return (
                        <div key={item.id} style={{ borderBottom: "1px solid #F3EDE6", paddingBottom: "4px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "6px 0",
                            }}
                          >
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C", display: "flex", alignItems: "center", gap: "6px" }}>
                              {item.title}
                              {item.badge && (
                                <span style={{ background: "#059669", color: "#FFF", fontSize: "8px", fontWeight: 800, padding: "1px 4px", borderRadius: "3px" }}>
                                  {item.badge}
                                </span>
                              )}
                            </span>

                            {hasChildren && (
                              <button
                                type="button"
                                onClick={() => setExpandedMobileParentId(isExpanded ? null : item.id)}
                                style={{
                                  border: "none",
                                  background: "#F7F2EC",
                                  borderRadius: "4px",
                                  padding: "2px 6px",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                  color: "#5C3A22",
                                }}
                              >
                                {isExpanded ? "▲" : "▼"}
                              </button>
                            )}
                          </div>

                          {/* Expanded sub-items */}
                          {hasChildren && isExpanded && (
                            <div style={{ marginLeft: "12px", borderLeft: "2px solid #D68A45", paddingLeft: "10px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                              {item.children.map((child) => (
                                <div key={child.id} style={{ fontSize: "11px", color: "#6B6B6B", padding: "2px 0" }}>
                                  • {child.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #EDE3D4" }}>
                    <a
                      href="tel:+918903927262"
                      style={{
                        display: "block",
                        background: "#065F46",
                        color: "#FFF",
                        textAlign: "center",
                        padding: "8px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      📞 Call Packaging Sales
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center", color: "#888", fontSize: "12px" }}>
                  <div>
                    <div>📱</div>
                    <div>Drawer Closed</div>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(true)}
                      style={{
                        marginTop: "8px",
                        padding: "4px 10px",
                        background: "#065F46",
                        color: "#FFF",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      Open Drawer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= FOOTER PREVIEW ================= */}
        {previewTab === "footer" && (
          <div
            style={{
              background: "#1E1B18",
              color: "#FFFFFF",
              borderRadius: "14px",
              padding: "24px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
              {/* Products Column */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#D68A45", marginBottom: "10px", letterSpacing: "0.05em" }}>
                  📦 Products
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#D1C7BD" }}>
                  {footerProductsItems.map((item) => (
                    <div key={item.id} style={{ cursor: "pointer" }}>
                      • {item.title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Industries Column */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#D68A45", marginBottom: "10px", letterSpacing: "0.05em" }}>
                  🏭 Industries
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#D1C7BD" }}>
                  {footerIndustriesItems.map((item) => (
                    <div key={item.id} style={{ cursor: "pointer" }}>
                      • {item.title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Support & Policies Column */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#D68A45", marginBottom: "10px", letterSpacing: "0.05em" }}>
                  📜 Support &amp; Policies
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#D1C7BD" }}>
                  {footerSupportItems.map((item) => (
                    <div key={item.id} style={{ cursor: "pointer" }}>
                      • {item.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "24px", paddingTop: "14px", borderTop: "1px solid #2F2A25", textAlign: "center", fontSize: "11px", color: "#8E8880" }}>
              © {new Date().getFullYear()} BoxCare Industries Pvt Ltd. All rights reserved.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
