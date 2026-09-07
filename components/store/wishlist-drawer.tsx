"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "./cart-context";
import { PRODUCTS, getUnitPrice } from "@/lib/products-data";

export function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart } = useCart();

  if (!isWishlistOpen) return null;

  const wishedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-end",
        transition: "opacity 0.3s ease",
      }}
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          height: "100%",
          backgroundColor: "#FFFFFF",
          boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          animation: "slideInRight 0.3s ease forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #EAE0D5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FAF7F2",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#FEF2F2",
                border: "1.5px solid #FCA5A5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#EF4444",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#1F1A16", margin: 0 }}>
                My Favorites ({wishlist.length})
              </h2>
              <span style={{ fontSize: "12px", color: "#8C7E72" }}>Saved for your next packaging order</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={() => setIsWishlistOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#8C7E72",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {wishedProducts.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#F7F2EC",
                  border: "1.5px solid #E5D8C8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8C7E72",
                  marginBottom: "16px",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1F1A16", margin: "0 0 8px 0" }}>
                No favorites saved yet
              </h3>
              <p style={{ fontSize: "13px", color: "#8C7E72", lineHeight: 1.5, margin: "0 0 24px 0", maxWidth: "260px" }}>
                Click the ❤️ heart icon on any box size or packing tape to keep track of items you love.
              </p>
              <Link
                href="/products"
                onClick={() => setIsWishlistOpen(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#5C3A22",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(92, 58, 34, 0.15)",
                }}
              >
                Browse Products Catalog
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {wishedProducts.map((prod) => {
                const unitPrice = getUnitPrice(prod, 500);
                return (
                  <div
                    key={prod.id}
                    style={{
                      display: "flex",
                      gap: "14px",
                      padding: "14px",
                      backgroundColor: "#FAF7F2",
                      border: "1px solid #EDE3D4",
                      borderRadius: "14px",
                      position: "relative",
                    }}
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/product/${prod.slug}`}
                      onClick={() => setIsWishlistOpen(false)}
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: "1px solid #EAE0D5",
                        padding: "6px",
                      }}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </Link>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <Link
                          href={`/product/${prod.slug}`}
                          onClick={() => setIsWishlistOpen(false)}
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#1F1A16",
                            textDecoration: "none",
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {prod.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(prod.id)}
                          aria-label="Remove item"
                          title="Remove from favorites"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            padding: "2px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      <span style={{ fontSize: "11px", color: "#8B5E3C", fontWeight: 600, marginTop: "4px" }}>
                        Size: {prod.size_inches}
                      </span>

                      <div style={{ marginTop: "auto", paddingTop: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <span style={{ fontSize: "11px", color: "#8C7E72", display: "block" }}>From</span>
                          <strong style={{ fontSize: "13px", color: "#5C3A22" }}>₹{unitPrice.toFixed(2)}/pc</strong>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(prod, 50)}
                          style={{
                            padding: "6px 14px",
                            backgroundColor: "#5C3A22",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>+ Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {wishedProducts.length > 0 && (
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #EAE0D5",
              backgroundColor: "#FAF7F2",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                wishedProducts.forEach((p) => addToCart(p, 50));
                setIsWishlistOpen(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#5C3A22",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>Add All to Shopping Cart ({wishedProducts.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
