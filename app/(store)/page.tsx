"use client";

import React from "react";
import Link from "next/link";
import { HeroBannerSlider } from "@/components/store/hero-banner-slider";
import { ShopByIndustry } from "@/components/store/shop-by-industry";
import { AllTypePackingMaterial } from "@/components/store/all-type-packing-material";
import { BuilderSection3D } from "@/components/store/builder-section-3d";
import { NewsletterSection } from "@/components/store/newsletter-section";
import { CATEGORIES } from "@/lib/products-data";
import { useLiveCms } from "@/lib/cms-data";

export default function HomePage() {
  const { cms } = useLiveCms();

  return (
    <div>
      {/* 1. HERO BANNER SLIDER */}
      <HeroBannerSlider />

      {/* 2. OUR PRODUCTS / SHOP BY CATEGORY (12 Category Cards Grid) */}
      <section className="category-section section" id="products">
        <div className="container">
          <div className="section-head reveal-up" style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 className="section-title" style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--charcoal)", marginBottom: "8px" }}>
              {cms.categoriesSection.title}
            </h2>
            <p className="section-sub" style={{ fontSize: "1rem", color: "var(--charcoal-lt)" }}>
              {cms.categoriesSection.subtitle}
            </p>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="cat-card">
                <div className="cat-img-box">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                </div>
                <div className="cat-info">
                  <h3 className="cat-name">{cat.name}</h3>
                  <p className="cat-desc">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SHOP BY INDUSTRY */}
      <ShopByIndustry />

      {/* 4. ALL TYPE PACKING MATERIAL (Filter Tabs + 4-Column Parul Grid with Quick Add) */}
      <AllTypePackingMaterial />

      {/* 5. INTERACTIVE 3D BOX CONFIGURATOR SECTION */}
      <BuilderSection3D />

      {/* 6. NEWSLETTER / STAY UPDATED SECTION */}
      <NewsletterSection />
    </div>
  );
}
