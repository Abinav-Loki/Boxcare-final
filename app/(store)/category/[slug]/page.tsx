"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductsByCategory, CATEGORIES, PRODUCTS, Product } from "@/lib/products-data";
import { useCart } from "@/components/store/cart-context";
import { NewsletterSection } from "@/components/store/newsletter-section";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "mailer-boxes";
  const { addToCart, setIsCartOpen } = useCart();

  const categoryInfo = CATEGORIES.find((c) => c.slug === slug || c.id === slug) || {
    id: slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    slug: slug,
    description: "High-strength corrugated mailer boxes engineered for e-commerce, D2C, and subscription packaging. Lock securely without tape with direct manufacturer pricing and fast nationwide shipping across India.",
    image: "/images/mailer-boxes.png",
  };

  const categoryProducts = useMemo(() => {
    const prods = getProductsByCategory(slug);
    return prods.length > 0 ? prods : PRODUCTS;
  }, [slug]);

  // Filter States
  const [inStock, setInStock] = useState<boolean>(true);
  const [outOfStock, setOutOfStock] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [selectedLengths, setSelectedLengths] = useState<string[]>([]);
  const [selectedWidths, setSelectedWidths] = useState<string[]>([]);
  const [showAllLengths, setShowAllLengths] = useState<boolean>(false);
  const [gridCols, setGridCols] = useState<number>(4);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>("best-selling");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // FAQ Expand state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleLength = (val: string) => {
    setSelectedLengths((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const toggleWidth = (val: string) => {
    setSelectedWidths((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((product) => {
        // Stock Filter
        if (inStock && !outOfStock && product.availability === "Out of Stock") return false;
        if (!inStock && outOfStock && product.availability !== "Out of Stock") return false;

        // Price Filter (unit price)
        const unitPrice = product.prices["500"] ? product.prices["500"] / 500 : 10;
        if (unitPrice < minPrice || unitPrice > maxPrice) return false;

        // Length Filter
        if (selectedLengths.length > 0) {
          const lStr = product.length_in.toString();
          if (!selectedLengths.some((sl) => lStr === sl || lStr.startsWith(sl))) {
            return false;
          }
        }

        // Width Filter
        if (selectedWidths.length > 0) {
          const wStr = product.width_in.toString();
          if (!selectedWidths.some((sw) => wStr === sw || wStr.startsWith(sw))) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const unitA = a.prices["500"] / 500;
        const unitB = b.prices["500"] / 500;
        if (sortBy === "price-low") return unitA - unitB;
        if (sortBy === "price-high") return unitB - unitA;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      })
      .slice(0, itemsPerPage);
  }, [categoryProducts, inStock, outOfStock, minPrice, maxPrice, selectedLengths, selectedWidths, sortBy, itemsPerPage]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 50, "50 Pcs");
    setIsCartOpen(true);
  };

  const CATEGORY_DETAILS: Record<
    string,
    { heading: string; subheading: string; introText: string; faqs: { q: string; a: string }[] }
  > = {
    "mailer-boxes": {
      heading: "Mailer Boxes",
      subheading: "Corrugated mailer boxes – direct from the manufacturer",
      introText:
        "High-strength corrugated mailer boxes engineered for e-commerce, D2C, and subscription packaging. Lock securely without tape with direct manufacturer pricing and fast nationwide shipping across India.",
      faqs: [
        {
          q: "Do these mailer boxes require tape to assemble?",
          a: "No! Our mailer boxes feature an interlocking flap design. They lock securely in place without tape or glue, creating a clean, high-end unboxing presentation for your customers.",
        },
        {
          q: "Can we get custom printing on both sides?",
          a: "Yes, we support double-sided printing (both inner and outer sides of the box) with full CMYK colours. Perfect for placing branding text inside the lid!",
        },
        {
          q: "Are the dimensions inner or outer?",
          a: "All dimensions listed refer to the internal usable space of the box. This ensures your products will fit perfectly inside. Add roughly 0.2 inches for external box measurements.",
        },
      ],
    },
    "corrugated-boxes": {
      heading: "Corrugated Boxes",
      subheading: "Premium shipping cartons & cardboard boxes direct from manufacturer",
      introText:
        "High-strength 3-ply and 5-ply corrugated cartons engineered for heavy storage, e-commerce dispatch, warehouse sorting, and industrial shipping with direct manufacturer pricing and nationwide delivery.",
      faqs: [
        {
          q: "What is the difference between 3-ply and 5-ply boxes?",
          a: "3-ply boxes feature three layers of paper (two liners and one inner fluting layer) suitable for items under 10 kg. 5-ply boxes have five layers (three liners and two flutings) suitable for heavier loads up to 25 kg.",
        },
        {
          q: "Can I print my company logo on these shipping boxes?",
          a: "Yes! We support custom screen printing and flexographic printing for company branding, product information, and handling instructions.",
        },
        {
          q: "Are these boxes delivered flat?",
          a: "Yes, all our cardboard boxes are shipped flat-packed to save storage space and shipping costs. They are very easy to assemble with standard packaging tape.",
        },
      ],
    },
    "tapes-packing-accessories": {
      heading: "Packaging Accessories & Fillers",
      subheading: "Tapes, protective wraps, mailing bags and raw sheets to secure your retail shipments",
      introText:
        "Premium adhesive packaging tapes, shock-absorbing air bubble wrap rolls, tamper-proof courier mailer bags, and rigid corrugated sheets direct from manufacturer.",
      faqs: [
        {
          q: "What is BOPP adhesive tape?",
          a: "BOPP stands for Biaxially Oriented Polypropylene. It is a highly durable and strong plastic backing material coated with a specialized high-adhesion acrylic adhesive layer.",
        },
        {
          q: "Can I get custom logo printing on packaging tapes?",
          a: "Yes! We manufacture custom logo-printed tapes with warnings like 'FRAGILE' or 'DO NOT ACCEPT IF SEAL BROKEN' in up to 2 colors.",
        },
        {
          q: "Are bubble wrap rolls eco-friendly and recyclable?",
          a: "Yes! Our protective bubble wrap rolls are manufactured from 100% low-density polyethylene (LDPE) which can be fully recycled.",
        },
      ],
    },
    "tape-rolls": {
      heading: "Tape Rolls",
      subheading: "Premium high-tack acrylic adhesive packaging tapes",
      introText:
        "High-tack brown, transparent, and custom-printed BOPP packaging tapes for heavy cardboard carton sealing and tamper-evident shipping.",
      faqs: [
        {
          q: "What is BOPP tape?",
          a: "BOPP stands for Biaxially Oriented Polypropylene. It is a highly durable and strong plastic backing material coated with a specialized high-adhesion adhesive layer.",
        },
        {
          q: "Can I print my brand name or caution text on the tape?",
          a: "Yes! We manufacture custom logo-printed tapes with warnings like 'FRAGILE' or 'DO NOT ACCEPT IF SEAL BROKEN' in up to 2 colors.",
        },
      ],
    },
    "bubble-wrap": {
      heading: "Bubble Wrap",
      subheading: "High-cushioning protective bubble rolls & packing material",
      introText:
        "Air-cushioned LDPE bubble wrap rolls providing ultimate shock absorption and scratch protection for glassware, electronics, and fragile items.",
      faqs: [
        {
          q: "What GSM values do your bubble wrap rolls have?",
          a: "Our standard protective bubble rolls range from 40 GSM (light protective cushion) to 80 GSM (heavy duty thick bubbles for exports).",
        },
        {
          q: "Is this wrap recyclable?",
          a: "Yes! Our bubble wrap rolls are made from 100% low-density polyethylene (LDPE) which can be recycled easily.",
        },
      ],
    },
    "corrugated-rolls": {
      heading: "Corrugated Rolls",
      subheading: "High-strength flexible corrugated cardboard wrapping rolls",
      introText:
        "Flexible C-flute single face corrugated paper rolls ideal for wrapping furniture, industrial components, and oversized items.",
      faqs: [
        {
          q: "What is the fluting type on your corrugated rolls?",
          a: "We use high-cushion 'C-flute' corrugated rolls made from 120 GSM fluting paper for optimal packing flex and cushion.",
        },
      ],
    },
    "corrugated-sheets": {
      heading: "Corrugated Sheets",
      subheading: "Premium cardboard separation sheets & partitions",
      introText:
        "Flat 3-ply and 5-ply corrugated cardboard sheets for interior carton dividers, stiffeners, and layer padding.",
      faqs: [
        {
          q: "What can I use these cardboard sheets for?",
          a: "They are perfect for layered partitions, photo backing, heavy envelope stiffness, crafting, and adding flat buffers inside larger cartons.",
        },
      ],
    },
    "courier-bags": {
      heading: "Courier Bags",
      subheading: "Lightweight and tamper-proof mailers for secure deliveries",
      introText:
        "Waterproof, tear-resistant poly courier mailer bags with hot-melt adhesive tamper-evident seal for e-commerce dispatch.",
      faqs: [
        {
          q: "Are courier bags tamper-evident?",
          a: "Yes! Once sealed with the hot-melt peel-and-seal strip, opening the bag tears the poly film cleanly, proving any tampering.",
        },
      ],
    },
  };

  const currentCategoryDetail = CATEGORY_DETAILS[slug] || {
    heading: categoryInfo.name,
    subheading: `${categoryInfo.name} – direct from the manufacturer`,
    introText: categoryInfo.description,
    faqs: [
      {
        q: `What products are available in ${categoryInfo.name}?`,
        a: `We offer a wide variety of dimensions and specifications in our ${categoryInfo.name} collection, manufactured using high-grade corrugated paperboard.`,
      },
      {
        q: "Can we get custom logo printing?",
        a: "Yes! We support custom screen printing and flexographic printing for company branding and product information.",
      },
      {
        q: "Do you ship nationwide across India?",
        a: "Yes, we offer fast nationwide shipping with same-day dispatch before 2 PM.",
      },
    ],
  };

  const faqs = currentCategoryDetail.faqs;

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs-container">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span className="separator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <Link href="/products">Products</Link>
            <span className="separator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <span className="current">{currentCategoryDetail.heading}</span>
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

      {/* Catalog Content Section */}
      <section className="catalog-section">
        <div className="container">
          {/* Header Info Block */}
          <div className="catalog-title-block">
            <h1>{currentCategoryDetail.heading}</h1>
            <h2>{currentCategoryDetail.subheading}</h2>
            <p className="intro-text">{currentCategoryDetail.introText}</p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-toggle-container">
            <button
              className="mobile-filter-btn"
              id="mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>{mobileFilterOpen ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>

          <div className="catalog-layout">
            {/* Left Sidebar with Accordion Filters */}
            <aside className={`catalog-sidebar ${mobileFilterOpen ? "open" : ""}`}>
              {/* Filter Group: Availability */}
              <div className="filter-group">
                <h4 className="filter-title">Availability</h4>
                <div className="filter-list">
                  <label className="filter-item">
                    <input
                      type="checkbox"
                      id="stock-in"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                    />
                    <span>In Stock</span>
                    <span className="count">(17)</span>
                  </label>
                  <label className="filter-item">
                    <input
                      type="checkbox"
                      id="stock-out"
                      checked={outOfStock}
                      onChange={(e) => setOutOfStock(e.target.checked)}
                    />
                    <span>Out of Stock</span>
                    <span className="count">(3)</span>
                  </label>
                </div>
              </div>

              {/* Filter Group: Price */}
              <div className="filter-group">
                <h4 className="filter-title">Price</h4>
                <div className="price-slider-wrap">
                  <div className="range-slider-container">
                    <div className="range-slider-track" style={{ left: `${(minPrice / 100) * 100}%`, right: `${100 - (maxPrice / 100) * 100}%` }}></div>
                  </div>
                  <div className="range-slider-input">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                  </div>
                  <div className="price-inputs">
                    <div className="price-input-box">
                      <span>₹</span>
                      <input
                        type="number"
                        value={minPrice}
                        min="0"
                        max="100"
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                      />
                    </div>
                    <span>to</span>
                    <div className="price-input-box">
                      <span>₹</span>
                      <input
                        type="number"
                        value={maxPrice}
                        min="0"
                        max="100"
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <button className="price-apply-btn" id="price-apply-btn">
                    Apply
                  </button>
                </div>
              </div>

              {/* Filter Group: Length (inches) */}
              <div className="filter-group">
                <h4 className="filter-title">Length (inches)</h4>
                <div className="filter-list">
                  {["3", "4", "5", "5.5", "6", "7"].map((val) => (
                    <label key={val} className="filter-item">
                      <input
                        type="checkbox"
                        className="filter-length"
                        value={val}
                        checked={selectedLengths.includes(val)}
                        onChange={() => toggleLength(val)}
                      />
                      <span>{val}″</span>
                      <span className="count">(2)</span>
                    </label>
                  ))}

                  {showAllLengths &&
                    ["8", "9", "10", "11", "12"].map((val) => (
                      <label key={val} className="filter-item">
                        <input
                          type="checkbox"
                          className="filter-length"
                          value={val}
                          checked={selectedLengths.includes(val)}
                          onChange={() => toggleLength(val)}
                        />
                        <span>{val}″</span>
                        <span className="count">(2)</span>
                      </label>
                    ))}

                  <button
                    type="button"
                    className="show-all-btn"
                    onClick={() => setShowAllLengths(!showAllLengths)}
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    <span>{showAllLengths ? "Show less" : "Show all"}</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={showAllLengths ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Filter Group: Width (inches) */}
              <div className="filter-group">
                <h4 className="filter-title">Width (inches)</h4>
                <div className="filter-list">
                  {["2", "3", "4", "5", "6", "8", "9", "10"].map((val) => (
                    <label key={val} className="filter-item">
                      <input
                        type="checkbox"
                        className="filter-width"
                        value={val}
                        checked={selectedWidths.includes(val)}
                        onChange={() => toggleWidth(val)}
                      />
                      <span>{val}″</span>
                      <span className="count">(2)</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Product Catalog Container */}
            <main className="catalog-content">
              {/* Controls Bar */}
              <div className="catalog-controls">
                <div className="view-as-wrap">
                  <span className="view-as-label">View As</span>
                  <div className="view-as-options">
                    <button
                      className={`grid-btn ${gridCols === 1 ? "active" : ""}`}
                      onClick={() => setGridCols(1)}
                      aria-label="List view"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    </button>
                    <button
                      className={`grid-btn ${gridCols === 2 ? "active" : ""}`}
                      onClick={() => setGridCols(2)}
                      aria-label="2 columns"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M12 3v18" />
                      </svg>
                    </button>
                    <button
                      className={`grid-btn ${gridCols === 3 ? "active" : ""}`}
                      onClick={() => setGridCols(3)}
                      aria-label="3 columns"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 3v18" />
                        <path d="M15 3v18" />
                      </svg>
                    </button>
                    <button
                      className={`grid-btn ${gridCols === 4 ? "active" : ""}`}
                      onClick={() => setGridCols(4)}
                      aria-label="4 columns"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                    </button>
                    <button
                      className={`grid-btn ${gridCols === 5 ? "active" : ""}`}
                      onClick={() => setGridCols(5)}
                      aria-label="5 columns"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M3 15h18" />
                        <path d="M9 3v18" />
                        <path d="M15 3v18" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="control-selectors">
                  <div className="selector-item">
                    <span className="selector-label">Items per page</span>
                    <select
                      id="items-per-page-select"
                      className="selector-select"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value={20}>20</option>
                      <option value={40}>40</option>
                      <option value={60}>60</option>
                    </select>
                  </div>

                  <div className="selector-item">
                    <span className="selector-label">Sort by</span>
                    <select
                      id="sort-by-select"
                      className="selector-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="best-selling">Best selling</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "16px", fontSize: "0.82rem", color: "#6B6B6B" }}>
                <span id="catalog-results-count">
                  Showing 1–{filteredProducts.length} of {categoryProducts.length} results
                </span>
              </div>

              {/* Dynamic Product Grid */}
              <div className={`catalog-products-grid grid-${gridCols}`} id="catalog-products-grid">
                {filteredProducts.map((product) => {
                  const minUnitPrice = (product.prices["500"] / 500).toFixed(2);
                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="catalog-prod-card"
                      id={`card-${product.id}`}
                    >
                      {product.availability === "Out of Stock" ? (
                        <span className="discount-badge" style={{ background: "#78736E", color: "#FFFFFF" }}>OUT OF STOCK</span>
                      ) : (
                        <span className="discount-badge">{product.isPopular ? "BEST SELLER" : "-10%"}</span>
                      )}
                      <div className="img-container">
                        <img src={product.image} alt={product.name} className="catalog-prod-img" loading="lazy" />
                      </div>

                      <div className="info-container">
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} viewBox="0 0 24 24" style={{ width: "13px", height: "13px", fill: "#F59E0B", color: "#F59E0B" }}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                          <span>({product.reviewsCount || 128})</span>
                        </div>

                        <h3 className="size-name">{product.name}</h3>

                        <div className="price-starts">
                          Starts From: <strong>₹{(product.prices["50"] / 50).toFixed(2)} - ₹{(product.prices["500"] / 500).toFixed(2)}</strong>
                        </div>

                        <button
                          className="quick-add-btn"
                          disabled={product.availability === "Out of Stock"}
                          style={product.availability === "Out of Stock" ? { background: "var(--beige-xdk, #D8C9B4)", cursor: "not-allowed", boxShadow: "none" } : {}}
                          onClick={(e) => handleQuickAdd(e, product)}
                        >
                          {product.availability === "Out of Stock" ? "Out Of Stock" : "Quick Add"}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* PRODUCT CATALOG SPECIFIC FAQ */}
      <section className="faq-section section">
        <div className="container">
          <div className="section-head" style={{ textAlign: "center", marginBottom: "32px" }}>
            <span className="section-tag" style={{ fontSize: "0.78rem", padding: "6px 18px", color: "#5C3A22", background: "#FAD8B4", fontWeight: 700, letterSpacing: "0.14em", marginBottom: "14px", display: "inline-block", borderRadius: "9999px", textTransform: "uppercase" }}>
              Catalog FAQ
            </span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#2B2B2B", marginTop: "8px" }}>
              {categoryInfo.name} FAQ
            </h2>
            <p className="section-sub" style={{ fontSize: "1rem", color: "#6B6B6B", marginTop: "8px", maxWidth: "560px", margin: "8px auto 0" }}>
              Everything you need to know about our cardboard mailing boxes.
            </p>
          </div>

          <div className="faq-grid">
            <div className="faq-list">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={`faq-item ${isOpen ? "open" : ""}`}>
                    <button
                      className="faq-q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    >
                      <span>{faq.q}</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                    <div className="faq-a">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Card */}
            <div className="faq-contact-card">
              <div className="fcc-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h3>Need custom sizes?</h3>
              <p>Talk directly with our packaging engineers to manufacture custom dies for your brand.</p>
              <div className="fcc-contacts">
                <a href="tel:+918000000000" className="fcc-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +91 80000 00000
                </a>
                <a href="mailto:hello@boxcare.in" className="fcc-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  hello@boxcare.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
