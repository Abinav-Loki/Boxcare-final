"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "./cart-context";
import { useCustomerAuth } from "@/lib/auth/customer-auth-context";
import { PRODUCTS, Product } from "@/lib/products-data";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, isInWishlist, addToCart } = useCart();
  const { user, isLoggedIn, signOut } = useCustomerAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [overlayTop, setOverlayTop] = useState<number>(130);


  const isHomeActive = pathname === "/";
  const isShopActive =
    pathname.startsWith("/products") ||
    pathname.startsWith("/category") ||
    pathname.startsWith("/accessories") ||
    pathname.startsWith("/bulk-orders");
  const isCompanyActive =
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/industries") ||
    pathname.startsWith("/policies");

  // Read URL search parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get("search") || urlParams.get("q") || urlParams.get("query");
      if (q) {
        setSearchQuery(q);
        setIsSearchOpen(true);
      }
    }
  }, []);

  // Handle Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus input & calculate top position when search bar opens
  useEffect(() => {
    if (isSearchOpen) {
      const updatePosition = () => {
        if (searchBarRef.current) {
          const rect = searchBarRef.current.getBoundingClientRect();
          if (rect.bottom > 0) {
            setOverlayTop(rect.bottom);
          }
        }
      };
      updatePosition();
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
        updatePosition();
      }, 50);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [isSearchOpen, searchQuery]);

  // Click outside & Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isUserMenuOpen) setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, isUserMenuOpen]);

  // Close search bar & user menu on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Live filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const qNoSpaces = q.replace(/\s+/g, "");

    const matches = PRODUCTS.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const catMatch = p.category.toLowerCase().includes(q);
      const catSlugMatch = p.categorySlug.toLowerCase().includes(q);
      const sizeMatch = p.size_inches.toLowerCase().includes(q);
      const sizeShortMatch = p.size_inches_short.toLowerCase().includes(q);
      const dimMatch = `${p.length_in}x${p.width_in}x${p.height_in}`.toLowerCase().includes(qNoSpaces);
      const descMatch = p.description.toLowerCase().includes(q);

      return nameMatch || catMatch || catSlugMatch || sizeMatch || sizeShortMatch || dimMatch || descMatch;
    }).slice(0, 8);

    setSearchResults(matches);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };


  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    searchInputRef.current?.focus();
  };


  return (
    <header ref={headerRef} className={`header ${isScrolled ? "scrolled" : ""}`} id="header">
      <div className="header-inner">
        {/* Logo */}
        <Link href="/" className="logo" id="logo-link">
          <div className="logo-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="9" fill="#8B5E3C" />
              <path d="M8 8h12a6 6 0 010 12H8V8zm0 12h7v8H8v-8z" fill="#F7F2EC" />
              <path d="M22 20l4 4" stroke="#D68A45" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="28" cy="26" r="3" fill="#D68A45" />
            </svg>
          </div>
          <div className="logo-words">
            <span className="logo-name">Box Care</span>
            <span className="logo-tag">Premium Packaging</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links" id="nav-links">
          <Link href="/" className={`nav-link ${isHomeActive ? "active" : ""}`} id="nav-home">
            Home
          </Link>

          {/* Shop Products Dropdown */}
          <div className="nav-item-dropdown">
            <Link
              href="/products"
              className={`nav-link ${isShopActive ? "active" : ""}`}
              id="nav-shop"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              Shop Products
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Link>
            <div className="dropdown-menu">
              {/* 1. All Product Categories */}
              <Link href="/products" className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>All Product Categories</span>
              </Link>

              {/* 2. Mailer Boxes Collection */}
              <Link href="/category/mailer-boxes" className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <span>Mailer Boxes Collection</span>
              </Link>

              {/* 3. Corrugated Cartons */}
              <Link href="/category/corrugated-boxes" className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 17 22 12" />
                </svg>
                <span>Corrugated Cartons</span>
              </Link>

              {/* 4. Tapes & Packaging Accessories */}
              <Link href="/accessories" className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <span>Tapes & Packaging Accessories</span>
              </Link>

              {/* 5. Wholesale & Bulk Orders */}
              <Link href="/bulk-orders" className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>Wholesale & Bulk Orders</span>
              </Link>

              {/* 6. Shopping Cart */}
              <button
                type="button"
                className="dropdown-item"
                onClick={() => setIsCartOpen(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Shopping Cart</span>
              </button>
            </div>
          </div>

          {/* Company & Support Dropdown */}
          <div className="nav-item-dropdown">
            <Link
              href="/about"
              className={`nav-link ${isCompanyActive ? "active" : ""}`}
              id="nav-company"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              Company & Support
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Link>
            <div className="dropdown-menu">
              <Link href="/industries" className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="22" x2="9" y2="22.01" />
                </svg>
                <span>Industries We Serve</span>
              </Link>

              <Link href="/about" className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>About Box Care</span>
              </Link>

              <Link href="/contact" className="dropdown-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Contact & FAQs</span>
              </Link>
            </div>
          </div>

          {/* Custom Boxes Highlight Button */}
          <Link
            href="/custom-boxes"
            className="nav-link btn-nav-highlight"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#FAD8B4",
              color: "#5C3A22",
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: "20px",
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            Custom Boxes
          </Link>
        </nav>

        {/* Header Right Actions */}
        <div className="nav-actions">
          {/* Search Button */}
          <button
            className="icon-btn"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Wishlist Button */}
          <button
            className="icon-btn wishlist-btn"
            aria-label="Favorites"
            id="wishlist-toggle-btn"
            onClick={() => setIsWishlistOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlist.length > 0 ? "#EF4444" : "none"} stroke={wishlist.length > 0 ? "#EF4444" : "currentColor"} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </button>

          {/* User Account Button & Dropdown */}
          <div ref={userMenuRef} style={{ position: "relative" }}>
            {isLoggedIn && user ? (
              <button
                className="icon-btn"
                aria-label="Account Profile"
                id="account-profile-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  borderRadius: "50%",
                  border: isUserMenuOpen ? "2px solid #5C3A22" : "1.5px solid #D68A45",
                  background: "#FAF7F2",
                  cursor: "pointer",
                }}
                title={`Logged in as ${user.name}`}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "#5C3A22",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "U"}
                  </div>
                )}
                {/* Active status indicator dot */}
                <span
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    right: "-1px",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#10B981",
                    borderRadius: "50%",
                    border: "1.5px solid #FFFFFF",
                  }}
                />
              </button>
            ) : (
              <button
                className="icon-btn"
                aria-label="Sign In"
                id="account-signin-btn"
                onClick={() => router.push("/signin")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            )}

            {/* Authenticated User Menu Dropdown */}
            {isLoggedIn && user && isUserMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  width: "260px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  boxShadow: "0 12px 30px rgba(92, 58, 34, 0.15)",
                  border: "1px solid #EAE0D5",
                  padding: "12px",
                  zIndex: 1000,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {/* User Header */}
                <div
                  style={{
                    padding: "8px 10px 12px",
                    borderBottom: "1px solid #F0E6DA",
                    marginBottom: "4px",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1F1A16" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8C7E72", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email}
                  </div>
                  {user.membershipTier && (
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "6px",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#5C3A22",
                        backgroundColor: "#F7F2EC",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        border: "1px solid #E5D8C8",
                      }}
                    >
                      {user.membershipTier}
                    </span>
                  )}
                </div>

                {/* Profile Link */}
                <Link
                  href="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
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
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C3A22" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Customer Profile</span>
                </Link>

                {/* Orders Link */}
                <Link
                  href="/profile?tab=orders"
                  onClick={() => setIsUserMenuOpen(false)}
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
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C3A22" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span>Order History ({user.orders.length})</span>
                </Link>

                {/* Saved Addresses Link */}
                <Link
                  href="/profile?tab=addresses"
                  onClick={() => setIsUserMenuOpen(false)}
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
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C3A22" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Saved Addresses ({user.addresses.length})</span>
                </Link>

                {/* Divider */}
                <div style={{ height: "1px", backgroundColor: "#F0E6DA", margin: "4px 0" }} />

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setIsUserMenuOpen(false);
                    router.push("/");
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
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon Button */}
          <button
            className="icon-btn cart-icon-btn"
            aria-label="Cart"
            onClick={() => setIsCartOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="badge" id="cart-count">
              {cartCount}
            </span>
          </button>

          {/* Direct Quote CTA */}
          <Link href="/custom-boxes" className="quote-btn">
            Get Quote
          </Link>

          {/* Hamburger Mobile Menu Toggle */}
          <button
            className="hamburger"
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Live Search Bar Dropdown Overlay */}
      <div ref={searchBarRef} className={`search-bar ${isSearchOpen ? "open" : ""}`} id="search-bar">
        <form onSubmit={handleSearchSubmit} className="search-bar-inner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-bar-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            id="search-input"
            placeholder="Search for boxes, mailers, tapes, accessories…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              id="search-clear-btn"
              aria-label="Clear search"
              onClick={handleClearSearch}
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* Full-screen Search Results Overlay Below Search Bar */}
      {isSearchOpen && searchQuery.trim().length > 0 && (
        <section
          id="home-search-results"
          className="search-results-overlay"
          style={{
            position: "fixed",
            top: `${overlayTop}px`,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--beige-lt, #FAF7F2)",
            zIndex: 9999,
            overflowY: "auto",
            padding: "40px 0 80px 0",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div className="container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
            {/* Header Title & Exit Search Button */}
            <div
              style={{
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--beige-xdk, #E5D9C8)",
                paddingBottom: "16px",
              }}
            >
              <h2
                id="home-search-title"
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "var(--charcoal, #2B2B2B)",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                Search Results for &quot;{searchQuery.trim()}&quot;
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    background: "#8B5E3C",
                    color: "#FFF",
                    padding: "2px 10px",
                    borderRadius: "12px",
                  }}
                >
                  {searchResults.length}
                </span>
              </h2>
              <button
                id="close-search-results-btn"
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--brown, #8B5E3C)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  transition: "background 0.2s ease",
                }}
              >
                <span>Exit Search</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Results Grid or Empty State */}
            {searchResults.length === 0 ? (
              <div id="home-search-empty" style={{ textAlign: "center", padding: "80px 20px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "var(--beige-xdk, #E5D9C8)",
                    color: "var(--charcoal-xlt, #78736E)",
                    marginBottom: "20px",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3
                  id="home-search-empty-title"
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--charcoal, #2B2B2B)",
                    marginBottom: "12px",
                  }}
                >
                  No products found
                </h3>
                <p style={{ color: "var(--charcoal-xlt, #78736E)", maxWidth: "440px", margin: "0 auto 24px", lineHeight: "1.6" }}>
                  We couldn&apos;t find any products matching your search term. Please try another query or browse our catalog.
                </p>
                <button
                  id="clear-search-empty-btn"
                  type="button"
                  onClick={handleClearSearch}
                  className="quote-btn"
                  style={{
                    display: "inline-block",
                    padding: "12px 28px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    background: "var(--brown, #8B5E3C)",
                    color: "#FFF",
                  }}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div
                className="catalog-products-grid grid-4"
                id="home-search-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "24px",
                }}
              >
                {searchResults.map((prod) => {
                  const minPrice = (prod.prices["500"] / 500).toFixed(2);
                  const maxPrice = (prod.prices["50"] / 50).toFixed(2);
                  const isWished = isInWishlist(prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="catalog-prod-card"
                      id={`home-search-card-${prod.id}`}
                      style={{
                        background: "#FFF",
                        borderRadius: "12px",
                        border: "1px solid var(--beige-xdk, #E5D9C8)",
                        padding: "16px",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <span
                        className="discount-badge"
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          zIndex: 2,
                          background: "#E53E3E",
                          color: "#FFF",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        -10%
                      </span>
                      <div>
                        <div
                          className="img-container"
                          style={{
                            cursor: "pointer",
                            height: "160px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#FAF7F2",
                            borderRadius: "8px",
                            overflow: "hidden",
                            marginBottom: "12px",
                            padding: "12px",
                          }}
                          onClick={() => {
                            setIsSearchOpen(false);
                            router.push(`/product/${prod.slug}`);
                          }}
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="catalog-prod-img"
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                          />
                        </div>
                        <div className="info-container">
                          <div className="rating" style={{ display: "flex", gap: "2px", alignItems: "center", marginBottom: "6px" }}>
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                            <span style={{ fontSize: "0.75rem", color: "#888", marginLeft: "4px" }}>(85)</span>
                          </div>
                          <h3
                            className="size-name"
                            style={{
                              fontSize: "0.95rem",
                              fontWeight: 700,
                              margin: "0 0 6px 0",
                              color: "var(--charcoal, #2B2B2B)",
                              cursor: "pointer",
                              lineHeight: "1.4",
                            }}
                            onClick={() => {
                              setIsSearchOpen(false);
                              router.push(`/product/${prod.slug}`);
                            }}
                          >
                            {prod.name}
                          </h3>
                          <div className="price-starts" style={{ fontSize: "0.82rem", color: "var(--brown, #8B5E3C)", marginBottom: "14px" }}>
                            Starts From: <strong>₹ {minPrice} - ₹ {maxPrice}</strong>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="quick-add-btn"
                        style={{
                          width: "100%",
                          padding: "10px",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          borderRadius: "6px",
                          border: "none",
                          background: "var(--brown, #8B5E3C)",
                          color: "#FFF",
                          cursor: "pointer",
                          transition: "background 0.2s ease",
                        }}
                        onClick={() => {
                          addToCart(prod, 50);
                          setIsCartOpen(true);
                          setIsSearchOpen(false);
                        }}
                      >
                        Quick Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}



      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 500,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              width: "280px",
              height: "100%",
              background: "#F7F2EC",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#2B2B2B" }}>Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: "1.5rem" }}>✕</button>
            </div>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, padding: "8px 0" }}>Home</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, padding: "8px 0" }}>Shop Products</Link>
            <Link href="/category/mailer-boxes" onClick={() => setIsMobileMenuOpen(false)} style={{ paddingLeft: "16px", fontSize: "0.9rem" }}>Mailer Boxes</Link>
            <Link href="/category/corrugated-boxes" onClick={() => setIsMobileMenuOpen(false)} style={{ paddingLeft: "16px", fontSize: "0.9rem" }}>Corrugated Boxes</Link>
            <Link href="/accessories" onClick={() => setIsMobileMenuOpen(false)} style={{ paddingLeft: "16px", fontSize: "0.9rem" }}>Accessories & Tapes</Link>
            <Link href="/custom-boxes" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 700, color: "#8B5E3C", padding: "8px 0" }}>Custom Boxes</Link>
            <Link href="/bulk-orders" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, padding: "8px 0" }}>Bulk Wholesale</Link>
            <Link href="/industries" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, padding: "8px 0" }}>Industries</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, padding: "8px 0" }}>About Us</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, padding: "8px 0" }}>Contact & FAQs</Link>
            <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #E5D8C8" }}>
              {isLoggedIn && user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0" }}>
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#5C3A22",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#1F1A16" }}>{user.name}</div>
                      <div style={{ fontSize: "11px", color: "#8C7E72" }}>{user.email}</div>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px",
                      backgroundColor: "#5C3A22",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "14px",
                      textDecoration: "none",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>My Account Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                      router.push("/");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px",
                      backgroundColor: "#F7F2EC",
                      color: "#DC2626",
                      border: "1px solid #E5D8C8",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px",
                    backgroundColor: "#5C3A22",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
