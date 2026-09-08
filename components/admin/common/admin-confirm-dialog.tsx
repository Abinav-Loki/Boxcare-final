"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { verifyAdminActionPasswordAction } from "@/app/actions/admin-auth";

export interface AdminConfirmOptions {
  title?: string;
  message?: string;
  description?: string;
  defaultCommitPreview?: string;
  isDestructive?: boolean;
  isDelete?: boolean;
  confirmLabel?: string;
  onConfirm: (commitNote?: string) => Promise<void> | void;
}

export function useAdminConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"CONFIRM" | "PASSWORD">("CONFIRM");
  const [options, setOptions] = useState<AdminConfirmOptions | null>(null);
  const [commitNote, setCommitNote] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const confirmAction = useCallback((opts: AdminConfirmOptions) => {
    setOptions(opts);
    setCommitNote("");
    setStep("CONFIRM");
    setPassword("");
    setShowPassword(false);
    setErrorMessage(null);
    setIsVerifying(false);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPassword("");
    setCommitNote("");
    setErrorMessage(null);
    setIsVerifying(false);
    setOptions(null);
  }, []);

  const handleContinueToPassword = () => {
    setStep("PASSWORD");
    setErrorMessage(null);
  };

  useEffect(() => {
    if (step === "PASSWORD" && isOpen) {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [step, isOpen]);

  const handleVerifyAndExecute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim() || isVerifying || !options) return;

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await verifyAdminActionPasswordAction(password.trim());
      if (!res.success) {
        setErrorMessage(res.error || "Incorrect password");
        setIsVerifying(false);
        setPassword("");
        passwordInputRef.current?.focus();
        return;
      }

      // Password verified successfully on server!
      const actionToExecute = options.onConfirm;
      const noteToSend = commitNote.trim() || undefined;
      handleClose();
      await actionToExecute(noteToSend);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to verify password";
      setErrorMessage(errorMsg);
      setIsVerifying(false);
      setPassword("");
    }
  };

  const isDestructive = options?.isDestructive ?? false;
  const defaultConfirmMessage = isDestructive
    ? "This action cannot be undone. Are you sure you want to proceed with this deletion?"
    : "Are you sure you want to do this?";

  const resolvedDefaultPreview = options?.defaultCommitPreview || options?.title || "Admin change completed";

  const ConfirmDialog = isOpen && options ? (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 16, 14, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "18px",
          border: "1px solid #EDE3D4",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3), 0 4px 12px rgba(92,58,34,0.08)",
          width: "100%",
          maxWidth: "460px",
          overflow: "hidden",
          animation: "adminModalPop 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #F0E6DA",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: isDestructive && step === "CONFIRM" ? "#FEF2F2" : "#FAF7F2",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: isDestructive ? "#FEE2E2" : "#F7EDE2",
                color: isDestructive ? "#DC2626" : "#5C3A22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              {step === "PASSWORD" ? "🔒" : isDestructive ? "⚠️" : "❓"}
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#2B2B2B", margin: 0 }}>
                {step === "PASSWORD"
                  ? "Enter Admin Verification Password"
                  : options.title || (isDestructive ? "Confirm Deletion" : "Confirm Action")}
              </h3>
              <span style={{ fontSize: "11px", color: "#8E8880" }}>
                Step {step === "CONFIRM" ? "1 of 2: Confirmation" : "2 of 2: Security Verification"}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "16px",
              color: "#8E8880",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "22px" }}>
          {step === "CONFIRM" ? (
            <div>
              <p style={{ fontSize: "14px", color: "#2B2B2B", fontWeight: 600, margin: "0 0 8px 0", lineHeight: 1.5 }}>
                {options.message || defaultConfirmMessage}
              </p>

              {/* Optional Commit Note in Step 1 */}
              <div style={{ marginTop: "16px" }}>
                <label
                  htmlFor="admin-commit-input"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#5C3A22",
                    marginBottom: "6px",
                  }}
                >
                  <span>Commit Note / Change Summary</span>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#8E8880" }}>Optional</span>
                </label>
                <textarea
                  id="admin-commit-input"
                  rows={2}
                  value={commitNote}
                  onChange={(e) => setCommitNote(e.target.value)}
                  placeholder="Optional — leave empty to use the default"
                  style={{
                    width: "100%",
                    fontSize: "13px",
                    color: "#2B2B2B",
                    background: "#F7F2EC",
                    border: "1.5px solid #EDE3D4",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    boxSizing: "border-box",
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#5C3A22";
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#EDE3D4";
                    e.currentTarget.style.backgroundColor = "#F7F2EC";
                  }}
                />
                <div style={{ marginTop: "5px", fontSize: "11px", color: "#8E8880" }}>
                  Default: <span style={{ fontStyle: "italic", color: "#5C3A22", fontWeight: 600 }}>&ldquo;{resolvedDefaultPreview}&rdquo;</span>
                </div>
              </div>

              {/* Action Buttons for Step 1 */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px" }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    padding: "9px 18px",
                    background: "#F7F2EC",
                    border: "1px solid #EDE3D4",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#4A4A4A",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleContinueToPassword}
                  style={{
                    padding: "9px 20px",
                    background: isDestructive ? "#DC2626" : "#5C3A22",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: isDestructive
                      ? "0 2px 8px rgba(220, 38, 38, 0.25)"
                      : "0 2px 8px rgba(92, 58, 34, 0.25)",
                  }}
                >
                  {options.confirmLabel || "Continue →"}
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Password Prompt & Commit Summary */
            <form onSubmit={handleVerifyAndExecute}>
              {/* Show selected commit note or default note */}
              <div
                style={{
                  marginBottom: "16px",
                  padding: "10px 12px",
                  background: "#FAF7F2",
                  borderRadius: "8px",
                  border: "1px solid #EDE3D4",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#8E8880", textTransform: "uppercase", marginBottom: "4px" }}>
                  Commit Note ({commitNote.trim() ? "Custom" : "Default"}):
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#2B2B2B" }}>
                  &ldquo;{commitNote.trim() || resolvedDefaultPreview}&rdquo;
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#4A4A4A", margin: "0 0 10px 0", lineHeight: 1.4 }}>
                Enter <strong>Admin Verification Password</strong> to apply changes:
              </p>

              {errorMessage && (
                <div
                  style={{
                    padding: "10px 12px",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "8px",
                    color: "#DC2626",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div style={{ position: "relative", marginBottom: "8px" }}>
                <input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter verification password (default: boxcare)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  disabled={isVerifying}
                  style={{
                    width: "100%",
                    padding: "11px 42px 11px 12px",
                    background: "#F7F2EC",
                    border: errorMessage ? "1.5px solid #DC2626" : "1px solid #EDE3D4",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#2B2B2B",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    fontSize: "14px",
                    color: "#8E8880",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div style={{ fontSize: "11px", color: "#8E8880", marginBottom: "18px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>💡</span>
                <span>Default password: <strong style={{ color: "#5C3A22", fontFamily: "monospace" }}>boxcare</strong> (manageable in Settings)</span>
              </div>

              {/* Action Buttons for Step 2 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setStep("CONFIRM")}
                  disabled={isVerifying}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "12px",
                    color: "#5C3A22",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  ← Back
                </button>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isVerifying}
                    style={{
                      padding: "9px 16px",
                      background: "#F7F2EC",
                      border: "1px solid #EDE3D4",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#4A4A4A",
                      cursor: isVerifying ? "not-allowed" : "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying || !password.trim()}
                    style={{
                      padding: "9px 20px",
                      background: isDestructive ? "#DC2626" : "#5C3A22",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      cursor: isVerifying || !password.trim() ? "not-allowed" : "pointer",
                      opacity: isVerifying || !password.trim() ? 0.7 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 2px 8px rgba(92, 58, 34, 0.25)",
                    }}
                  >
                    {isVerifying && <span>⏳</span>}
                    <span>{isVerifying ? "Verifying..." : "Confirm & Apply"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return {
    confirmAction,
    ConfirmDialog,
  };
}
