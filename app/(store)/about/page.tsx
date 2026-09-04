"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsletterSection } from "@/components/store/newsletter-section";

function StatCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            let current = 0;
            const duration = 1500; // 1.5s total duration matching reference
            const stepTime = Math.max(Math.floor(duration / target), 15);
            const increment = Math.max(Math.ceil(target / 80), 1);

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(current);
              }
            }, stepTime);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <strong ref={ref} className="stat-num">
      {count.toLocaleString()}{suffix}
    </strong>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs-container">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">About</span>
          </div>
        </div>
      </div>

      {/* WHY BOX CARE */}
      <section className="why-section section" id="why" style={{ background: "var(--beige)" }}>
        <div className="container">
          <div className="section-head reveal-up visible">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">Why Box Care?</h2>
            <p className="section-sub">We don't just make boxes — we craft packaging experiences that elevate your brand.</p>
          </div>
          <div className="why-grid">
            <div className="why-card reveal-up visible" id="why-quality">
              <div className="why-icon-wrap" style={{ "--ic": "#8B5E3C20", "--icb": "#8B5E3C" } as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                  <path d="m3.3 7 8.7 5 8.7-5"/>
                  <path d="M12 22V12"/>
                </svg>
              </div>
              <h3>Premium Quality</h3>
              <p>Crafted from top-grade corrugated &amp; kraft materials with rigorous quality control at every step of production.</p>
              <div className="why-hover-line"></div>
            </div>
            <div className="why-card reveal-up visible" id="why-delivery">
              <div className="why-icon-wrap" style={{ "--ic": "#D68A4520", "--icb": "#D68A45" } as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3>Fast Delivery</h3>
              <p>Pan-India delivery in 5–7 business days. Express options available for urgent orders with real-time tracking.</p>
              <div className="why-hover-line"></div>
            </div>
            <div className="why-card reveal-up visible" id="why-eco">
              <div className="why-icon-wrap" style={{ "--ic": "#4CAF5020", "--icb": "#4CAF50" } as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A60.3 60.3 0 0 1 3 12C3 7 7 3 12 3a60.3 60.3 0 0 1 8 8c0 5-4 9-9 9z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <h3>Eco-Friendly</h3>
              <p>100% recyclable and sustainable materials. Our packaging is planet-conscious without compromising durability.</p>
              <div className="why-hover-line"></div>
            </div>
            <div className="why-card reveal-up visible" id="why-custom">
              <div className="why-icon-wrap" style={{ "--ic": "#2196F320", "--icb": "#2196F3" } as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0z"/>
                  <path d="m14.5 12.5 2 2"/>
                  <path d="m11.5 9.5 2 2"/>
                  <path d="m8.5 6.5 2 2"/>
                  <path d="m17.5 15.5 2 2"/>
                </svg>
              </div>
              <h3>Fully Customizable</h3>
              <p>Choose your size, material, print, finish, and design. Every box is tailored to your exact brand specifications.</p>
              <div className="why-hover-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" id="about">
        <div className="stats-bg">
          <div className="stats-blob sb1"></div>
          <div className="stats-blob sb2"></div>
        </div>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item reveal-up visible" id="stat-1">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                  <path d="m3.3 7 8.7 5 8.7-5"/>
                  <path d="M12 22V12"/>
                </svg>
              </div>
              <StatCounter target={50000} suffix="+" />
              <span className="stat-label">Boxes Delivered</span>
            </div>
            <div className="stat-item reveal-up visible" id="stat-2">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                  <path d="M10 6h4"/>
                  <path d="M10 10h4"/>
                  <path d="M10 14h4"/>
                  <path d="M10 18h4"/>
                </svg>
              </div>
              <StatCounter target={1000} suffix="+" />
              <span className="stat-label">Happy Businesses</span>
            </div>
            <div className="stat-item reveal-up visible" id="stat-3">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <StatCounter target={98} suffix="%" />
              <span className="stat-label">Customer Satisfaction</span>
            </div>
            <div className="stat-item reveal-up visible" id="stat-4">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.72 1.7-1.63 0-.43-.17-.83-.44-1.14-.27-.32-.44-.73-.44-1.23 0-1.05.85-1.9 1.9-1.9h2.58c3.04 0 5.5-2.46 5.5-5.5 0-4.69-4.78-8.6-10.8-8.6Z"/>
                </svg>
              </div>
              <StatCounter target={150} suffix="+" />
              <span className="stat-label">Packaging Designs</span>
            </div>
          </div>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="testimonials-section section" style={{ background: "var(--beige)" }}>
        <div className="container">
          <div className="section-head reveal-up visible">
            <span className="section-tag">Customer Stories</span>
            <h2 className="section-title">Why Customers Love Us</h2>
            <p className="section-sub">Trusted by 1,000+ businesses across India.</p>
          </div>
          <div className="testimonials-grid reveal-up visible" id="testimonials-grid">
            <div className="testi-card">
              <div>
                <div className="testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="testi-text">
                  &quot;Box Care transformed our unboxing experience completely. The print quality on our kraft mailers is exceptional and our customers keep complimenting the packaging!&quot;
                </p>
              </div>
              <div className="testi-author">
                <Image
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&q=75"
                  alt="Priya Sharma"
                  width={54}
                  height={54}
                  className="testi-avatar"
                />
                <div>
                  <strong>Priya Sharma</strong>
                  <span>Founder, Bloom Beauty Co.</span>
                </div>
              </div>
            </div>

            <div className="testi-card">
              <div>
                <div className="testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="testi-text">
                  &quot;We order 5,000 boxes every month and Box Care has never let us down. Consistent quality, on-time delivery, and their support team is always helpful.&quot;
                </p>
              </div>
              <div className="testi-author">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=75"
                  alt="Rahul Gupta"
                  width={54}
                  height={54}
                  className="testi-avatar"
                />
                <div>
                  <strong>Rahul Gupta</strong>
                  <span>CEO, QuickShip Logistics</span>
                </div>
              </div>
            </div>

            <div className="testi-card">
              <div>
                <div className="testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="testi-text">
                  &quot;The custom pizza boxes with our logo look stunning. Customers literally share them on Instagram. Box Care is the best packaging decision we&apos;ve ever made!&quot;
                </p>
              </div>
              <div className="testi-author">
                <Image
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=75"
                  alt="Anita Patel"
                  width={54}
                  height={54}
                  className="testi-avatar"
                />
                <div>
                  <strong>Anita Patel</strong>
                  <span>Owner, Slice &amp; Spice Restaurant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}


