"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";
import { getUnitPrice } from "@/lib/products-data";

export function QuickViewModal() {
  const router = useRouter();
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [selectedQty, setSelectedQty] = useState<number>(50);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const unitPrice = getUnitPrice(product, selectedQty);
  const totalPrice = unitPrice * selectedQty;

  const handleAddToCart = () => {
    addToCart(product, selectedQty);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedQty);
    setQuickViewProduct(null);
    router.push("/checkout");
  };

  return (
    <div className="iv-modal-overlay open" style={{ display: "flex" }} onClick={() => setQuickViewProduct(null)}>
      <div className="iv-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="iv-modal-close" onClick={() => setQuickViewProduct(null)} aria-label="Close modal">
          &times;
        </button>
        <div className="iv-modal-body">
          {/* Left: Product Image */}
          <div className="iv-modal-left">
            <span className="iv-badge">In Stock • Factory Direct</span>
            <div className="iv-img-box">
              <img src={product.image} alt={product.name} id="iv-modal-img" />
            </div>
          </div>

          {/* Right: Product Details & Pricing */}
          <div className="iv-modal-right">
            <span className="iv-category">{product.category}</span>
            <h3 className="iv-title">{product.name}</h3>
            <p className="iv-desc">{product.description}</p>

            {/* Specifications Grid */}
            <div className="iv-specs-grid">
              <div className="iv-spec-item">
                <span className="iv-spec-label">Dimensions (Inches):</span>
                <strong className="iv-spec-val">{product.size_inches}</strong>
              </div>
              <div className="iv-spec-item">
                <span className="iv-spec-label">Metric (cm):</span>
                <strong className="iv-spec-val">{product.size_cm}</strong>
              </div>
              <div className="iv-spec-item">
                <span className="iv-spec-label">Material:</span>
                <strong className="iv-spec-val">{product.specifications?.Material || "Corrugated Cardboard"}</strong>
              </div>
              <div className="iv-spec-item">
                <span className="iv-spec-label">Dispatch:</span>
                <strong className="iv-spec-val" style={{ color: "#2e7d32" }}>Ships in 24-48 Hours</strong>
              </div>
            </div>

            {/* Pack Size Selector */}
            <div className="iv-pack-section">
              <label className="iv-pack-title">Select Pack Quantity (MOQ: 50 pcs):</label>
              <div className="iv-pack-options" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                {[50, 100, 300, 500].map((qty) => {
                  const uPrice = getUnitPrice(product, qty);
                  const isSelected = selectedQty === qty;
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setSelectedQty(qty)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: isSelected ? "2px solid #8B5E3C" : "1px solid #D8C9B4",
                        background: isSelected ? "#F7F2EC" : "#FFFFFF",
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "#8B5E3C" : "#2B2B2B",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      {qty} pcs
                      <div style={{ fontSize: "0.72rem", color: "#888" }}>₹{uPrice.toFixed(2)}/pc</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Display */}
            <div className="iv-price-container" style={{ margin: "16px 0" }}>
              <div className="iv-main-price" style={{ fontSize: "1.6rem", fontWeight: 800, color: "#8B5E3C" }}>
                ₹{totalPrice.toFixed(2)}
              </div>
              <div className="iv-sub-price" style={{ fontSize: "0.85rem", color: "#666" }}>
                ₹{unitPrice.toFixed(2)} / box • GST Included
              </div>
            </div>

            {/* Action Buttons */}
            <div className="iv-actions" style={{ display: "flex", gap: "12px" }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddToCart}>
                🛍️ Add to Cart
              </button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={handleBuyNow}>
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
