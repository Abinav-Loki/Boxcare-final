"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "./cart-context";
import { PRODUCTS, getUnitPrice } from "@/lib/products-data";

export function AllTypePackingMaterial() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { addToCart } = useCart();

  const allItems = [
    {
      id: "fmb-4-4-2",
      name: "4 X 4 X 2 Inch Flap Mailer Box",
      badge: "-15%",
      cat: "mailer",
      priceText: "₹5.75 - ₹7.25",
      product: PRODUCTS[0],
    },
    {
      id: "fmb-4-4-1-5",
      name: "4 X 4 X 1.5 Inch Flap Mailer Box",
      badge: "-12%",
      cat: "mailer",
      priceText: "₹5.18 - ₹6.53",
      product: PRODUCTS[1],
    },
    {
      id: "fmb-6-4-2",
      name: "6 X 4 X 2 Inch Flap Mailer Box",
      badge: "-18%",
      cat: "mailer",
      priceText: "₹7.48 - ₹9.43",
      product: PRODUCTS[2],
    },
    {
      id: "sb-8-6-4",
      name: "7 X 4 X 3.5 Inch Shipping Box",
      badge: "-14%",
      cat: "shipping",
      priceText: "₹5.77 - ₹9.24",
      product: PRODUCTS[6],
    },
    {
      id: "cb-3ply-10-8-6",
      name: "5 X 4 X 3.5 Inch Corrugated Box",
      badge: "-17%",
      cat: "shipping",
      priceText: "₹5.30 - ₹8.50",
      product: PRODUCTS[4],
    },
    {
      id: "cb-5ply-12-10-8",
      name: "9 X 6 X 4.5 Inch Corrugated Box",
      badge: "-15%",
      cat: "shipping",
      priceText: "₹8.50 - ₹12.80",
      product: PRODUCTS[5],
    },
    {
      id: "tr-2in-50m",
      name: "2 Inch X 100 Meters Brown Adhesive Tape",
      badge: "-23%",
      cat: "tapes",
      priceText: "₹54.00",
      product: PRODUCTS[11],
    },
    {
      id: "tp-4",
      name: "Printed 2 Inch 80 Meters Adhesive Tape",
      badge: "-14%",
      cat: "tapes",
      priceText: "₹68.00",
      product: PRODUCTS[11],
    },
    {
      id: "fmb-6-5-1-5",
      name: "6 X 5 X 1.5 Inch Flap Mailer",
      badge: "-11%",
      cat: "mailer",
      priceText: "₹12.42 - ₹15.66",
      product: PRODUCTS[3],
    },
    {
      id: "cpb-custom-logo",
      name: "4 X 4 X 1.5 Inch Custom Printed Mailer",
      badge: "-13%",
      cat: "mailer",
      priceText: "₹4.33 - ₹8.11",
      product: PRODUCTS[15],
    },
    {
      id: "pb-10-10-1-5",
      name: "7 X 4 X 2 Inch Shipping Box",
      badge: "-13%",
      cat: "shipping",
      priceText: "₹4.68 - ₹8.09",
      product: PRODUCTS[7],
    },
    {
      id: "tr-2in-50m-2",
      name: "2 Inch X 100M Plain Transparent Tape",
      badge: "-12%",
      cat: "tapes",
      priceText: "₹54.00",
      product: PRODUCTS[11],
    },
    {
      id: "bw-1m-50m",
      name: "Air Bubble Wrap Protective Roll (100M)",
      badge: "-15%",
      cat: "tapes",
      priceText: "₹320.00",
      product: PRODUCTS[12],
    },
    {
      id: "cb-bag-10-14",
      name: "Poly Courier Bags with POD Jacket (100 Pcs)",
      badge: "-25%",
      cat: "accessories",
      priceText: "₹2.10 / bag",
      product: PRODUCTS[9],
    },
    {
      id: "pb-bag-8-12",
      name: "Eco Kraft Paper Bags with Twisted Handles",
      badge: "-18%",
      cat: "accessories",
      priceText: "₹5.20 / bag",
      product: PRODUCTS[10],
    },
    {
      id: "mc-5-3-2",
      name: "Retail Mono Cartons & Product Sleeves",
      badge: "-12%",
      cat: "accessories",
      priceText: "₹3.20 / pc",
      product: PRODUCTS[8],
    },
  ];

  const filteredItems = activeTab === "all" ? allItems : allItems.filter((i) => i.cat === activeTab);

  return (
    <section className="packing-material-section section" id="all-products">
      <div className="container">
        {/* Title line wrap */}
        <div className="pm-header-wrap">
          <div className="pm-title-line">
            <span className="pm-line"></span>
            <h2 className="pm-section-title">All Type Packing Material</h2>
            <span className="pm-line"></span>
          </div>
          <Link href="/products" className="pm-view-all-link">
            View All
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="pm-filter-tabs" id="pm-filter-tabs">
          <button
            className={`pm-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Products (16)
          </button>
          <button
            className={`pm-tab-btn ${activeTab === "mailer" ? "active" : ""}`}
            onClick={() => setActiveTab("mailer")}
          >
            Mailer Boxes (5)
          </button>
          <button
            className={`pm-tab-btn ${activeTab === "shipping" ? "active" : ""}`}
            onClick={() => setActiveTab("shipping")}
          >
            Shipping Cartons (4)
          </button>
          <button
            className={`pm-tab-btn ${activeTab === "tapes" ? "active" : ""}`}
            onClick={() => setActiveTab("tapes")}
          >
            Tapes & Protection (4)
          </button>
          <button
            className={`pm-tab-btn ${activeTab === "accessories" ? "active" : ""}`}
            onClick={() => setActiveTab("accessories")}
          >
            Bags & Cartons (3)
          </button>
        </div>

        {/* 4-Column Product Grid */}
        <div className="parul-grid" id="parul-products-grid">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="parul-card pm-item">
              <span className="parul-badge">{item.badge}</span>
              <div className="parul-img-box">
                <Link href={`/product/${item.product.slug}`}>
                  <img src={item.product.image} alt={item.name} />
                </Link>
              </div>
              <div className="parul-card-info">
                <div className="parul-rating">★★★★★</div>
                <Link href={`/product/${item.product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3 className="parul-title">{item.name}</h3>
                </Link>
                <div className="parul-price-starts">
                  Starts From: <span className="parul-price-val">{item.priceText}</span>
                </div>
                <button
                  className="parul-quick-add-btn"
                  onClick={() => addToCart(item.product, 50)}
                >
                  Quick Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
