"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  badge?: string | number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", badge: "28" },
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/navigation", label: "Navigation" },
    ],
  },
  {
    title: "Commerce & Logistics",
    items: [
      { href: "/admin/orders", label: "Orders", badge: "12" },
      { href: "/admin/shipments", label: "Shipments" },
      { href: "/admin/coupons", label: "Coupons" },
    ],
  },
  {
    title: "Store & Settings",
    items: [
      { href: "/admin/banners", label: "Banners" },
      { href: "/admin/pages", label: "Pages" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F7F2EC", color: "#2B2B2B", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar Desktop */}
      <aside
        style={{
          width: "250px",
          minWidth: "250px",
          background: "#1E1B18",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid #2F2A25",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
          {/* Logo Header */}
          <div style={{ padding: "20px 18px", borderBottom: "1px solid #2F2A25", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#FFF" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #D68A45 0%, #B8702A 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "13px", color: "#FFF", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
                BC
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "-0.02em", color: "#FFF" }}>Box Care</div>
                <div style={{ fontSize: "10px", color: "#D68A45", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }}></span>
                  Admin Console
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
            {navGroups.map((group) => (
              <div key={group.title}>
                <div style={{ padding: "0 8px 6px", fontSize: "10px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {group.title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: isActive ? 700 : 500,
                          textDecoration: "none",
                          color: isActive ? "#FFFFFF" : "#C8C2BA",
                          background: isActive ? "#D68A45" : "transparent",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "2px 7px",
                              borderRadius: "10px",
                              background: isActive ? "#FFF" : "#2E2823",
                              color: isActive ? "#5C3A22" : "#D68A45",
                              border: isActive ? "none" : "1px solid #3D352E",
                              marginLeft: "auto",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Storefront Link */}
          <div style={{ padding: "12px", borderTop: "1px solid #2F2A25", background: "#161412" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "#25211D",
                color: "#E5DFD7",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid #332C26",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🏪</span>
                <span>Live Storefront</span>
              </div>
              <span style={{ color: "#D68A45", fontSize: "12px" }}>↗</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: "100vh", background: "#F7F2EC" }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: "60px",
            background: "#FFFFFF",
            borderBottom: "1px solid #EDE3D4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            position: "sticky",
            top: 0,
            zIndex: 30,
            boxShadow: "0 1px 4px rgba(43,43,43,0.04)",
          }}
        >
          {/* Search bar */}
          <div style={{ width: "320px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search orders, catalog, SKU..."
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

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#5C3A22",
                textDecoration: "none",
              }}
            >
              <span>View Storefront</span>
              <span style={{ color: "#D68A45" }}>↗</span>
            </Link>

            <div style={{ width: "1px", height: "24px", background: "#EDE3D4" }} />

            {/* Admin Profile Chip */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#5C3A22", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" }}>
                A
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B2B2B", lineHeight: 1.2 }}>Admin</div>
                <div style={{ fontSize: "10px", color: "#8E8880" }}>Operations</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: "32px", flex: 1, maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
