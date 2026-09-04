"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function HeroBannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-slider swiper" id="home">
      {/* Radial Gradient Noise Overlay Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.14,
          pointerEvents: "none",
          zIndex: 2,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Slide 1: Custom Packaging */}
      <div
        className={`hero-slide ${currentSlide === 0 ? "active" : ""}`}
        style={{
          display: currentSlide === 0 ? "flex" : "none",
          opacity: currentSlide === 0 ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="hero-slide-inner container">
          {/* Left Stamp Badge */}
          <div className="hero-slide-badge-col">
            <div className="vintage-stamp">
              <svg className="vintage-stamp-border" viewBox="0 0 220 80" preserveAspectRatio="none">
                <rect x="6" y="6" width="208" height="68" rx="2" fill="none" stroke="#8B5E3C" strokeWidth="1.5" />
                <rect x="10" y="10" width="200" height="60" rx="1" fill="none" stroke="#8B5E3C" strokeWidth="3" />
                <rect x="12" y="12" width="196" height="56" rx="1" fill="none" stroke="#F4EDE4" strokeWidth="1" />
                <path d="M 4 18 L 4 4 L 18 4" fill="none" stroke="#8B5E3C" strokeWidth="2" />
                <path d="M 216 18 L 216 4 L 202 4" fill="none" stroke="#8B5E3C" strokeWidth="2" />
                <path d="M 4 62 L 4 76 L 18 76" fill="none" stroke="#8B5E3C" strokeWidth="2" />
                <path d="M 216 62 L 216 76 L 202 76" fill="none" stroke="#8B5E3C" strokeWidth="2" />
              </svg>
              <span className="stamp-text">Custom<br />Packaging</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="hero-slide-content">
            <h1 className="hero-slide-title" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#2E1A0C", fontWeight: 900 }}>
              Your Brand Deserves<br />Better Packaging.
            </h1>
            <p className="hero-slide-subtitle">
              Create custom boxes that protect your products and leave a lasting impression.
            </p>
            <div className="hero-slide-features">
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
                <span>Premium Quality</span>
              </div>
              <span className="feature-sep">|</span>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                <span>Fast Delivery</span>
              </div>
              <span className="feature-sep">|</span>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                <span>Affordable Pricing</span>
              </div>
            </div>
            <div className="hero-slide-action">
              <Link href="/custom-boxes" className="hero-slide-btn">
                <span>Shop Custom Boxes</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
            <p className="hero-slide-caption">Free design support on your first order.*</p>
          </div>

          {/* Right Floating Visual SVG */}
          <div className="hero-slide-visual">
            <svg className="slide-illustration-svg swiper-slide-active" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: "visual-float 6s ease-in-out infinite" }}>
              <g stroke="#3D2E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="260,160 350,115 440,160 350,205" fill="#EADCC9" fillOpacity="0.85" />
                <polygon points="260,160 350,205 350,305 260,260" fill="#D2B59B" fillOpacity="0.85" />
                <polygon points="350,205 440,160 440,260 350,305" fill="#BA9577" fillOpacity="0.85" />
                <line x1="350" y1="115" x2="350" y2="205" />
                <line x1="260" y1="160" x2="260" y2="260" />
                <line x1="440" y1="160" x2="440" y2="260" />
                <polygon points="100,220 190,175 280,220 190,265" fill="#4B311E" />
                <line x1="190" y1="175" x2="190" y2="275" stroke="#3D2E24" strokeWidth="1.5" />
                <polygon points="100,220 190,175 130,120 40,165" fill="#E0CAAD" fillOpacity="0.9" />
                <polygon points="190,175 280,220 250,150 160,105" fill="#E0CAAD" fillOpacity="0.9" />
                <polygon points="100,220 190,265 190,365 100,320" fill="#B8845C" />
                <polygon points="190,265 280,220 280,320 190,365" fill="#A0704B" />
                <polygon points="100,220 190,265 130,310 40,265" fill="#C8946A" />
                <polygon points="280,220 190,265 220,310 310,265" fill="#C8946A" />
                <line x1="190" y1="265" x2="190" y2="365" />
                <line x1="100" y1="220" x2="100" y2="320" />
                <line x1="280" y1="220" x2="280" y2="320" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Slide 2: Eco-friendly Packaging */}
      <div
        className={`hero-slide ${currentSlide === 1 ? "active" : ""}`}
        style={{
          display: currentSlide === 1 ? "flex" : "none",
          opacity: currentSlide === 1 ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="hero-slide-inner container">
          <div className="hero-slide-badge-col">
            <div className="vintage-stamp">
              <svg className="vintage-stamp-border" viewBox="0 0 220 80" preserveAspectRatio="none">
                <rect x="6" y="6" width="208" height="68" rx="2" fill="none" stroke="#8B5E3C" strokeWidth="1.5" />
                <rect x="10" y="10" width="200" height="60" rx="1" fill="none" stroke="#8B5E3C" strokeWidth="3" />
                <rect x="12" y="12" width="196" height="56" rx="1" fill="none" stroke="#F4EDE4" strokeWidth="1" />
                <path d="M 4 18 L 4 4 L 18 4" fill="none" stroke="#8B5E3C" strokeWidth="2" />
                <path d="M 216 18 L 216 4 L 202 4" fill="none" stroke="#8B5E3C" strokeWidth="2" />
                <path d="M 4 62 L 4 76 L 18 76" fill="none" stroke="#8B5E3C" strokeWidth="2" />
                <path d="M 216 62 L 216 76 L 202 76" fill="none" stroke="#8B5E3C" strokeWidth="2" />
              </svg>
              <span className="stamp-text">Eco-Friendly<br />Packaging</span>
            </div>
          </div>

          <div className="hero-slide-content">
            <h1 className="hero-slide-title" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#2E1A0C", fontWeight: 900 }}>
              Sustainable Packaging<br />for a Greener Future.
            </h1>
            <p className="hero-slide-subtitle">
              Choose eco-friendly packaging solutions without compromising on quality or style.
            </p>
            <div className="hero-slide-features">
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                <span>100% Recyclable</span>
              </div>
              <span className="feature-sep">|</span>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                <span>Strong & Durable</span>
              </div>
              <span className="feature-sep">|</span>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                <span>Made Responsibly</span>
              </div>
            </div>
            <div className="hero-slide-action">
              <Link href="/products" className="hero-slide-btn">
                <span>Explore Eco Collection</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
            <p className="hero-slide-caption">Better for your business. Better for the planet.</p>
          </div>

          <div className="hero-slide-visual">
            <svg className="slide-illustration-svg swiper-slide-active" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: "visual-float 6s ease-in-out infinite" }}>
              <g fill="#A3B899" fillOpacity="0.6">
                <path d="M 330,120 Q 390,80 410,130 Q 360,180 330,120 Z" />
                <path d="M 360,200 Q 420,180 430,230 Q 370,260 360,200 Z" />
                <path d="M 280,100 Q 310,40 350,70 Q 330,120 280,100 Z" />
                <path d="M 330,120 L 360,200" stroke="#8B9B82" strokeWidth="2.5" />
                <path d="M 280,100 L 330,120" stroke="#8B9B82" strokeWidth="2.5" />
              </g>
              <g stroke="#3D2E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="120,240 210,195 300,240 210,285" fill="#EADCC9" fillOpacity="0.9" />
                <polygon points="120,240 210,285 210,365 120,320" fill="#D2B59B" fillOpacity="0.9" />
                <polygon points="210,285 300,240 300,320 210,365" fill="#BA9577" fillOpacity="0.9" />
                <line x1="210" y1="285" x2="210" y2="365" />
                <line x1="120" y1="240" x2="120" y2="320" />
                <line x1="300" y1="240" x2="300" y2="320" />
                <polygon points="150,150 220,115 290,150 220,185" fill="#F0E3D3" fillOpacity="0.9" />
                <polygon points="150,150 220,185 220,245 150,210" fill="#DFC2A9" fillOpacity="0.9" />
                <polygon points="220,185 290,150 290,210 220,245" fill="#CBB098" fillOpacity="0.9" />
                <line x1="220" y1="185" x2="220" y2="245" />
                <line x1="150" y1="150" x2="150" y2="210" />
                <line x1="290" y1="150" x2="290" y2="210" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Slide 3: Bulk Orders */}
      <div
        className={`hero-slide ${currentSlide === 2 ? "active" : ""}`}
        style={{
          display: currentSlide === 2 ? "flex" : "none",
          opacity: currentSlide === 2 ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="hero-slide-inner container">
          <div className="hero-slide-badge-col">
            <div className="vintage-stamp">
              <svg className="vintage-stamp-border" viewBox="0 0 220 80" preserveAspectRatio="none">
                <rect x="6" y="6" width="208" height="68" rx="2" fill="none" stroke="#8B5E3C" strokeWidth="1.5" />
                <rect x="10" y="10" width="200" height="60" rx="1" fill="none" stroke="#8B5E3C" strokeWidth="3" />
                <rect x="12" y="12" width="196" height="56" rx="1" fill="none" stroke="#F4EDE4" strokeWidth="1" />
                <path d="M 4 18 L 4 4 L 18 4" fill="none" stroke="#8B5E3C" strokeWidth="2" />
                <path d="M 216 18 L 216 4 L 202 4" fill="none" stroke="#8B5E3C" strokeWidth="2" />
                <path d="M 4 62 L 4 76 L 18 76" fill="none" stroke="#8B5E3C" strokeWidth="2" />
                <path d="M 216 62 L 216 76 L 202 76" fill="none" stroke="#8B5E3C" strokeWidth="2" />
              </svg>
              <span className="stamp-text">Bulk Order<br />Benefits</span>
            </div>
          </div>

          <div className="hero-slide-content">
            <h1 className="hero-slide-title" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#2E1A0C", fontWeight: 900 }}>
              Packaging That Grows<br />With Your Business.
            </h1>
            <p className="hero-slide-subtitle">
              From startups to large-scale brands, we deliver reliable packaging at competitive prices.
            </p>
            <div className="hero-slide-features">
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
                <span>Bulk Discounts</span>
              </div>
              <span className="feature-sep">|</span>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                <span>Custom Printing</span>
              </div>
              <span className="feature-sep">|</span>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>Nationwide Shipping</span>
              </div>
            </div>
            <div className="hero-slide-action">
              <Link href="/bulk-orders" className="hero-slide-btn">
                <span>Get A Free Quote</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
            <p className="hero-slide-caption">Trusted by thousands of businesses across industries.</p>
          </div>

          <div className="hero-slide-visual">
            <svg className="slide-illustration-svg swiper-slide-active" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: "visual-float 6s ease-in-out infinite" }}>
              <g stroke="#3D2E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="80,310 220,240 360,310 220,380" fill="#A88B70" fillOpacity="0.8" />
                <line x1="140" y1="280" x2="280" y2="350" />
                <line x1="200" y1="250" x2="340" y2="320" />
                <polygon points="80,310 220,380 220,395 80,325" fill="#8B7057" />
                <polygon points="220,380 360,310 360,325 220,395" fill="#755E49" />
                <polygon points="120,200 190,165 260,200 190,235" fill="#DFC2A9" fillOpacity="0.9" />
                <polygon points="120,200 190,235 190,295 120,260" fill="#CBB098" fillOpacity="0.9" />
                <polygon points="190,235 260,200 260,260 190,295" fill="#B79B83" fillOpacity="0.9" />
                <line x1="190" y1="235" x2="190" y2="295" />
                <line x1="120" y1="200" x2="120" y2="260" />
                <line x1="260" y1="200" x2="260" y2="260" />
                <polygon points="150,240 220,205 290,240 220,275" fill="#EADCC9" fillOpacity="0.95" />
                <polygon points="150,240 220,275 220,335 150,300" fill="#D2B59B" fillOpacity="0.95" />
                <polygon points="220,275 290,240 290,300 220,335" fill="#BA9577" fillOpacity="0.95" />
                <line x1="220" y1="275" x2="220" y2="335" />
                <line x1="150" y1="240" x2="150" y2="300" />
                <line x1="290" y1="240" x2="290" y2="300" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="hero-prev"
        aria-label="Previous slide"
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1))}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button
        className="hero-next"
        aria-label="Next slide"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      {/* Pagination Dots */}
      <div className="hero-pagination">
        {[0, 1, 2].map((idx) => (
          <span
            key={idx}
            className={`swiper-pagination-bullet ${currentSlide === idx ? "swiper-pagination-bullet-active" : ""}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </section>
  );
}
