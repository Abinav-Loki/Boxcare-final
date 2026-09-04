"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "./cart-context";
import { getUnitPrice } from "@/lib/products-data";

export function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, subtotal, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="cart-drawer open" id="cart-drawer" style={{ display: "block" }}>
      <div className="cart-drawer-overlay" id="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-drawer-panel" style={{ transform: "translateX(0)" }}>
        <div className="cd-header">
          <h3>🛒 Your Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
          <button className="cd-close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Free shipping progress */}
        <div style={{ background: "#F7F2EC", padding: "12px 16px", borderBottom: "1px solid #EDE3D4" }}>
          {remainingForFreeShipping > 0 ? (
            <div style={{ fontSize: "0.8rem", color: "#5C3A22", fontWeight: 600 }}>
              Add <strong>₹{remainingForFreeShipping.toFixed(0)}</strong> more to get <strong>Free Shipping!</strong>
            </div>
          ) : (
            <div style={{ fontSize: "0.8rem", color: "#15803d", fontWeight: 700 }}>
              🎉 You qualified for <strong>FREE Shipping!</strong>
            </div>
          )}
          <div style={{ background: "#EDE3D4", height: "6px", borderRadius: "3px", marginTop: "6px", overflow: "hidden" }}>
            <div style={{ background: remainingForFreeShipping === 0 ? "#15803d" : "#D68A45", height: "100%", width: `${progressToFreeShipping}%`, transition: "width 0.3s" }}></div>
          </div>
        </div>

        <div className="cd-body">
          {cart.length === 0 ? (
            <div className="cd-empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
              <span style={{ fontSize: "3rem", marginBottom: "12px" }}>📦</span>
              <p style={{ fontWeight: 600, color: "#2B2B2B", marginBottom: "16px" }}>Your shopping cart is empty</p>
              <button className="btn-primary" onClick={() => setIsCartOpen(false)}>
                Explore Products
              </button>
            </div>
          ) : (
            <ul className="cd-items" style={{ listStyle: "none", padding: "16px", margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              {cart.map((item) => {
                const unitPrice = getUnitPrice(item.product, item.quantity);
                const itemTotal = unitPrice * item.quantity;
                return (
                  <li
                    key={item.product.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      background: "#FFFFFF",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid #EDE3D4",
                    }}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: "64px", height: "64px", objectFit: "contain", borderRadius: "6px", background: "#F7F2EC" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2B2B2B", lineHeight: "1.2" }}>{item.product.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#8B5E3C", marginTop: "4px" }}>
                        Pack Size: {item.selectedSize || item.product.size_inches_short}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "2px" }}>
                        ₹{unitPrice.toFixed(2)} / pc
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                        {/* Quantity Controls */}
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "6px", overflow: "hidden" }}>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 50)}
                            style={{ padding: "4px 8px", background: "#f5f5f5", fontWeight: 700 }}
                          >
                            -
                          </button>
                          <span style={{ padding: "4px 10px", fontSize: "0.85rem", fontWeight: 600 }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 50)}
                            style={{ padding: "4px 8px", background: "#f5f5f5", fontWeight: 700 }}
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#D68A45" }}>
                          ₹{itemTotal.toFixed(2)}
                        </span>

                        {/* Delete Item */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          style={{ color: "#dc2626", fontSize: "1.1rem", padding: "2px 6px" }}
                          aria-label="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cd-footer" style={{ padding: "16px", background: "#FAF7F2", borderTop: "1px solid #EDE3D4" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem", color: "#666" }}>
              <span>Subtotal (GST Incl.):</span>
              <strong style={{ color: "#2B2B2B" }}>₹{subtotal.toFixed(2)}</strong>
            </div>
            <div className="cd-total" style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "1.1rem" }}>
              <span style={{ fontWeight: 800, color: "#2B2B2B" }}>Total Payable</span>
              <strong style={{ fontWeight: 900, color: "#8B5E3C" }}>₹{subtotal.toFixed(2)}</strong>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary"
              style={{ display: "block", textAlign: "center", width: "100%", textDecoration: "none" }}
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
