"use client";

import React from "react";
import Link from "next/link";

export function BuilderSection3D() {
  return (
    <section className="builder-section section" id="builder" style={{ background: "var(--charcoal)", color: "#fff", padding: "80px 0" }}>
      <div className="builder-bg">
        <div className="builder-blob bb1"></div>
        <div className="builder-blob bb2"></div>
      </div>
      <div className="container" style={{ maxWidth: "1100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "48px", alignItems: "center" }}>
          <div>
            <span className="section-tag light" style={{ letterSpacing: "0.12em" }}>Interactive 3D Design Studio</span>
            <h2 className="section-title light" style={{ marginTop: "12px", fontSize: "clamp(2rem, 3vw, 2.7rem)", lineHeight: 1.25 }}>
              Interactive 3D Box Configurator
            </h2>
            <p className="section-sub light" style={{ marginBottom: "28px", fontSize: "1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>
              Design and order custom corrugated packaging engineered for your exact product specifications. Select structural box styles, board materials, custom dimensions, upload your brand logo, and view real-time 3D rotation with automated volume discount pricing.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "32px" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "14px 18px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ fontSize: "1.3rem", color: "#FAD8B4" }}>📏</span>
                <div>
                  <h5 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#FFF", marginBottom: "2px" }}>Custom Dimensions</h5>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>Specify length, width & height down to the exact cm.</p>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.05)", padding: "14px 18px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ fontSize: "1.3rem", color: "#FAD8B4" }}>🧱</span>
                <div>
                  <h5 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#FFF", marginBottom: "2px" }}>Board & Thickness</h5>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>Natural Kraft, 3-Ply, 5-Ply heavy duty & Rigid boards.</p>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.05)", padding: "14px 18px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ fontSize: "1.3rem", color: "#FAD8B4" }}>🎨</span>
                <div>
                  <h5 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#FFF", marginBottom: "2px" }}>Real-Time 3D Logo</h5>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>Upload PNG, SVG or PDF for instant 360° texture rendering.</p>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.05)", padding: "14px 18px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ fontSize: "1.3rem", color: "#FAD8B4" }}>🧮</span>
                <div>
                  <h5 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#FFF", marginBottom: "2px" }}>Instant Volume Quote</h5>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>Up to 35% bulk discount with formal GST quotation.</p>
                </div>
              </div>
            </div>

            <Link href="/custom-boxes" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "16px 32px", fontSize: "1.05rem", fontWeight: 700, borderRadius: "14px" }}>
              📦 Launch 3D Box Configurator
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "24px", padding: "28px", width: "100%", textAlign: "center", backdropFilter: "blur(14px)", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--orange-lt)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "6px" }}>
                  📦 Live 3D Studio
                </span>
                <span style={{ background: "rgba(76,175,80,0.2)", border: "1px solid rgba(76,175,80,0.4)", color: "#4CAF50", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: "12px" }}>
                  Interactive
                </span>
              </div>

              <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: "240px", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.45))" }}>
                  <polygon points="50,110 160,110 200,80 90,80" fill="#E09A55" />
                  <rect x="50" y="110" width="110" height="100" fill="#D68A45" rx="2" />
                  <polygon points="160,110 200,80 200,180 160,210" fill="#B8702A" />
                  <rect x="75" y="130" width="60" height="35" rx="4" fill="rgba(255,255,255,0.18)" />
                  <text x="85" y="152" fill="#fff" fontSize="13" fontFamily="Poppins" fontWeight="700">BOX CARE</text>
                </svg>
              </div>

              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "12px 16px", marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", color: "rgba(255,255,255,0.8)" }}>
                <span>Sample 20×14×8 cm Mailer</span>
                <strong style={{ color: "var(--orange-lt)", fontSize: "0.95rem" }}>₹12.00 / box</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
