"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/lib/products-data";
import { useCart } from "@/components/store/cart-context";
import { NewsletterSection } from "@/components/store/newsletter-section";

const SUB_CATEGORIES = [
  {
    name: "Tape Rolls",
    slug: "tape-rolls",
    desc: "High-quality adhesive tape rolls for secure sealing.",
    image: "/images/tape-rolls.png",
  },
  {
    name: "Bubble Wrap",
    slug: "bubble-wrap",
    desc: "Protective bubble wrap for cushioning.",
    image: "/images/bubble-wrap.png",
  },
  {
    name: "Courier Bags",
    slug: "courier-bags",
    desc: "Lightweight and tamper-proof mailers.",
    image: "/images/courier-bags.png",
  },
  {
    name: "Corrugated Rolls",
    slug: "corrugated-rolls",
    desc: "Durable rolls for protective wrapping.",
    image: "/images/corrugated-rolls.png",
  },
  {
    name: "Corrugated Sheets",
    slug: "corrugated-sheets",
    desc: "High-strength flat cardboard sheets.",
    image: "/images/corrugated-sheets.png",
  },
];

const FEATURED_PRODUCTS = [
  {
    id: "kraft-tape-featured",
    slug: "2-inch-brown-tape-65m",
    name: "Brown Kraft Adhesive Tape",
    desc: "Heavy-duty sealing tape with strong adhesion. 48mm × 66m.",
    price: 45,
    oldPrice: 60,
    unitTag: "/ roll",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=75",
    productObj: {
      id: "tp-1",
      slug: "2-inch-brown-tape-65m",
      name: "Brown Kraft Adhesive Tape",
      category: "Tape Rolls",
      categorySlug: "tape-rolls",
      categoryId: "tapes-packing-accessories",
      size_inches: "48mm × 66m",
      size_inches_short: "48mm x 66m",
      size_cm: "4.8 cm x 6600 cm",
      length_in: 66,
      width_in: 1.88,
      height_in: 1.88,
      length_cm: 6600,
      width_cm: 4.8,
      height_cm: 4.8,
      description: "Heavy-duty sealing tape with strong adhesion. 48mm × 66m.",
      features: ["Heavy-Duty Sealing", "Strong Adhesion"],
      prices: { "50": 2250, "100": 4500, "300": 13500, "500": 22500 },
      contact_number: "+91 89039 27262",
      availability: "In Stock",
      image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=75",
      specifications: { Item: "Kraft Adhesive Tape", Width: "48mm", Length: "66m" },
      rating: 4.9,
      reviewsCount: 150,
      isPopular: true,
    } as Product,
  },
  {
    id: "poly-bags-featured",
    slug: "poly-courier-mailer-bags-pack-100",
    name: "Poly Courier Mailer Bags",
    desc: "Tamper-proof, waterproof courier bags for e-commerce orders.",
    price: 8,
    oldPrice: 12,
    unitTag: "/ bag",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=75",
    productObj: {
      id: "cb-bag-1",
      slug: "poly-courier-mailer-bags-pack-100",
      name: "Poly Courier Mailer Bags",
      category: "Courier Bags",
      categorySlug: "courier-bags",
      categoryId: "tapes-packing-accessories",
      size_inches: "10 inch X 12 inch",
      size_inches_short: "10x12",
      size_cm: "25.4 cm x 30.48 cm",
      length_in: 10,
      width_in: 12,
      height_in: 0.1,
      length_cm: 25.4,
      width_cm: 30.48,
      height_cm: 0.25,
      description: "Tamper-proof, waterproof courier bags for e-commerce orders.",
      features: ["Tamper-Proof Seal", "Waterproof Poly Film"],
      prices: { "50": 400, "100": 800, "300": 2400, "500": 4000 },
      contact_number: "+91 89039 27262",
      availability: "In Stock",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=75",
      specifications: { Item: "Poly Mailer Bag", Size: "10x12 Inch" },
      rating: 5.0,
      reviewsCount: 184,
      isPopular: true,
    } as Product,
  },
];

const FAQS = [
  {
    q: "What is BOPP adhesive tape?",
    a: "BOPP stands for Biaxially Oriented Polypropylene. It is a highly durable plastic film backing coated with high-tack acrylic adhesive, making it perfect for heavy cardboard box sealing.",
  },
  {
    q: "Can I print my company logo on packaging tapes?",
    a: "Yes! We manufacture custom logo-printed tapes with warnings like 'FRAGILE' or 'DO NOT ACCEPT IF SEAL BROKEN' in up to 2 colors.",
  },
  {
    q: "Are bubble wrap rolls recyclable?",
    a: "Yes! Our protective bubble wrap rolls are manufactured from 100% low-density polyethylene (LDPE) which can be fully recycled.",
  },
];

