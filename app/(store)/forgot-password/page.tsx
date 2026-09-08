"use client";

import React, { useState } from "react";
import Link from "next/link";
import { customerForgotPasswordAction } from "@/app/actions/customer-auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setIsLoading(true);
    const res = await customerForgotPasswordAction({ email });
    setIsLoading(false);
    setIsSubmitted(true);
    setFeedbackMessage(res.message);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", backgroundColor: "#FAF7F2", padding: "40px 16px 60px" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "480px", margin: "0 auto 24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#8C7E72" }}>
        <Link href="/" style={{ color: "#5C3A22", textDecoration: "none", fontWeight: 500 }}>
          Home
        </Link>
        <span>/</span>
        <Link href="/signin" style={{ color: "#5C3A22", textDecoration: "none", fontWeight: 500 }}>
          Sign In
        </Link>
        <span>/</span>
        <span style={{ color: "#1F1A16", fontWeight: 600 }}>Forgot Password</span>
      </div>

      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(92, 58, 34, 0.07)",
          border: "1px solid #EAE0D5",
          padding: "40px 32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #E5D8C8",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5C3A22",
              marginBottom: "16px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "26px",
              fontWeight: 700,
              color: "#1F1A16",
              margin: "0 0 8px 0",
            }}
          >
            Forgot Password
          </h1>
          <p style={{ fontSize: "14px", color: "#7A6E65", margin: 0, lineHeight: 1.5 }}>
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2C2520",
                  marginBottom: "8px",
                }}
              >
                Account Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid #E2D7CC",
                  fontSize: "14px",
                  color: "#1F1A16",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#FCFAF8",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px 20px",
                backgroundColor: "#5C3A22",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                boxShadow: "0 4px 12px rgba(92, 58, 34, 0.2)",
              }}
            >
              {isLoading ? "Sending Instructions..." : "Send Password Reset Link"}
            </button>

            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <Link
                href="/signin"
                style={{
                  fontSize: "13px",
                  color: "#5C3A22",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#ECFDF5",
                color: "#065F46",
                border: "1px solid #A7F3D0",
                fontSize: "14px",
                lineHeight: 1.5,
                marginBottom: "24px",
              }}
            >
              {feedbackMessage || "If this email is registered, password reset instructions have been sent. Please check your inbox and spam folder."}
            </div>

            <Link
              href="/signin"
              style={{
                display: "inline-block",
                width: "100%",
                padding: "12px 20px",
                backgroundColor: "#5C3A22",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              Return to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
