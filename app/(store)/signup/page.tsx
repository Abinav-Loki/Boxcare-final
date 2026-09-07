"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Password validation helper
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage({ type: "error", text: "Please complete all required fields." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match. Please verify." });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    if (!agreeTerms) {
      setMessage({ type: "error", text: "Please accept the Terms of Service to continue." });
      return;
    }

    setIsLoading(true);
    // Simulate UI interaction (UI only, no real backend)
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Account created successfully! Redirecting to Sign In... (Demo UI)",
      });
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    }, 900);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", backgroundColor: "#FAF7F2", padding: "40px 16px 60px" }}>
      {/* Breadcrumb / Top bar */}
      <div style={{ maxWidth: "1120px", margin: "0 auto 24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#8C7E72" }}>
        <Link href="/" style={{ color: "#5C3A22", textDecoration: "none", fontWeight: 500 }}>
          Home
        </Link>
        <span>/</span>
        <span style={{ color: "#1F1A16", fontWeight: 600 }}>Create Account</span>
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
        {/* Left: Sign Up Form */}
        <div style={{ padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              New Customer Registration
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
              Create Your Account
            </h1>
            <p style={{ fontSize: "14px", color: "#7A6E65", margin: 0, lineHeight: 1.5 }}>
              Register in 60 seconds to access bulk trade discounts, instant dielines, and GST billing.
            </p>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              style={{
                marginBottom: "20px",
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
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-name"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2C2520",
                  marginBottom: "6px",
                }}
              >
                Full Name / Business Contact <span style={{ color: "#DC2626" }}>*</span>
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
                  id="signup-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 16px 11px 44px",
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

            {/* Email Field */}
            <div>
              <label
                htmlFor="signup-email"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2C2520",
                  marginBottom: "6px",
                }}
              >
                Work or Personal Email <span style={{ color: "#DC2626" }}>*</span>
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
                  id="signup-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 16px 11px 44px",
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

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2C2520",
                  marginBottom: "6px",
                }}
              >
                Password <span style={{ color: "#DC2626" }}>*</span>
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create strong password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 44px 11px 44px",
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

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div style={{ marginTop: "6px" }}>
                  <div style={{ display: "flex", gap: "4px", height: "4px", marginBottom: "4px" }}>
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          height: "100%",
                          borderRadius: "2px",
                          backgroundColor: idx < strength ? strengthColors[strength - 1] : "#EAE0D5",
                          transition: "background-color 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: "11px", color: strengthColors[strength - 1] || "#8C7E72", fontWeight: 600 }}>
                    Password Strength: {strengthLabels[strength - 1] || "Too short"}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2C2520",
                  marginBottom: "6px",
                }}
              >
                Confirm Password <span style={{ color: "#DC2626" }}>*</span>
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 44px 11px 44px",
                    backgroundColor: "#FFFFFF",
                    border: `1.5px solid ${
                      confirmPassword && confirmPassword !== password ? "#EF4444" : "#E2D7CC"
                    }`,
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
                    e.currentTarget.style.borderColor =
                      confirmPassword && confirmPassword !== password ? "#EF4444" : "#E2D7CC";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? (
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
              {confirmPassword && confirmPassword !== password && (
                <span style={{ fontSize: "11px", color: "#EF4444", marginTop: "4px", display: "block" }}>
                  Passwords do not match
                </span>
              )}
            </div>

            {/* Terms & Conditions Checkbox */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "4px" }}>
              <input
                id="agree-terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#5C3A22",
                  cursor: "pointer",
                  marginTop: "2px",
                }}
              />
              <label
                htmlFor="agree-terms"
                style={{ fontSize: "12px", color: "#5A4F44", cursor: "pointer", lineHeight: 1.4, userSelect: "none" }}
              >
                I agree to the{" "}
                <Link href="/policies" style={{ color: "#5C3A22", fontWeight: 600, textDecoration: "underline" }}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/policies" style={{ color: "#5C3A22", fontWeight: 600, textDecoration: "underline" }}>
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Sign Up Submit Button */}
            <button
              id="signup-submit-btn"
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
                marginTop: "6px",
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
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
              margin: "24px 0 20px",
              color: "#A3968B",
              fontSize: "12px",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE0D5" }} />
            <span style={{ padding: "0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Already registered?
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE0D5" }} />
          </div>

          {/* Link to Sign In */}
          <div style={{ textAlign: "center" }}>
            <Link
              id="goto-signin-btn"
              href="/signin"
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
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Sign In to Existing Account</span>
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
              Exclusive Customer Member Perks
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
              Unlock trade pricing and custom dielines.
            </h2>
            <p style={{ fontSize: "14px", color: "#C4B5A5", lineHeight: 1.6, marginBottom: "36px" }}>
              Join 25,000+ businesses across retail, electronics, apparel, and food industries ordering sustainable kraft packaging with guaranteed QC.
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
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: 600, color: "#FAF7F2" }}>
                    Automated Wholesale Pricing
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#A8988B", lineHeight: 1.4 }}>
                    Up to 35% tier discounts calculated instantly at checkout for larger volume runs.
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
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: 600, color: "#FAF7F2" }}>
                    Free 3D Proofing & Dielines
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#A8988B", lineHeight: 1.4 }}>
                    Upload custom artwork and inspect interactive 3D digital box proofs before production.
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: 600, color: "#FAF7F2" }}>
                    Dedicated Packaging Specialist
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#A8988B", lineHeight: 1.4 }}>
                    Direct WhatsApp & phone support with custom dieline engineers for bespoke requirements.
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
              <span>FSC Certified Sustainable Kraft</span>
            </div>
            <span>No Hidden Charges</span>
          </div>
        </div>
      </div>
    </div>
  );
}