export default function AccessoriesPage() {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const handleToggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 50, "50 Pcs");
    setIsCartOpen(true);
  };

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
            <Link href="/products">Products</Link>
            <span className="separator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <span className="current">Accessories</span>
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

      {/* SLIDE 1: ACCESSORIES HERO & CENTERED 5 CATEGORY CARDS */}
      <section className="category-section section" style={{ background: "var(--beige)", padding: "40px 0 60px 0" }}>
        <div className="container">
          <div className="section-head reveal-up visible" style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="section-tag">Shipping Accessories</span>
            <h1
              className="section-title"
              style={{ fontSize: "2.4rem", fontWeight: 800, color: "#2B2B2B", marginTop: "8px" }}
            >
              Packaging Accessories & Fillers
            </h1>
            <p
              className="section-sub"
              style={{ color: "#666", maxWidth: "680px", margin: "12px auto 0 auto", fontSize: "1.05rem" }}
            >
              Tapes, protective wraps, mailing bags and raw sheets to secure your retail shipments.
            </p>
          </div>

          {/* 5 Sub-Category Cards Grid Centered & Balanced */}
          <div
            className="category-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              justifyContent: "center",
              gap: "20px",
              maxWidth: "1150px",
              margin: "0 auto",
            }}
          >
            {SUB_CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="cat-card reveal-up visible"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="cat-img-box">
                  <Image src={cat.image} alt={cat.name} width={200} height={140} style={{ objectFit: "contain" }} />
                </div>
                <div className="cat-info">
                  <h3 className="cat-name">{cat.name}</h3>
                  <p className="cat-desc">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDE 2: FEATURED ACCESSORIES (BROWN KRAFT ADHESIVE TAPE & POLY COURIER MAILER BAGS) */}
      <section style={{ background: "#FAF7F2", padding: "60px 0 80px 0" }}>
        <div className="container">
          <div
            className="products-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 380px))",
              justifyContent: "center",
              gap: "32px",
              maxWidth: "840px",
              margin: "0 auto",
            }}
          >
            {FEATURED_PRODUCTS.map((prod, idx) => {
              const isLiked = !!likedItems[prod.id];
              return (
                <div
                  key={prod.id}
                  className="prod-card reveal-up visible"
                  style={{ animationDelay: `${(idx + 1) * 0.04}s` }}
                >
                  <div className="prod-img-wrap" style={{ position: "relative" }}>
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      width={380}
                      height={260}
                      className="prod-img"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="prod-actions-overlay">
                      <button
                        className="prod-overlay-btn add-wishlist-btn"
                        aria-label="Add to wishlist"
                        onClick={(e) => handleToggleWishlist(e, prod.id)}
                        style={{ color: isLiked ? "#E04848" : "inherit" }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={isLiked ? "#E04848" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="prod-info" style={{ padding: "20px" }}>
                    <h3 className="prod-name" style={{ fontSize: "1.15rem", fontWeight: 700, color: "#2B2B2B" }}>
                      {prod.name}
                    </h3>
                    <p className="prod-desc" style={{ fontSize: "0.85rem", color: "#666", marginTop: "6px" }}>
                      {prod.desc}
                    </p>

                    <div
                      className="prod-footer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      <div className="prod-price">
                        <span className="price-curr" style={{ fontSize: "1.25rem", fontWeight: 800, color: "#2B2B2B" }}>
                          ₹{prod.price}
                        </span>
                        <span
                          className="price-old"
                          style={{
                            fontSize: "0.9rem",
                            color: "#999",
                            textDecoration: "line-through",
                            marginLeft: "6px",
                          }}
                        >
                          ₹{prod.oldPrice}
                        </span>
                        <span className="price-tag" style={{ fontSize: "0.8rem", color: "#78736E", marginLeft: "4px" }}>
                          {prod.unitTag}
                        </span>
                      </div>

                      <button
                        className="add-cart-btn"
                        onClick={(e) => handleQuickAdd(e, prod.productObj)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "#8B5E3C",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "20px",
                          padding: "8px 18px",
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          cursor: "pointer",
                          transition: "background 0.2s ease",
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SLIDE 3: FREQUENTLY ASKED QUESTIONS (THEMED BEIGE BG MATCHING THEME) */}
      <section className="faq-section" style={{ background: "var(--beige, #FAF7F2)", padding: "60px 0" }}>
        <div className="container">
          <div className="section-head" style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="section-tag">Got Questions?</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#2B2B2B", marginTop: "6px" }}>
              Tapes & Accessories FAQs
            </h2>
          </div>

          <div className="faq-accordion" style={{ maxWidth: "800px", margin: "0 auto" }}>
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    className="faq-q"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                      }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="faq-a">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}
