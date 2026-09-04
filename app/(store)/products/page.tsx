"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS, Product } from "@/lib/products-data";
import { useCart } from "@/components/store/cart-context";

export default function ProductsPage() {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLengths, setSelectedLengths] = useState<number[]>([]);
  const [selectedWidths, setSelectedWidths] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("search") || params.get("q") || params.get("query");
      if (q) {
        setSearchQuery(q);
      }
    }
  }, []);


  const toggleLength = (l: number) => {
    setSelectedLengths((prev) =>
      prev.includes(l) ? prev.filter((item) => item !== l) : [...prev, l]
    );
  };

  const toggleWidth = (w: number) => {
    setSelectedWidths((prev) =>
      prev.includes(w) ? prev.filter((item) => item !== w) : [...prev, w]
    );
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesDim = product.size_inches.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDim) return false;
      }

      // Length filter
      if (selectedLengths.length > 0) {
        if (!selectedLengths.includes(Math.round(product.length_in))) {
          return false;
        }
      }

      // Width filter
      if (selectedWidths.length > 0) {
        if (!selectedWidths.includes(Math.round(product.width_in))) {
          return false;
        }
      }

      // Max price filter (Pack of 500)
      if (product.prices["500"] && product.prices["500"] > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") {
        return a.prices["500"] / 500 - b.prices["500"] / 500;
      }
      if (sortBy === "price-high") {
        return b.prices["500"] / 500 - a.prices["500"] / 500;
      }
      if (sortBy === "size-low") {
        return a.length_in * a.width_in - b.length_in * b.width_in;
      }
      if (sortBy === "size-high") {
        return b.length_in * b.width_in - a.length_in * a.width_in;
      }
      return 0;
    });
  }, [selectedCategory, searchQuery, selectedLengths, selectedWidths, maxPrice, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 50, "50 Pcs");
    setIsCartOpen(true);
  };

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs-container">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Products</span>
          </div>
        </div>
      </div>

      {/* SHOP BY CATEGORY (OUR PRODUCTS) */}
      <section className="category-section section" id="products">
        <div className="container">
          <div className="section-head reveal-up visible" style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 className="section-title" style={{ fontSize: "2.2rem", fontWeight: 800, color: "#2B2B2B", marginBottom: "8px" }}>
              Our Products
            </h2>
            <p className="section-sub" style={{ fontSize: "1rem", color: "#555555" }}>
              High-quality packaging solutions for every need
            </p>
          </div>
          <div className="category-grid">
            {/* 1. Mailer Boxes */}
            <Link href="/category/mailer-boxes" className="cat-card reveal-up visible" id="cat-mailer">
              <div className="cat-img-box">
                <img src="/images/mailer-boxes.png" alt="Mailer Boxes" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Mailer Boxes</h3>
                <p className="cat-desc">Sturdy and secure boxes perfect for e-commerce deliveries.</p>
              </div>
            </Link>

            {/* 2. Corrugated Boxes */}
            <Link href="/category/corrugated-boxes" className="cat-card reveal-up visible" id="cat-corrugated">
              <div className="cat-img-box">
                <img src="/images/corrugated-boxes.png" alt="Corrugated Boxes" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Corrugated Boxes</h3>
                <p className="cat-desc">Strong and durable corrugated boxes for safe packaging and shipping.</p>
              </div>
            </Link>

            {/* 3. Shipping Boxes */}
            <Link href="/category/shipping-boxes" className="cat-card reveal-up visible" id="cat-shipping">
              <div className="cat-img-box">
                <img src="/images/shipping-boxes.png" alt="Shipping Boxes" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Shipping Boxes</h3>
                <p className="cat-desc">Reliable shipping boxes designed to protect your products.</p>
              </div>
            </Link>

            {/* 4. Pizza Boxes */}
            <Link href="/category/pizza-boxes" className="cat-card reveal-up visible" id="cat-pizza">
              <div className="cat-img-box">
                <img src="/images/pizza-boxes.png" alt="Pizza Boxes" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Pizza Boxes</h3>
                <p className="cat-desc">Heat-resistant pizza boxes that keep your pizza fresh and hot.</p>
              </div>
            </Link>

            {/* 5. Mono Cartons */}
            <Link href="/category/mono-cartons" className="cat-card reveal-up visible" id="cat-mono">
              <div className="cat-img-box">
                <img src="/images/mono-cartons.png" alt="Mono Cartons" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Mono Cartons</h3>
                <p className="cat-desc">Premium mono cartons for cosmetics, food, and retail packaging.</p>
              </div>
            </Link>

            {/* 6. Courier Bags */}
            <Link href="/category/courier-bags" className="cat-card reveal-up visible" id="cat-courier">
              <div className="cat-img-box">
                <img src="/images/courier-bags.png" alt="Courier Bags" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Courier Bags</h3>
                <p className="cat-desc">Lightweight and tamper-proof courier bags for secure deliveries.</p>
              </div>
            </Link>

            {/* 7. Paper Bags */}
            <Link href="/category/paper-bags" className="cat-card reveal-up visible" id="cat-paperbag">
              <div className="cat-img-box">
                <img src="/images/paper-bags.png" alt="Paper Bags" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Paper Bags</h3>
                <p className="cat-desc">Eco-friendly paper bags for shopping, retail, and promotional use.</p>
              </div>
            </Link>

            {/* 8. Tape Rolls */}
            <Link href="/accessories" className="cat-card reveal-up visible" id="cat-tape">
              <div className="cat-img-box">
                <img src="/images/tape-rolls.png" alt="Tape Rolls" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Tape Rolls</h3>
                <p className="cat-desc">High-quality adhesive tape rolls for secure sealing and packaging.</p>
              </div>
            </Link>

            {/* 9. Bubble Wrap */}
            <Link href="/accessories" className="cat-card reveal-up visible" id="cat-bubble">
              <div className="cat-img-box">
                <img src="/images/bubble-wrap.png" alt="Bubble Wrap" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Bubble Wrap</h3>
                <p className="cat-desc">Protective bubble wrap for cushioning and safeguarding your items.</p>
              </div>
            </Link>

            {/* 10. Corrugated Rolls */}
            <Link href="/accessories" className="cat-card reveal-up visible" id="cat-corrroll">
              <div className="cat-img-box">
                <img src="/images/corrugated-rolls.png" alt="Corrugated Rolls" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Corrugated Rolls</h3>
                <p className="cat-desc">Durable corrugated rolls for wrapping, cushioning, and packaging.</p>
              </div>
            </Link>

            {/* 11. Corrugated Sheets */}
            <Link href="/accessories" className="cat-card reveal-up visible" id="cat-sheets">
              <div className="cat-img-box">
                <img src="/images/corrugated-sheets.png" alt="Corrugated Sheets" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Corrugated Sheets</h3>
                <p className="cat-desc">High-strength corrugated sheets for packaging and industrial use.</p>
              </div>
            </Link>

            {/* 12. Custom Printed Boxes */}
            <Link href="/custom-boxes" className="cat-card reveal-up visible" id="cat-printed">
              <div className="cat-img-box">
                <img src="/images/custom-printed-boxes.png" alt="Custom Printed Boxes" loading="lazy" />
              </div>
              <div className="cat-info">
                <h3 className="cat-name">Custom Printed Boxes</h3>
                <p className="cat-desc">Custom printed boxes to elevate your brand and leave a lasting impression.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* DYNAMIC PRODUCTS CATALOG */}
      <section className="featured-section section" id="accessories" style={{ background: "#FFFFFF", padding: "60px 0" }}>
        <div className="container">
          <div className="section-head reveal-up visible" style={{ marginBottom: "28px" }}>
            <span
              className="section-tag"
              style={{
                fontSize: "0.85rem",
                padding: "8px 20px",
                color: "#FFFFFF",
                background: "#D68A45",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: "12px",
                display: "inline-block",
                borderRadius: "20px",
              }}
            >
              Packing Options
            </span>
            <p className="section-sub" style={{ color: "#2B2B2B", fontWeight: 500, fontSize: "1.05rem" }}>
              Extracting sizes, dimensions, and prices dynamically from catalog database.
            </p>
          </div>

          <div className="catalog-layout">
            {/* Left sidebar with dynamic filters */}
            <aside className="catalog-sidebar">
              {/* Product Type & Search Filter */}
              <div className="filter-group">
                <h4 className="filter-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Product Type
                </h4>
                <div className="search-input-wrap" style={{ marginBottom: "12px", position: "relative" }}>
                  <select
                    id="catalog-category-select"
                    className="search-sidebar-input"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      paddingLeft: "14px",
                      appearance: "auto",
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "#2B2B2B",
                      background: "#FFFFFF",
                    }}
                  >
                    <option value="all">All Product Types</option>
                    <option value="mailer-boxes">Flap Mailer Box</option>
                    <option value="shipping-boxes">Corrugated Box</option>
                    <option value="custom-printed-boxes">Custom Printed Box</option>
                    <option value="mono-cartons">Mono Folding Carton</option>
                    <option value="corrugated-boxes">Corrugated Cartons</option>
                    <option value="pizza-boxes">Pizza Box</option>
                    <option value="courier-bags">Courier Bags</option>
                    <option value="paper-bags">Paper Bags</option>
                    <option value="tape-rolls">Tape Rolls</option>
                    <option value="bubble-wrap">Bubble Wrap</option>
                    <option value="corrugated-rolls">Corrugated Paper Roll</option>
                    <option value="corrugated-sheets">Corrugated Sheets</option>
                  </select>
                </div>

                <div className="search-input-wrap" style={{ marginTop: "14px" }}>
                  <input
                    type="text"
                    id="catalog-search"
                    className="search-sidebar-input"
                    placeholder="Search by name or size..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Length filter */}
              <div className="filter-group">
                <h4 className="filter-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2">
                    <path d="M21 6H3v12h18V6z" />
                    <path d="M6 6v4" />
                    <path d="M10 6v4" />
                    <path d="M14 6v4" />
                    <path d="M18 6v4" />
                  </svg>
                  Length (inches)
                </h4>
                <div className="filter-list">
                  {[2, 4, 5, 6, 8].map((l) => (
                    <label key={l} className="filter-item">
                      <input
                        type="checkbox"
                        className="filter-length"
                        checked={selectedLengths.includes(l)}
                        onChange={() => toggleLength(l)}
                      />
                      <span>{l} Inch</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Width filter */}
              <div className="filter-group">
                <h4 className="filter-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2">
                    <path d="M21 6H3v12h18V6z" />
                    <path d="M6 6v4" />
                    <path d="M10 6v4" />
                    <path d="M14 6v4" />
                    <path d="M18 6v4" />
                  </svg>
                  Width (inches)
                </h4>
                <div className="filter-list">
                  {[2, 3, 4, 5, 6, 8].map((w) => (
                    <label key={w} className="filter-item">
                      <input
                        type="checkbox"
                        className="filter-width"
                        checked={selectedWidths.includes(w)}
                        onChange={() => toggleWidth(w)}
                      />
                      <span>{w} Inch</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="filter-group">
                <h4 className="filter-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2">
                    <path d="M6 3h12" />
                    <path d="M6 8h12" />
                    <path d="M6 13h7a4 4 0 0 0 0-8" />
                    <path d="M6 13l7 8" />
                  </svg>
                  Max Price (Pack of 500)
                </h4>
                <div className="price-slider-wrap">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "0.78rem", color: "#78736E" }}>₹300</span>
                    <input
                      type="range"
                      id="price-range-slider"
                      min="300"
                      max="15000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={{ flex: 1, accentColor: "#8B5E3C", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.78rem", color: "#78736E" }}>₹15000</span>
                  </div>
                  <div style={{ textAlign: "right", fontWeight: 600, fontSize: "0.85rem", color: "#8B5E3C", marginTop: "8px" }}>
                    Selected: Max ₹<span id="price-slider-value">{maxPrice}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right product catalog content */}
            <main className="catalog-content">
              {/* Controls bar */}
              <div
                className="catalog-controls"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #ECE4DA",
                  paddingBottom: "16px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <span id="catalog-results-count" style={{ fontSize: "0.88rem", color: "#78736E", fontWeight: 500 }}>
                    Showing {filteredProducts.length} of {PRODUCTS.length} results
                  </span>
                </div>

                <div className="control-selectors" style={{ display: "flex", gap: "14px" }}>
                  <div className="selector-item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="selector-label" style={{ fontSize: "0.82rem", color: "#78736E" }}>
                      Sort by
                    </span>
                    <select
                      id="sort-by-select"
                      className="selector-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        border: "1px solid #D8C9B4",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "0.85rem",
                        background: "#FFFFFF",
                        outline: "none",
                      }}
                    >
                      <option value="default">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="size-low">Size: Small to Large</option>
                      <option value="size-high">Size: Large to Small</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Product Grid */}
              <div id="dynamic-products-grid" className="dynamic-products-grid">
                {filteredProducts.length === 0 ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", background: "#F7F2EC", borderRadius: "12px" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#2B2B2B", marginBottom: "8px" }}>
                      No matching products found
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "#78736E", marginBottom: "16px" }}>
                      Try adjusting your search criteria or clearing filters.
                    </p>
                    <button
                      className="premium-btn-quote"
                      onClick={() => {
                        setSelectedCategory("all");
                        setSearchQuery("");
                        setSelectedLengths([]);
                        setSelectedWidths([]);
                        setMaxPrice(15000);
                        setSortBy("default");
                      }}
                      style={{ padding: "8px 18px", width: "auto" }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="premium-prod-card" id={`card-${product.id}`}>
                      <Link href={`/product/${product.slug}`} className="premium-card-img-wrap">
                        <img src={product.image} alt={product.name} loading="lazy" />
                      </Link>
                      <div className="premium-card-body">
                        <Link href={`/product/${product.slug}`} style={{ textDecoration: "none" }}>
                          <h3 className="premium-card-title">{product.name}</h3>
                        </Link>
                        <div className="premium-sizes-row">
                          <span className="premium-size-tag">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2">
                              <path d="M21 6H3v12h18V6z" />
                              <path d="M6 6v4" />
                              <path d="M10 6v4" />
                              <path d="M14 6v4" />
                              <path d="M18 6v4" />
                            </svg>
                            {product.size_inches}
                          </span>
                        </div>
                        <p className="premium-card-desc">{product.description}</p>

                        {product.features && product.features.length > 0 && (
                          <div className="premium-card-features-list">
                            {product.features.slice(0, 4).map((feat, idx) => (
                              <span key={idx} className="premium-card-feature-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {feat}
                              </span>
                            ))}
                          </div>
                        )}

                        <table className="premium-pricing-table">
                          <thead>
                            <tr>
                              <th>Qty</th>
                              <th>Price/Pc</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>50 Pcs</td>
                              <td>₹{(product.prices["50"] / 50).toFixed(2)}</td>
                              <td>₹{product.prices["50"]}</td>
                            </tr>
                            <tr>
                              <td>100 Pcs</td>
                              <td>₹{(product.prices["100"] / 100).toFixed(2)}</td>
                              <td>₹{product.prices["100"]}</td>
                            </tr>
                            <tr>
                              <td>500 Pcs</td>
                              <td>₹{(product.prices["500"] / 500).toFixed(2)}</td>
                              <td>₹{product.prices["500"]}</td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="premium-card-actions">
                          <button
                            className="premium-btn-quote"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </button>
                          <a
                            href={`https://wa.me/918000000000?text=${encodeURIComponent(
                              `Hi Box Care, I am interested in ${product.name}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="premium-btn-whatsapp"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
