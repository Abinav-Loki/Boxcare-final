"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { customerResetPasswordAction } from "@/app/actions/customer-auth";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing or invalid. Please request a new link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);
    const res = await customerResetPasswordAction({
      token,
      password,
      confirmPassword,
    });
    setIsLoading(false);

    if (res.success) {
      setIsSuccess(true);
      setSuccessMessage(res.message);
      setTimeout(() => {
        router.push("/signin");
      }, 2500);
    } else {
      setError(res.message || res.error || "Failed to reset password. The link may have expired.");
    }
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
        <span style={{ color: "#1F1A16", fontWeight: 600 }}>Reset Password</span>
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
            Create New Password
          </h1>
          <p style={{ fontSize: "14px", color: "#7A6E65", margin: 0, lineHeight: 1.5 }}>
            Enter your new secure password below to regain account access.
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FECACA",
              fontSize: "13px",
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}

        {isSuccess ? (
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
              {successMessage}
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
              Proceed to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2C2520",
                  marginBottom: "8px",
                }}
              >
                New Password (minimum 8 characters)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 42px 12px 16px",
                    borderRadius: "10px",
                    border: "1.5px solid #E2D7CC",
                    fontSize: "14px",
                    color: "#1F1A16",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#FCFAF8",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#8C7E72",
                    padding: "4px",
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2C2520",
                  marginBottom: "8px",
                }}
              >
                Confirm New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 42px 12px 16px",
                    borderRadius: "10px",
                    border: "1.5px solid #E2D7CC",
                    fontSize: "14px",
                    color: "#1F1A16",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#FCFAF8",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#8C7E72",
                    padding: "4px",
                  }}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
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
              {isLoading ? "Updating Password..." : "Set New Password"}
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
                ← Return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#5C3A22", fontWeight: 600 }}>Loading password reset portal...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
