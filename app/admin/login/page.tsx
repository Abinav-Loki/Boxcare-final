"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleFillDemo = () => {
    setEmail("admin@boxcare.in");
    setPassword("boxcare@2026");
    setErrorMsg("");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both admin email and password.");
      return;
    }

    setIsLoading(true);

    // Simulate authentication check (Frontend UI demo only)
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Authentication verified. Redirecting to Admin Dashboard...");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    }, 800);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#12100E",
        backgroundImage: `
          radial-gradient(circle at 50% 0%, #2E1A0C 0%, #181513 50%, #0E0C0B 100%)
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: "#F3ECE4",
        position: "relative",
      }}
    >
      {/* Background Decorative Accent Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(214, 138, 69, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(214, 138, 69, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Main Admin Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#1C1815",
          border: "1px solid #382D25",
          borderRadius: "20px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6), 0 0 1px rgba(214, 138, 69, 0.35)",
          padding: "40px 36px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Admin Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          {/* Logo & Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "54px",
              height: "54px",
              borderRadius: "14px",
              backgroundColor: "#2E1A0C",
              border: "1.5px solid #D68A45",
              color: "#D68A45",
              boxShadow: "0 4px 20px rgba(214, 138, 69, 0.25)",
              marginBottom: "16px",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <div
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#D68A45",
              backgroundColor: "rgba(214, 138, 69, 0.12)",
              padding: "4px 12px",
              borderRadius: "20px",
              border: "1px solid rgba(214, 138, 69, 0.25)",
              marginBottom: "10px",
            }}
          >
            BoxCare Operations Portal
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "26px",
              fontWeight: 700,
              color: "#FFFFFF",
              margin: "0 0 6px 0",
            }}
          >
            Admin Sign In
          </h1>
          <p style={{ fontSize: "13px", color: "#A8988B", margin: 0 }}>
            Restricted access for store managers, inventory and logistics teams.
          </p>
        </div>

        {/* Demo Helper Banner */}
        <div
          style={{
            backgroundColor: "rgba(214, 138, 69, 0.08)",
            border: "1px dashed rgba(214, 138, 69, 0.35)",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E0D2C3" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D68A45" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Demo UI Mode</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: "#D68A45",
              color: "#181513",
              border: "none",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Auto-fill Demo
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.15)",
              border: "1px solid #DC2626",
              color: "#FCA5A5",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "12px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid #10B981",
              color: "#6EE7B7",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "12px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#D4C7BA",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Admin Email <span style={{ color: "#D68A45" }}>*</span>
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
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <input
                id="admin-email"
                type="email"
                required
                placeholder="admin@boxcare.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 42px",
                  backgroundColor: "#13110F",
                  border: "1.5px solid #382D25",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#D68A45";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(214, 138, 69, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#382D25";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label
                htmlFor="admin-password"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#D4C7BA",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Security Password <span style={{ color: "#D68A45" }}>*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "12px",
                  fontWeight: 500,
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
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 42px 11px 42px",
                  backgroundColor: "#13110F",
                  border: "1.5px solid #382D25",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#D68A45";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(214, 138, 69, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#382D25";
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
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              id="admin-remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
                accentColor: "#D68A45",
                cursor: "pointer",
              }}
            />
            <label
              htmlFor="admin-remember-me"
              style={{ fontSize: "13px", color: "#C8BDB2", cursor: "pointer", userSelect: "none" }}
            >
              Keep admin session active on this workstation
            </label>
          </div>

          {/* Sign In Button */}
          <button
            id="admin-signin-btn"
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "13px 20px",
              backgroundColor: isLoading ? "#5C3A22" : "#D68A45",
              color: "#181513",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(214, 138, 69, 0.3)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "4px",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) (e.currentTarget as HTMLElement).style.backgroundColor = "#E29A57";
            }}
            onMouseLeave={(e) => {
              if (!isLoading) (e.currentTarget as HTMLElement).style.backgroundColor = "#D68A45";
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
                <span style={{ color: "#FFFFFF" }}>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Back to Storefront Link */}
        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #2B231D" }}>
          <Link
            href="/"
            style={{
              fontSize: "13px",
              color: "#A8988B",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#D68A45";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#A8988B";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>

      {/* Security note footer */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "11px",
          color: "#78685C",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>256-Bit Encrypted Portal</span>
        </div>
        <span>•</span>
        <span>Restricted Internal Access</span>
        <span>•</span>
        <span>IP Monitored</span>
      </div>

      {/* Forgot Password Modal for Admin */}
      {showForgotModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
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
              backgroundColor: "#1E1B18",
              border: "1px solid #382D25",
              borderRadius: "16px",
              maxWidth: "420px",
              width: "100%",
              padding: "32px",
              boxShadow: "0 24px 50px rgba(0, 0, 0, 0.5)",
              position: "relative",
              color: "#F3ECE4",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
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

            {!forgotSent ? (
              <div>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(214, 138, 69, 0.1)",
                    border: "1px solid rgba(214, 138, 69, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D68A45",
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
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    margin: "0 0 8px 0",
                  }}
                >
                  Admin Recovery Request
                </h3>
                <p style={{ fontSize: "13px", color: "#A8988B", margin: "0 0 20px 0", lineHeight: 1.5 }}>
                  Enter your registered admin corporate email. A one-time security recovery token will be dispatched to your administrator inbox.
                </p>

                <form onSubmit={handleForgotSubmit}>
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      htmlFor="admin-forgot-email"
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#D4C7BA",
                        marginBottom: "6px",
                      }}
                    >
                      Admin Email
                    </label>
                    <input
                      id="admin-forgot-email"
                      type="email"
                      required
                      placeholder="admin@boxcare.in"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1.5px solid #382D25",
                        backgroundColor: "#13110F",
                        fontSize: "14px",
                        color: "#FFFFFF",
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
                      backgroundColor: "#D68A45",
                      color: "#181513",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      marginBottom: "12px",
                    }}
                  >
                    Send Recovery Token
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      backgroundColor: "transparent",
                      color: "#8C7E72",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
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
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "#10B981",
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
                    color: "#FFFFFF",
                    margin: "0 0 8px 0",
                  }}
                >
                  Recovery Sent
                </h3>
                <p style={{ fontSize: "13px", color: "#A8988B", lineHeight: 1.5, margin: "0 0 20px 0" }}>
                  If <strong>{forgotEmail}</strong> matches an authorized admin record, recovery instructions have been delivered.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#D68A45",
                    color: "#181513",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Return to Admin Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
