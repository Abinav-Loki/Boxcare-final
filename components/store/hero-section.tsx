"use client";

import React from "react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="hero"
      style={{
        background: "linear-gradient(135deg, #F7F2EC 0%, #EDE3D4 100%)",
        padding: "60px 0 80px 0",
        borderBottom: "1px solid #E5D8C8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "48px", alignItems: "center" }}>
          {/* Left Hero Content */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#FAD8B4",
                color: "#5C3A22",
                fontWeight: 700,
                fontSize: "0.8rem",
                padding: "6px 16px",
                borderRadius: "20px",
                marginBottom: "20px",
              }}
            >
              <span>📦 MOQ Starting at Just 50 Boxes</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                color: "#2B2B2B",
                lineHeight: 1.15,
                marginBottom: "20px",
                letterSpacing: "-0.02em",
              }}
            >
              Premium Custom Cardboard Packaging for D2C Brands
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "#555",
                lineHeight: 1.6,
                marginBottom: "32px",
                maxWidth: "540px",
              }}
            >
              Elevate your unboxing experience with eco-friendly mailer boxes, corrugated cartons, and custom printed packaging. GST-inclusive prices with factory-direct savings across India.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
              <Link href="/custom-boxes" className="btn-primary" style={{ padding: "16px 36px", fontSize: "1rem" }}>
                ✨ Design Custom Box
              </Link>
              <Link href="/products" className="btn-outline" style={{ padding: "16px 32px", fontSize: "1rem" }}>
                📦 Browse Catalog
              </Link>
            </div>

            {/* Trust highlights */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", paddingTop: "20px", borderTop: "1px solid rgba(139,94,60,0.15)" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#8B5E3C" }}>1,000+</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>D2C Brands Served</div>
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#8B5E3C" }}>50L+</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>Boxes Shipped</div>
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#8B5E3C" }}>4.9 ★</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "28px",
                padding: "24px",
                boxShadow: "0 20px 60px rgba(43,43,43,0.12)",
                border: "1px solid #EDE3D4",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "#15803d",
                  color: "#FFF",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  padding: "4px 12px",
                  borderRadius: "12px",
                }}
              >
                100% Eco-Friendly Kraft
              </span>

              <img
                src="/images/box_4_4_2.png"
                alt="Box Care Premium Flap Mailer Box"
                style={{ width: "100%", maxHeight: "380px", objectFit: "contain" }}
              />

              <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F7F2EC", padding: "12px 16px", borderRadius: "12px" }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#2B2B2B", display: "block" }}>
                    Kraft Flap Mailer Box
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#8B5E3C" }}>4&quot; x 4&quot; x 2&quot; • Self-Locking Flaps</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontWeight: 900, fontSize: "1.2rem", color: "#D68A45" }}>₹5.75</span>
                  <span style={{ fontSize: "0.7rem", color: "#666", display: "block" }}>/ box @ 500 pcs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
