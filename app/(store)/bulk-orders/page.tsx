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
              id="bulk-order-form"
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                background: "#FFFFFF",
                padding: "40px",
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(92, 58, 34, 0.08)",
                border: "1px solid #EAE0D5",
              }}
            >
              {/* Row 1: Name & Company */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
                <div>
                  <label
                    htmlFor="fullName"
                    style={{ fontSize: "13px", fontWeight: 700, color: "#1F1A16", marginBottom: "6px", display: "block" }}
                  >
                    Full Name <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#8C7E72",
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 42px",
                        borderRadius: "10px",
                        border: "1.5px solid #D8C9B4",
                        background: "#FFFFFF",
                        color: "#1F1A16",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#5C3A22";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 58, 34, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D8C9B4";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    style={{ fontSize: "13px", fontWeight: 700, color: "#1F1A16", marginBottom: "6px", display: "block" }}
                  >
                    Company / Brand Name <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#8C7E72",
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Retail Pvt Ltd"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 42px",
                        borderRadius: "10px",
                        border: "1.5px solid #D8C9B4",
                        background: "#FFFFFF",
                        color: "#1F1A16",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#5C3A22";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 58, 34, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D8C9B4";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Phone & Email */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
                <div>
                  <label
                    htmlFor="phone"
                    style={{ fontSize: "13px", fontWeight: 700, color: "#1F1A16", marginBottom: "6px", display: "block" }}
                  >
                    WhatsApp / Phone Number <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#8C7E72",
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 42px",
                        borderRadius: "10px",
                        border: "1.5px solid #D8C9B4",
                        background: "#FFFFFF",
                        color: "#1F1A16",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#5C3A22";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 58, 34, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D8C9B4";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    style={{ fontSize: "13px", fontWeight: 700, color: "#1F1A16", marginBottom: "6px", display: "block" }}
                  >
                    Business Email Address <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#8C7E72",
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 42px",
                        borderRadius: "10px",
                        border: "1.5px solid #D8C9B4",
                        background: "#FFFFFF",
                        color: "#1F1A16",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#5C3A22";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 58, 34, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D8C9B4";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Item Type & Quantity */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
                <div>
                  <label
                    htmlFor="itemType"
                    style={{ fontSize: "13px", fontWeight: 700, color: "#1F1A16", marginBottom: "6px", display: "block" }}
                  >
                    Item Category <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#8C7E72",
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <select
                      id="itemType"
                      name="itemType"
                      value={formData.itemType}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 42px",
                        borderRadius: "10px",
                        border: "1.5px solid #D8C9B4",
                        background: "#FFFFFF",
                        color: "#1F1A16",
                        height: "46px",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#5C3A22";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 58, 34, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D8C9B4";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <option value="mailer-boxes">Mailer Boxes</option>
                      <option value="corrugated-boxes">Corrugated Cartons</option>
                      <option value="shipping-boxes">Shipping Cartons</option>
                      <option value="pizza-boxes">Pizza & Food Boxes</option>
                      <option value="mono-cartons">Mono Cartons & Sleeves</option>
                      <option value="courier-bags">Poly Courier Bags</option>
                      <option value="paper-bags">Eco Kraft Paper Bags</option>
                      <option value="tapes">Adhesive & Kraft Tapes</option>
                      <option value="bubble-wrap">Air Bubble Wrap Rolls</option>
                      <option value="corrugated-rolls">Corrugated Rolls & Sheets</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    style={{ fontSize: "13px", fontWeight: 700, color: "#1F1A16", marginBottom: "6px", display: "block" }}
                  >
                    Estimated Monthly Quantity <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#8C7E72",
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="9" x2="20" y2="9" />
                        <line x1="4" y1="15" x2="20" y2="15" />
                        <line x1="10" y1="3" x2="8" y2="21" />
                        <line x1="16" y1="3" x2="14" y2="21" />
                      </svg>
                    </div>
                    <input
                      id="quantity"
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 2500 pcs"
                      min="100"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 42px",
                        borderRadius: "10px",
                        border: "1.5px solid #D8C9B4",
                        background: "#FFFFFF",
                        color: "#1F1A16",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#5C3A22";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 58, 34, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D8C9B4";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Requirements Description */}
              <div>
                <label
                  htmlFor="description"
                  style={{ fontSize: "13px", fontWeight: 700, color: "#1F1A16", marginBottom: "6px", display: "block" }}
                >
                  Custom Box Dimensions & Printing Requirements <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Please specify box dimensions (L × W × H in inches/cm), paper GSM, single/multi-color printing artwork, delivery pincode, or target budget..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #D8C9B4",
                    background: "#FFFFFF",
                    color: "#1F1A16",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                    lineHeight: 1.5,
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#5C3A22";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 58, 34, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#D8C9B4";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  padding: "15px 24px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#5C3A22",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                  marginTop: "6px",
                  boxShadow: "0 4px 14px rgba(92, 58, 34, 0.2)",
                  transition: "background 0.2s ease, transform 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#472C19";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#5C3A22";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Submit Wholesale Quote Inquiry</span>
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
