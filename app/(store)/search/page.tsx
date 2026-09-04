"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { PRODUCTS } from "@/lib/products-data";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams ? searchParams.get("q") || "" : "";

  const results = useMemo(() => {
    if (!q.trim()) return PRODUCTS;
    const query = q.toLowerCase().trim();
    const qNoSpaces = query.replace(/\s+/g, "");

    return PRODUCTS.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query);
      const catMatch = p.category.toLowerCase().includes(query);
      const catSlugMatch = p.categorySlug.toLowerCase().includes(query);
      const sizeMatch = p.size_inches.toLowerCase().includes(query);
      const sizeShortMatch = p.size_inches_short.toLowerCase().includes(query);
      const dimMatch = `${p.length_in}x${p.width_in}x${p.height_in}`.toLowerCase().includes(qNoSpaces);
      const descMatch = p.description.toLowerCase().includes(query);

      return nameMatch || catMatch || catSlugMatch || sizeMatch || sizeShortMatch || dimMatch || descMatch;
    });
  }, [q]);


  return (
    <div style={{ background: "#F7F2EC", minHeight: "100vh", padding: "40px 0 80px 0" }}>
      <div className="container">
        <div style={{ marginBottom: "32px" }}>
          <span className="section-tag">Search Results</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#2B2B2B", marginTop: "8px" }}>
            {q ? `Search results for "${q}"` : "All Packaging Products"}
          </h1>
          <p style={{ color: "#666", fontSize: "0.95rem", marginTop: "4px" }}>
            Found <strong>{results.length}</strong> matching products
          </p>
        </div>

        {results.length === 0 ? (
          <div style={{ background: "#FFF", borderRadius: "20px", padding: "60px 20px", textAlign: "center", border: "1px solid #EDE3D4" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "12px" }}>🔍</span>
            <h2 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#2B2B2B" }}>No products matched your search</h2>
            <p style={{ color: "#666", marginTop: "6px" }}>Try searching for generic terms like "mailer", "corrugated", "tape", or "4x4x2".</p>
            <Link href="/products" className="btn-primary" style={{ marginTop: "20px", display: "inline-flex" }}>
              View All Products Catalog
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
