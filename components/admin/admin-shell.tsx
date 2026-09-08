"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminProfileProvider, useAdminProfile } from "@/lib/auth/admin-profile-context";

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

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, setAdminStatus } = useAdminProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close admin profile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close profile menu on route change
  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const statusColors = {
    active: "#10B981",
    away: "#F59E0B",
    busy: "#EF4444",
  };

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

            {/* Admin Profile Chip & Interactive Dropdown */}
            <div ref={profileMenuRef} style={{ position: "relative" }}>
              <button
                type="button"
                id="admin-profile-chip-btn"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: isProfileMenuOpen ? "#FAF7F2" : "transparent",
                  border: isProfileMenuOpen ? "1px solid #D68A45" : "1px solid transparent",
                  borderRadius: "10px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {/* Avatar with Status Dot */}
                <div style={{ position: "relative" }}>
                  {admin.avatarUrl ? (
                    <img
                      src={admin.avatarUrl}
                      alt={admin.name}
                      style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #5C3A22" }}
                    />
                  ) : (
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#5C3A22", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" }}>
                      {admin.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  {/* Status Dot */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-1px",
                      right: "-1px",
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      backgroundColor: statusColors[admin.status],
                      border: "2px solid #FFFFFF",
                    }}
                  />
                </div>

                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B2B2B", lineHeight: 1.2 }}>
                    {admin.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "#8E8880" }}>
                    {admin.role}
                  </div>
                </div>

                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8E8880" strokeWidth="2.5" style={{ transform: isProfileMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Admin Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "280px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "14px",
                    boxShadow: "0 12px 32px rgba(43, 43, 43, 0.15)",
                    border: "1px solid #EDE3D4",
                    padding: "12px",
                    zIndex: 100,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {/* Header info */}
                  <div style={{ padding: "8px 10px 12px", borderBottom: "1px solid #F0E6DA" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {admin.avatarUrl ? (
                        <img src={admin.avatarUrl} alt={admin.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#5C3A22", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }}>
                          {admin.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 800, color: "#1F1A16" }}>{admin.name}</div>
                        <div style={{ fontSize: "11px", color: "#8C7E72" }}>{admin.email}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#5C3A22", backgroundColor: "#F7F2EC", padding: "2px 8px", borderRadius: "6px", border: "1px solid #E5D8C8" }}>
                        {admin.department}
                      </span>
                      <span style={{ fontSize: "11px", color: "#10B981", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: statusColors[admin.status] }} />
                        {admin.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Status Quick Switcher */}
                  <div style={{ padding: "8px 10px", borderBottom: "1px solid #F0E6DA", display: "flex", gap: "6px" }}>
                    {(["active", "away", "busy"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setAdminStatus(st)}
                        style={{
                          flex: 1,
                          padding: "4px 6px",
                          borderRadius: "6px",
                          border: admin.status === st ? "1.5px solid #5C3A22" : "1px solid #EAE0D5",
                          backgroundColor: admin.status === st ? "#FAF7F2" : "#FFFFFF",
                          fontSize: "11px",
                          fontWeight: admin.status === st ? 700 : 500,
                          color: admin.status === st ? "#5C3A22" : "#7A6E65",
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Links */}
                  <Link
                    href="/admin/settings?tab=profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#2C2520",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5C3A22" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Admin Profile Details</span>
                  </Link>

                  <Link
                    href="/admin/settings?tab=store"
                    onClick={() => setIsProfileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#2C2520",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5C3A22" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>Store Configuration</span>
                  </Link>

                  <Link
                    href="/admin/settings?tab=security"
                    onClick={() => setIsProfileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#2C2520",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5C3A22" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Security & Sessions</span>
                  </Link>

                  <div style={{ height: "1px", backgroundColor: "#F0E6DA", margin: "4px 0" }} />

                  {/* Sign out */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      router.push("/admin/login");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#DC2626",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Log Out Admin</span>
                  </button>
                </div>
              )}
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

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminProfileProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminProfileProvider>
  );
}

