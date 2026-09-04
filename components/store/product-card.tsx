"use client";

import React from "react";
import Link from "next/link";
import { Product, getUnitPrice } from "@/lib/products-data";
import { useCart } from "./cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setQuickViewProduct, toggleWishlist, isInWishlist } = useCart();
  const minUnitPrice = getUnitPrice(product, 500);
  const isWished = isInWishlist(product.id);

  return (
    <div className="product-card" style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #EDE3D4", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Top badges & wishlist button */}
      <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <span className="card-badge" style={{ background: "#D68A45", color: "#FFF", fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: "12px", textTransform: "uppercase" }}>
          {product.category}
        </span>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Wishlist"
          style={{ background: "#FFF", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer" }}
        >
          <span style={{ color: isWished ? "#dc2626" : "#aaa", fontSize: "1.1rem" }}>
            {isWished ? "❤️" : "🤍"}
          </span>
        </button>
      </div>

      {/* Product Image */}
      <div style={{ position: "relative", width: "100%", paddingTop: "75%", background: "#F7F2EC" }}>
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", padding: "20px" }}
          />
        </Link>
      </div>

      {/* Product Content */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Rating & Stock */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f59e0b", fontWeight: 700 }}>
            <span>★</span>
            <span>{product.rating || 4.9}</span>
            <span style={{ color: "#888", fontWeight: 400 }}>({product.reviewsCount || 85})</span>
          </div>
          <span style={{ color: "#15803d", fontWeight: 600 }}>In Stock</span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
          <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "#2B2B2B", lineHeight: "1.3", marginBottom: "6px", minHeight: "2.6em" }}>
            {product.name}
          </h4>
        </Link>

        {/* Size Badge */}
        <div style={{ fontSize: "0.78rem", color: "#8B5E3C", fontWeight: 600, background: "#F7F2EC", padding: "4px 8px", borderRadius: "6px", display: "inline-block", width: "fit-content", marginBottom: "12px" }}>
          📐 {product.size_inches}
        </div>

        {/* Pricing Summary */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "14px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>Starting from</span>
            <span style={{ fontWeight: 900, fontSize: "1.2rem", color: "#8B5E3C" }}>₹{minUnitPrice.toFixed(2)}</span>
            <span style={{ fontSize: "0.75rem", color: "#666" }}> / pc</span>
          </div>
          <span style={{ fontSize: "0.7rem", color: "#15803d", fontWeight: 600, background: "#f0fdf4", padding: "2px 6px", borderRadius: "4px" }}>
            GST Included
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn-outline"
            style={{ flex: 1, padding: "8px 12px", fontSize: "0.8rem", justifyContent: "center" }}
            onClick={() => setQuickViewProduct(product)}
          >
            Quick View
          </button>
          <button
            className="btn-primary"
            style={{ flex: 1, padding: "8px 12px", fontSize: "0.8rem", justifyContent: "center" }}
            onClick={() => addToCart(product, 50)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
