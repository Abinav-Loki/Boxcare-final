"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NewsletterSection } from "@/components/store/newsletter-section";

const INDUSTRIES_DATA = [
  {
    id: "ind-food",
    name: "Food Packaging",
    slug: "mono-cartons",
    link: "/category/mono-cartons",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 2v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V2" />
        <path d="M12 2v20" />
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      </svg>
    ),
  },
  {
    id: "ind-cloud",
    name: "Cloud Kitchen",
    slug: "mono-cartons",
    link: "/category/mono-cartons",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 13.87A8 8 0 0 1 17.65 6a8 8 0 0 1 3.85 11.23" />
        <path d="M6 17h14" />
        <path d="M6 21h14" />
      </svg>
    ),
  },
  {
    id: "ind-pizza",
    name: "Pizza Boxes",
    slug: "pizza-boxes",
    link: "/category/pizza-boxes",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: "ind-sweet",
    name: "Sweet & Mithai Boxes",
    slug: "mono-cartons",
    link: "/category/mono-cartons",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
        <path d="M4 16h16" />
        <path d="M12 11V3" />
        <path d="M12 3L8 7" />
        <path d="M12 3l4 4" />
      </svg>
    ),
  },
  {
    id: "ind-bakery",
    name: "Bakery Boxes",
    slug: "mono-cartons",
    link: "/category/mono-cartons",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12" />
        <path d="M6 12h12" />
      </svg>
    ),
  },
  {
    id: "ind-cosmetics",
    name: "Cosmetics & Beauty",
    slug: "custom-printed-boxes",
    link: "/category/custom-printed-boxes",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
      </svg>
    ),
  },
  {
    id: "ind-pharma",
    name: "Pharma & Medicine",
    slug: "mono-cartons",
    link: "/category/mono-cartons",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 5v14" />
      </svg>
    ),
  },
  {
    id: "ind-electronics",
    name: "Electronics",
    slug: "corrugated-boxes",
    link: "/category/corrugated-boxes",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M15 2v2" />
        <path d="M15 20v2" />
        <path d="M2 15h2" />
        <path d="M2 9h2" />
        <path d="M20 15h2" />
        <path d="M20 9h2" />
        <path d="M9 2v2" />
        <path d="M9 20v2" />
      </svg>
    ),
  },
  {
    id: "ind-fashion",
    name: "Fashion & Apparel",
    slug: "mailer-boxes",
    link: "/category/mailer-boxes",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
  {
    id: "ind-gifts",
    name: "Gift & Festive",
    slug: "custom-printed-boxes",
    link: "/category/custom-printed-boxes",
    image: "https://images.unsplash.com/photo-1513201099705-a9746072228f?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="14" x="3" y="8" rx="2" />
        <path d="M12 5a3 3 0 1 0-3 3" />
        <path d="M12 5a3 3 0 1 1 3 3" />
        <path d="M12 8v14" />
        <path d="M3 13h18" />
      </svg>
    ),
  },
  {
    id: "ind-restaurant",
    name: "Restaurant & QSR",
    slug: "mono-cartons",
    link: "/category/mono-cartons",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
        <path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
        <path d="M18 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
        <path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
        <path d="M10 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
        <path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
      </svg>
    ),
  },
  {
    id: "ind-marketplace",
    name: "Marketplace Sellers",
    slug: "mailer-boxes",
    link: "/category/mailer-boxes",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=75",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
  },
];

export default function IndustriesPage() {
  const router = useRouter();

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs-container">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span className="separator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <span className="current">Industries</span>
          </div>

          <div className="back-to-categories-wrap" style={{ margin: "0" }}>
            <button
              onClick={() => router.back()}
              className="back-category-btn"
              style={{ padding: "5px 12px", fontSize: "0.78rem", borderRadius: "8px" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* SHOP BY INDUSTRY SECTION */}
      <section className="industry-section section" id="industries" style={{ background: "var(--beige)", padding: "40px 0 80px 0" }}>
        <div className="container">
          <div className="section-head reveal-up visible" style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="section-tag">Industries We Serve</span>
            <h1
              className="section-title"
              style={{ fontSize: "2.4rem", fontWeight: 800, color: "#2B2B2B", marginTop: "8px" }}
            >
              Shop by Industry
            </h1>
            <p
              className="section-sub"
              style={{ color: "#666", maxWidth: "680px", margin: "12px auto 0 auto", fontSize: "1.05rem" }}
            >
              Packaging solutions tailored for every sector — from food to fashion.
            </p>
          </div>

          <div className="industry-grid">
            {INDUSTRIES_DATA.map((ind, idx) => (
              <Link
                key={ind.id}
                href={ind.link}
                className="ind-card reveal-up visible"
                id={ind.id}
                style={{ animationDelay: `${(idx + 1) * 0.03}s` }}
              >
                <Image
                  src={ind.image}
                  alt={ind.name}
                  width={500}
                  height={330}
                  className="ind-img"
                  style={{ objectFit: "cover" }}
                />
                <div className="ind-overlay">
                  {ind.icon}
                  <span>{ind.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}
