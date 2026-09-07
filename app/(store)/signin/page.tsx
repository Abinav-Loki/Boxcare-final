"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim() || !password.trim()) {
      setMessage({ type: "error", text: "Please enter both email and password." });
      return;
    }

    setIsLoading(true);
    // Simulate UI interaction (UI only, no real backend)
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Sign In successful! (Demo UI mode)",
      });
      // Optional: simulate redirect to dashboard or home after 1.5s
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }, 800);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSubmitted(true);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", backgroundColor: "#FAF7F2", padding: "40px 16px 60px" }}>
      {/* Breadcrumb / Top bar */}
      <div style={{ maxWidth: "1120px", margin: "0 auto 24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#8C7E72" }}>
        <Link href="/" style={{ color: "#5C3A22", textDecoration: "none", fontWeight: 500 }}>
          Home
        </Link>
        <span>/</span>
        <span style={{ color: "#1F1A16", fontWeight: 600 }}>Sign In</span>
      </div>

      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(92, 58, 34, 0.07)",
          border: "1px solid #EAE0D5",
          overflow: "hidden",
        }}
      >
        {/* Left: Sign In Form */}
        <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                backgroundColor: "#F7F2EC",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#5C3A22",
                marginBottom: "12px",
                border: "1px solid #E5D8C8",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Customer Account
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "32px",
                fontWeight: 700,
                color: "#1F1A16",
                margin: "0 0 8px 0",
                lineHeight: 1.2,
              }}
            >
              Welcome Back
            </h1>
            <p style={{ fontSize: "14px", color: "#7A6E65", margin: 0, lineHeight: 1.5 }}>
              Sign in to manage packaging orders, track shipments & access custom quotes.
            </p>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              style={{
                marginBottom: "24px",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                lineHeight: 1.4,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor:
                  message.type === "success"
                    ? "#ECFDF5"
                    : message.type === "error"
                    ? "#FEF2F2"
                    : "#EFF6FF",
                color:
                  message.type === "success"
                    ? "#065F46"
                    : message.type === "error"
                    ? "#991B1B"
                    : "#1E40AF",
                border: `1px solid ${
                  message.type === "success"
                    ? "#A7F3D0"
                    : message.type === "error"
                    ? "#FECACA"
                    : "#BFDBFE"
                }`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {message.type === "success" ? (
                  <polyline points="20 6 9 17 4 12" />
                ) : message.type === "error" ? (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </>
                ) : (
                  <circle cx="12" cy="12" r="10" />
                )}
              </svg>
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="signin-email"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2C2520",
                  marginBottom: "6px",
                }}
              >
                Email Address <span style={{ color: "#DC2626" }}>*</span>
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
                  id="signin-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 44px",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #E2D7CC",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#1F1A16",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#5C3A22";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 58, 34, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E2D7CC";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label
                  htmlFor="signin-password"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2C2520",
                  }}
                >
                  Password <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#D68A45",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  Forgot password?
                </button>
              </div>
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 44px",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #E2D7CC",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#1F1A16",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#5C3A22";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 58, 34, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E2D7CC";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#8C7E72",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#5C3A22",
                  cursor: "pointer",
                }}
              />
              <label
                htmlFor="remember-me"
                style={{ fontSize: "13px", color: "#4A4036", cursor: "pointer", userSelect: "none" }}
              >
                Remember me on this device
              </label>
            </div>

            {/* Sign In Submit Button */}
            <button
              id="signin-submit-btn"
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px 20px",
                backgroundColor: isLoading ? "#8C7E72" : "#5C3A22",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(92, 58, 34, 0.2)",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.currentTarget as HTMLElement).style.backgroundColor = "#472C19";
              }}
              onMouseLeave={(e) => {
                if (!isLoading) (e.currentTarget as HTMLElement).style.backgroundColor = "#5C3A22";
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    style={{ animation: "spin 1s linear infinite", width: "18px", height: "18px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "28px 0 24px",
              color: "#A3968B",
              fontSize: "12px",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE0D5" }} />
            <span style={{ padding: "0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              New to BoxCare?
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE0D5" }} />
          </div>

          {/* Link to Sign Up */}
          <div style={{ textAlign: "center" }}>
            <Link
              id="goto-signup-btn"
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "12px 20px",
                backgroundColor: "#FAF7F2",
                color: "#5C3A22",
                border: "1.5px solid #D68A45",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#F5EFEB";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              <span>Create Customer Account</span>
            </Link>
          </div>
        </div>

        {/* Right: BoxCare Brand Showcase Panel */}
        <div
          style={{
            backgroundColor: "#2E1A0C",
            backgroundImage: "radial-gradient(circle at 100% 0%, #5C3A22 0%, #2E1A0C 70%)",
            color: "#FFFFFF",
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                backgroundColor: "rgba(214, 138, 69, 0.15)",
                border: "1px solid rgba(214, 138, 69, 0.3)",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#D68A45",
                marginBottom: "24px",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#D68A45" }} />
              India&apos;s Premium Packaging Hub
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "28px",
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: "16px",
                color: "#FAF7F2",
              }}
            >
              Everything you need for seamless box ordering.
            </h2>
            <p style={{ fontSize: "14px", color: "#C4B5A5", lineHeight: 1.6, marginBottom: "36px" }}>
              Join thousands of eCommerce leaders and manufacturers streamlining custom box procurement with real-time tracking and tax invoices.
            </p>

            {/* Benefits List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D68A45",
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: 600, color: "#FAF7F2" }}>
                    Live Dispatch & Shipment Tracking
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#A8988B", lineHeight: 1.4 }}>
                    Monitor production status, courier tracking IDs & proof of delivery in real time.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D68A45",
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: 600, color: "#FAF7F2" }}>
                    Instant GST Tax Invoices
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#A8988B", lineHeight: 1.4 }}>
                    Download compliant GST e-invoices with input tax credit support at any time.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D68A45",
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: 600, color: "#FAF7F2" }}>
                    1-Click Box Size Reordering
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#A8988B", lineHeight: 1.4 }}>
                    Save custom dimensions & dielines for instant one-click bulk reorders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div
            style={{
              marginTop: "40px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#A8988B",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D68A45" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>100% Secure Checkout</span>
            </div>
            <span>Pan-India Delivery</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "440px",
              width: "100%",
              padding: "32px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              border: "1px solid #EAE0D5",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "#8C7E72",
                cursor: "pointer",
                padding: "6px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {!forgotSubmitted ? (
              <div>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "#FAF7F2",
                    border: "1px solid #E5D8C8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#5C3A22",
                    marginBottom: "16px",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#1F1A16",
                    margin: "0 0 8px 0",
                  }}
                >
                  Reset your password
                </h3>
                <p style={{ fontSize: "13px", color: "#7A6E65", margin: "0 0 20px 0", lineHeight: 1.5 }}>
                  Enter your registered email address and we&apos;ll send you a link to reset your account password.
                </p>

                <form onSubmit={handleForgotSubmit}>
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      htmlFor="forgot-email"
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#2C2520",
                        marginBottom: "6px",
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1.5px solid #E2D7CC",
                        fontSize: "14px",
                        color: "#1F1A16",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: "#5C3A22",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      marginBottom: "12px",
                    }}
                  >
                    Send Password Reset Link
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      backgroundColor: "transparent",
                      color: "#7A6E65",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Cancel and Return
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#ECFDF5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#1F1A16",
                    margin: "0 0 8px 0",
                  }}
                >
                  Reset Link Sent!
                </h3>
                <p style={{ fontSize: "13px", color: "#7A6E65", lineHeight: 1.5, margin: "0 0 20px 0" }}>
                  We have sent instructions to <strong>{forgotEmail}</strong>. Please check your inbox and spam folder.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#5C3A22",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
