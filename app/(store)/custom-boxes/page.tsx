"use client";

import React from "react";
import Link from "next/link";
import { CustomBoxCalculator } from "@/components/store/custom-box-calculator";

export default function CustomBoxesPage() {
  return (
    <main style={{ background: "#2B2B2B", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs-container" style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 0" }}>
        <div className="container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div className="breadcrumbs" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
              Home
            </Link>
            <span className="separator">/</span>
            <span className="current" style={{ color: "var(--orange-lt, #FAD8B4)", fontWeight: 600 }}>
              Custom Boxes
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive 3D Custom Box Configurator */}
      <CustomBoxCalculator />
    </main>
  );
}
