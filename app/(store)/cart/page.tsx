"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/store/cart-context";
import { getUnitPrice } from "@/lib/products-data";

export default function ShoppingCartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const freeShippingThreshold = 2000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const isFreeShipping = subtotal >= freeShippingThreshold;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!promoCode.trim()) {
      setPromoError("Please enter a valid coupon code.");
      return;
    }

    const code = promoCode.trim().toUpperCase();
    if (code === "BOXCARE10") {
      setDiscountPercent(10);
      setPromoSuccess("🎉 Coupon BOXCARE10 applied! 10% discount added.");
    } else if (code === "FREESHIP") {
      setDiscountPercent(5);
      setPromoSuccess("🎉 Coupon FREESHIP applied! Extra 5% off order.");
    } else {
      setPromoError("Invalid or expired coupon code. Try BOXCARE10.");
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 150;
  const estimatedTax = (subtotal - discountAmount) * 0.18; // 18% GST standard
  const grandTotal = Math.max(0, subtotal - discountAmount + (isFreeShipping ? 0 : shippingCost));

  return (
    <div className="cart-page-wrapper" style={{ background: "var(--bg, #F9F6F0)", minHeight: "80vh", padding: "40px 0 80px 0" }}>
      <div className="container">
        {/* Breadcrumbs */}
        <nav style={{ display: "flex", gap: "8px", fontSize: "0.85rem", color: "#8B5E3C", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#8B5E3C", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "#2B2B2B", fontWeight: 700 }}>Shopping Cart</span>
        </nav>

        {/* Page Title & Header */}
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.4rem", color: "#2E1A0C", fontWeight: 900, margin: 0 }}>
              Shopping Cart
            </h1>
            <p style={{ color: "#666", marginTop: "6px", fontSize: "1rem" }}>
              Review your customized packaging items, pack quantities, and apply bulk discounts before checkout.
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear your cart?")) clearCart();
              }}
              style={{
                background: "transparent",
                border: "1px solid #D1C7BD",
                color: "#8B5E3C",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🗑️ Clear Cart
            </button>
          )}
        </div>

        {/* Free Shipping Progress Banner */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8DFD5",
            borderRadius: "14px",
            padding: "18px 24px",
            marginBottom: "32px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: isFreeShipping ? "#15803D" : "#5C3A22" }}>
              {isFreeShipping ? "🎉 Congratulations! You unlocked FREE Pan-India Delivery" : `🚚 Add ₹${remainingForFreeShipping.toFixed(0)} more to unlock FREE Delivery!`}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#8B5E3C", fontWeight: 600 }}>
              Threshold: ₹2,000
            </span>
          </div>
          <div style={{ background: "#F4EDE4", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                background: isFreeShipping ? "linear-gradient(90deg, #16A34A, #15803D)" : "linear-gradient(90deg, #D68A45, #B26A28)",
                height: "100%",
                width: `${progressToFreeShipping}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart View */
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8DFD5",
              borderRadius: "18px",
              padding: "60px 24px",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📦</div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#2E1A0C", marginBottom: "8px" }}>
              Your Shopping Cart is Empty
            </h2>
            <p style={{ color: "#666", maxWidth: "450px", margin: "0 auto 24px auto", lineHeight: "1.6" }}>
              Looks like you haven't added any packaging products yet. Browse our corrugated mailers, shipping cartons, and accessories.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <Link href="/products" className="hero-slide-btn" style={{ textDecoration: "none" }}>
                <span>Explore Products</span>
                <span>→</span>
              </Link>
              <Link
                href="/category/mailer-boxes"
                style={{
                  padding: "12px 24px",
                  background: "#F4EDE4",
                  border: "1px solid #D6C7B2",
                  borderRadius: "10px",
                  color: "#4A321F",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Browse Mailer Boxes
              </Link>
            </div>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "flex-start" }}>
            {/* Left Column: Items List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {cart.map((item) => {
                const unitPrice = getUnitPrice(item.product, item.quantity);
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize || "default"}`}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8DFD5",
                      borderRadius: "16px",
                      padding: "20px 24px",
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                    }}
                  >
                    {/* Item Image */}
                    <div
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "10px",
                        background: "#F8F4EE",
                        border: "1px solid #EDE3D4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        padding: "6px",
                      }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>

                    {/* Item Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <div>
                          <Link
                            href={`/product/${item.product.slug}`}
                            style={{
                              fontSize: "1.05rem",
                              fontWeight: 800,
                              color: "#2E1A0C",
                              textDecoration: "none",
                            }}
                          >
                            {item.product.name}
                          </Link>
                          <div style={{ fontSize: "0.82rem", color: "#8B5E3C", marginTop: "4px" }}>
                            Category: <strong>{item.product.category}</strong> • Size: <strong>{item.selectedSize || item.product.size_inches_short}</strong>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#999",
                            fontSize: "1.1rem",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Pricing and Quantity Adjuster Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", flexWrap: "wrap", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", border: "1px solid #D8CEBE", borderRadius: "8px", background: "#FAF7F2", padding: "2px" }}>
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.max(50, item.quantity - 50))}
                            style={{
                              padding: "4px 10px",
                              background: "#FFFFFF",
                              border: "1px solid #E0D6C8",
                              borderRadius: "6px",
                              fontWeight: 700,
                              color: "#2E1A0C",
                              cursor: "pointer",
                            }}
                          >
                            −
                          </button>
                          <span style={{ padding: "0 12px", fontWeight: 800, fontSize: "0.95rem", color: "#2E1A0C" }}>
                            {item.quantity} pcs
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 50)}
                            style={{
                              padding: "4px 10px",
                              background: "#FFFFFF",
                              border: "1px solid #E0D6C8",
                              borderRadius: "6px",
                              fontWeight: 700,
                              color: "#2E1A0C",
                              cursor: "pointer",
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.82rem", color: "#777" }}>
                            ₹{unitPrice.toFixed(2)} / pc
                          </div>
                          <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#D68A45" }}>
                            ₹{(lineTotal ?? 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary & Checkout Card */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8DFD5",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                position: "sticky",
                top: "100px",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#2E1A0C", margin: "0 0 20px 0" }}>
                Order Summary
              </h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Coupon (e.g. BOXCARE10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      border: "1px solid #D8CEBE",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      outline: "none",
                      textTransform: "uppercase",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#3D2E24",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p style={{ fontSize: "0.78rem", color: "#DC2626", marginTop: "6px", margin: "6px 0 0 0" }}>{promoError}</p>
                )}
                {promoSuccess && (
                  <p style={{ fontSize: "0.78rem", color: "#16A34A", marginTop: "6px", margin: "6px 0 0 0" }}>{promoSuccess}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid #F0E8DE", paddingTop: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.92rem", color: "#555" }}>
                  <span>Items Subtotal:</span>
                  <span style={{ fontWeight: 700, color: "#2E1A0C" }}>₹{(subtotal ?? 0).toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.92rem", color: "#16A34A" }}>
                    <span>Promo Discount ({discountPercent}%):</span>
                    <span style={{ fontWeight: 700 }}>−₹{discountAmount.toFixed(0)}</span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.92rem", color: "#555" }}>
                  <span>Estimated Shipping:</span>
                  <span style={{ fontWeight: 700, color: isFreeShipping ? "#16A34A" : "#2E1A0C" }}>
                    {isFreeShipping ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#888" }}>
                  <span>Includes 18% GST estimate:</span>
                  <span>₹{estimatedTax.toFixed(0)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "2px dashed #E0D6C8",
                  paddingTop: "16px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2E1A0C" }}>Total Amount:</span>
                  <div style={{ fontSize: "0.75rem", color: "#8B5E3C" }}>Prices in INR (All taxes incl.)</div>
                </div>
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#D68A45" }}>
                  ₹{(grandTotal ?? 0).toLocaleString()}
                </span>
              </div>

              {/* Checkout CTA Button */}
              <Link
                href="/checkout"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "14px 20px",
                  background: "#D68A45",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "1rem",
                  borderRadius: "10px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(214, 138, 69, 0.35)",
                  transition: "all 0.2s",
                }}
              >
                <span>Proceed to Checkout</span>
                <span>🔒</span>
              </Link>

              {/* Continue Shopping Link */}
              <Link
                href="/products"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "14px",
                  fontSize: "0.85rem",
                  color: "#8B5E3C",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                ← Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #F0E8DE", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#666" }}>
                  <span>🛡️</span>
                  <span>100% Genuine Direct Factory Corrugated Quality</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#666" }}>
                  <span>⚡</span>
                  <span>48-Hour Priority Dispatch Across India</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
