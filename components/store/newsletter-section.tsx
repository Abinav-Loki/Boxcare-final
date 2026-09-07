"use client";

import React, { useState } from "react";
import { useLiveCms } from "@/lib/cms-data";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { cms } = useLiveCms();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <section className="newsletter-section" id="quote">
      <div className="newsletter-bg">
        <div className="nl-blob nb1"></div>
        <div className="nl-blob nb2"></div>
      </div>
      <div className="container">
        <div className="newsletter-inner reveal-up">
          <div className="nl-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10c0-.63.3-1.22.8-1.6l8-6a2 2 0 0 1 2.4 0l8 6z" />
              <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
            </svg>
          </div>
          <h2>{cms.newsletterSection.title}</h2>
          <p>{cms.newsletterSection.subtitle}</p>

          {subscribed ? (
            <div style={{ background: "rgba(76, 175, 80, 0.2)", border: "1px solid #4CAF50", color: "#4CAF50", padding: "14px 20px", borderRadius: "8px", fontWeight: 700 }}>
              🎉 Thank you for subscribing! Check your inbox for special packaging deals.
            </div>
          ) : (
            <form className="nl-form" id="nl-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="nl-input"
                id="nl-email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="nl-btn" id="nl-submit-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                {cms.newsletterSection.btnText || "Subscribe"}
              </button>
            </form>
          )}

          <p className="nl-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
