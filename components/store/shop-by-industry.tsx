"use client";

import React from "react";
import Link from "next/link";

export function ShopByIndustry() {
  const industries = [
    {
      id: "ind-food",
      title: "Food Packaging",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=75",
      link: "/category/pizza-boxes",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      ),
    },
    {
      id: "ind-cosmetics",
      title: "Cosmetics & Beauty",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=75",
      link: "/custom-boxes",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      ),
    },
    {
      id: "ind-fashion",
      title: "Fashion & Apparel",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=75",
      link: "/category/mailer-boxes",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 1-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
      ),
    },
    {
      id: "ind-pharma",
      title: "Pharma & Healthcare",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=75",
      link: "/category/mono-cartons",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
      ),
    },
    {
      id: "ind-ecomm",
      title: "E-Commerce & D2C",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=75",
      link: "/category/mailer-boxes",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      ),
    },
    {
      id: "ind-electronics",
      title: "Electronics & Appliances",
      image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&q=75",
      link: "/category/corrugated-boxes",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="12" x="3" y="4" rx="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>
      ),
    },
  ];

  return (
    <section className="industry-section section" id="industries">
      <div className="container">
        <div className="section-head reveal-up">
          <span className="section-tag">Industries We Serve</span>
          <h2 className="section-title">Shop by Industry</h2>
          <p className="section-sub">Packaging solutions tailored for every sector — from food to fashion.</p>
        </div>
        <div className="industry-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {industries.map((ind) => (
            <Link key={ind.id} href={ind.link} className="ind-card" id={ind.id}>
              <img src={ind.image} alt={ind.title} className="ind-img" />
              <div className="ind-overlay">
                {ind.icon}
                <span>{ind.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
