"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NewsletterSection } from "@/components/store/newsletter-section";

const REFERENCE_FAQS = [
  {
    q: "What is the Minimum Order Quantity (MOQ)?",
    a: "Our MOQ starts at just 50 boxes for standard sizes. For custom printed boxes, the MOQ is 100 units. Bulk discounts kick in at 500+ units.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5–7 business days after design approval. Express 3-day delivery is available at an additional charge. We ship pan-India via trusted courier partners.",
  },
  {
    q: "Can I fully customize the print and design?",
    a: "Absolutely! We offer full-colour CMYK printing on all sides (inner/outer). You can upload any artwork in PDF, AI, EPS, or PNG format. Our designers will create a digital proof for approval.",
  },
  {
    q: "What printing methods do you use?",
    a: "We use offset printing for high-volume runs (best quality), digital printing for small batches, and flexo printing for corrugated boxes. Finish options include matte, gloss, soft-touch, and UV coating.",
  },
  {
    q: "Do you offer sample boxes before bulk order?",
    a: "Yes! We offer free physical samples for standard sizes. For custom printed samples, a nominal charge applies which is adjusted against your bulk order payment.",
  },
  {
    q: "What is your return and refund policy?",
    a: "We stand behind our quality. If boxes are defective or don't match the approved design, we replace them at no cost. Customized orders cannot be returned unless there is a manufacturing defect.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════
         SLIDE 1 — PRESERVED TARGET CONTENT (DO NOT CHANGE)
      ════════════════════════════════════════════════════════ */}
      <div style={{ background: "#F7F2EC", padding: "40px 0 60px 0" }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="section-tag">Get In Touch</span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, color: "#2B2B2B", marginTop: "8px" }}>
              Contact &amp; Customer Support
            </h1>
            <p style={{ color: "#666", maxWidth: "560px", margin: "8px auto 0 auto", fontSize: "1rem" }}>
              Have questions about box sizes, custom dielines, or sample requests? Our team is here to help.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
            {/* Contact Details & Info */}
            <div style={{ background: "#FFFFFF", borderRadius: "24px", border: "1px solid #EDE3D4", padding: "32px" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#2B2B2B", marginBottom: "20px" }}>Contact Details</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontSize: "0.95rem" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", background: "#F7F2EC", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📞</div>
                  <div>
                    <span style={{ color: "#888", fontSize: "0.78rem", display: "block" }}>Phone &amp; WhatsApp</span>
                    <strong style={{ color: "#8B5E3C" }}>+91 89039 27262</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", background: "#F7F2EC", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>✉️</div>
                  <div>
                    <span style={{ color: "#888", fontSize: "0.78rem", display: "block" }}>Support Email</span>
                    <strong style={{ color: "#8B5E3C" }}>support@boxcare.in</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", background: "#F7F2EC", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📍</div>
                  <div>
                    <span style={{ color: "#888", fontSize: "0.78rem", display: "block" }}>Factory &amp; Office</span>
                    <strong style={{ color: "#2B2B2B" }}>Industrial Packaging Estate, India</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", background: "#F7F2EC", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🕒</div>
                  <div>
                    <span style={{ color: "#888", fontSize: "0.78rem", display: "block" }}>Operating Hours</span>
                    <strong style={{ color: "#2B2B2B" }}>Mon – Sat, 9:00 AM – 7:00 PM IST</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #EDE3D4" }}>
                <a href="https://wa.me/918903927262" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", background: "#25D366" }}>
                  💬 Chat Immediately on WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: "#FFFFFF", borderRadius: "24px", border: "1px solid #EDE3D4", padding: "32px" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#2B2B2B", marginBottom: "8px" }}>Send Us a Message</h2>
              <p style={{ fontSize: "0.88rem", color: "#666", marginBottom: "20px" }}>We respond to all inquiries within 1-2 business hours.</p>

              {submitted ? (
                <div style={{ background: "#dcfce7", color: "#15803d", padding: "20px", borderRadius: "12px", fontWeight: 700, textAlign: "center" }}>
                  🎉 Message received! We will reach out to you shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <input type="text" required placeholder="Your Name *" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D8C9B4" }} />
                  <input type="tel" required placeholder="Phone Number *" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D8C9B4" }} />
                  <input type="email" placeholder="Email Address" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D8C9B4" }} />
                  <textarea rows={4} required placeholder="How can we help you with your packaging needs? *" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D8C9B4" }}></textarea>
                  <button type="submit" className="btn-primary" style={{ justifyContent: "center", padding: "14px" }}>
                    Send Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
         BELOW SLIDE 1 — RECREATED BOX-CARE REFERENCE CONTENT
      ════════════════════════════════════════════════════════ */}

      {/* FAQ SECTION */}
      <section className="faq-section section" id="contact" style={{ background: "#FFFFFF", padding: "60px 0" }}>
        <div className="container">
          <div className="section-head reveal-up visible">
            <span className="section-tag">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-sub">Everything you need to know about Box Care packaging.</p>
          </div>

          <div className="faq-grid">
            <div className="faq-list reveal-up visible">
              {REFERENCE_FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`faq-item ${isOpen ? "open" : ""}`} id={`faq-${idx + 1}`}>
                    <button
                      className="faq-q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    >
                      <span>{faq.q}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                    <div className="faq-a" style={{ maxHeight: isOpen ? "240px" : "0", padding: isOpen ? "4px 20px 20px" : "0 20px" }}>
                      <p dangerouslySetInnerHTML={{ __html: faq.a.replace(/(\d+[\w+–%-]*|\b[A-Z0-9]{3,}\b)/g, '<strong>$1</strong>') }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact card */}
            <div className="faq-contact-card reveal-up visible" id="faq-contact-card">
              <div className="fcc-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h3>Still have questions?</h3>
              <p>Our packaging experts are ready to help you find the perfect solution.</p>
              <div className="fcc-contacts">
                <a href="tel:+918000000000" className="fcc-link" id="fcc-phone">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +91 80000 00000
                </a>
                <a href="mailto:hello@boxcare.in" className="fcc-link" id="fcc-email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  hello@boxcare.in
                </a>
                <a href="https://wa.me/918000000000" className="fcc-link" id="fcc-whatsapp" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
              <Link href="/custom-boxes" className="btn-primary" id="fcc-quote-btn" style={{ marginTop: "20px", display: "inline-flex", gap: "8px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM & MAP SECTION */}
      <section className="section" style={{ background: "var(--beige)", padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: "960px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "32px", alignItems: "start" }}>
            {/* Contact Cards info */}
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2B2B2B", marginBottom: "8px" }}>Visit Our Office</h3>
              <p style={{ marginBottom: "24px", color: "#666", fontSize: "0.92rem" }}>
                Find us or reach out via mail/phone. Our customer success representatives are active Monday through Saturday.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "#FFFFFF", padding: "18px", borderRadius: "8px", border: "1px solid #EDE3D4" }}>
                  <strong style={{ color: "#8B5E3C", display: "block", marginBottom: "4px", fontSize: "0.9rem" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "4px" }}>
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Address
                  </strong>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>104, Packaging Hub, Lower Parel, Mumbai, MH - 400013, India</span>
                </div>
                <div style={{ background: "#FFFFFF", padding: "18px", borderRadius: "8px", border: "1px solid #EDE3D4" }}>
                  <strong style={{ color: "#8B5E3C", display: "block", marginBottom: "4px", fontSize: "0.9rem" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "4px" }}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Business Hours
                  </strong>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>Monday – Saturday: 9:00 AM – 7:00 PM (IST)</span>
                </div>
              </div>
            </div>

            {/* Google Map Mock/Embed */}
            <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.05)", height: "300px", background: "#e5e3df", border: "1px solid #EDE3D4" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8037142750917!2d72.82766327610014!3d18.995325882470762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cef7df89fb63%3A0xc48c08cb83a45610!2sLower%20Parel%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1719548480000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}

