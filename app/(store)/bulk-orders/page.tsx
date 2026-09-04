"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NewsletterSection } from "@/components/store/newsletter-section";

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Choose Product",
    desc: "Browse our catalog or use the builder to select your box type and specifications.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 4.1 12 2 4 10v12h16V10L14 4.1z" />
        <path d="m9 15 3 3 5-5" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Customize",
    desc: "Upload your artwork, choose size, material, finish, and quantity.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Approve Design",
    desc: "Receive a digital proof from our design team. Make changes until perfect.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Production",
    desc: "Our state-of-the-art facility handles printing, cutting, and assembly with precision.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Delivery",
    desc: "Pan-India delivery in 5–7 days. Track your shipment in real-time.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        <polyline points="16 16 12 12 8 16" />
      </svg>
    ),
  },
];

export function BulkOrdersPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    itemType: "mailer-boxes",
    quantity: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            <span className="current">Bulk Orders</span>
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

      {/* PROCESS TIMELINE SECTION */}
      <section className="process-section section" style={{ background: "#FFFFFF", padding: "60px 0" }}>
        <div className="container">
          <div className="section-head reveal-up visible" style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="section-tag">How It Works</span>
            <h2 className="section-title" style={{ fontSize: "2.2rem", fontWeight: 800, color: "#2B2B2B", marginTop: "6px" }}>
              Our Process
            </h2>
            <p className="section-sub" style={{ color: "#666", fontSize: "1rem", marginTop: "8px" }}>
              From idea to doorstep — a seamless 5-step journey.
            </p>
          </div>

          <div className="process-timeline reveal-up visible">
            {PROCESS_STEPS.map((step, idx) => {
              const isLast = idx === PROCESS_STEPS.length - 1;
              return (
                <div key={step.num} className={`process-step ${isLast ? "last" : ""}`}>
                  <div className="ps-circle">{step.icon}</div>
                  {!isLast && <div className="ps-line"></div>}
                  <div className="ps-content">
                    <span className="ps-num">{step.num}</span>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BULK INQUIRY FORM SECTION */}
      <section className="builder-section section" id="bulk" style={{ background: "var(--beige)", color: "var(--charcoal)", padding: "60px 0 80px 0" }}>
        <div className="container" style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div className="section-head reveal-up visible" style={{ textAlign: "center", marginBottom: "30px" }}>
            <span
              className="section-tag"
              style={{ background: "rgba(139,94,60,0.1)", color: "var(--brown)", padding: "4px 14px", borderRadius: "20px" }}
            >
              Bulk Pricing
            </span>
            <h2 className="section-title" style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--charcoal)", marginTop: "8px" }}>
              Wholesale Inquiry
            </h2>
            <p className="section-sub" style={{ color: "#666", fontSize: "1rem", marginTop: "8px" }}>
              Fill in details of your high-volume requirements. We will match you with a dedicated key account manager.
            </p>
          </div>

          {submitted ? (
            <div
              style={{
                background: "#FFFFFF",
                padding: "40px",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                border: "1px solid #EDE3D4",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#DCFCE7",
                  color: "#15803D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2B2B2B", marginBottom: "8px" }}>
                Bulk Inquiry Submitted Successfully!
              </h3>
              <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "24px" }}>
                A dedicated key account manager will connect with you via WhatsApp or Email shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: "",
                    companyName: "",
                    phone: "",
                    email: "",
                    itemType: "mailer-boxes",
                    quantity: "",
                    description: "",
                  });
                }}
                className="btn-primary"
                style={{ padding: "10px 24px", borderRadius: "8px" }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form
              className="bs-form"
              id="bulk-order-form"
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                background: "#FFFFFF",
                padding: "36px",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                border: "1px solid #ECE4DA",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2B2B2B", marginBottom: "6px", display: "block" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="bs-input"
                    placeholder="Your Name"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #EDE3D4",
                      background: "#FAF7F2",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2B2B2B", marginBottom: "6px", display: "block" }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="bs-input"
                    placeholder="Company / Brand"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #EDE3D4",
                      background: "#FAF7F2",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2B2B2B", marginBottom: "6px", display: "block" }}>
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bs-input"
                    placeholder="Phone Number"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #EDE3D4",
                      background: "#FAF7F2",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2B2B2B", marginBottom: "6px", display: "block" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bs-input"
                    placeholder="name@company.com"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #EDE3D4",
                      background: "#FAF7F2",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2B2B2B", marginBottom: "6px", display: "block" }}>
                    Item Type *
                  </label>
                  <select
                    name="itemType"
                    value={formData.itemType}
                    onChange={handleChange}
                    required
                    className="bs-input"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #EDE3D4",
                      background: "#FAF7F2",
                      height: "46px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="mailer-boxes">Mailer Boxes</option>
                    <option value="corrugated-boxes">Corrugated Boxes</option>
                    <option value="shipping-boxes">Shipping Boxes</option>
                    <option value="pizza-boxes">Pizza Boxes</option>
                    <option value="mono-cartons">Mono Cartons</option>
                    <option value="courier-bags">Courier Bags</option>
                    <option value="paper-bags">Paper Bags</option>
                    <option value="tapes">Tape Rolls</option>
                    <option value="bubble-wrap">Bubble Wrap</option>
                    <option value="corrugated-rolls">Corrugated Rolls</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2B2B2B", marginBottom: "6px", display: "block" }}>
                    Monthly Quantity Needed *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="bs-input"
                    placeholder="e.g. 1000"
                    min="500"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #EDE3D4",
                      background: "#FAF7F2",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2B2B2B", marginBottom: "6px", display: "block" }}>
                  Requirements Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bs-input"
                  rows={4}
                  placeholder="Enter target box dimensions, printing specifications, or target budget details here..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #EDE3D4",
                    background: "#FAF7F2",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    resize: "vertical",
                  }}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "#8B5E3C",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Submit Bulk Quote Request</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}

export default BulkOrdersPage;
