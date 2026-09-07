"use client";

import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  couponCode: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  couponCode,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(20, 18, 16, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "440px",
          padding: "24px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          border: "1px solid #EDE3D4",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#FEE2E2",
            color: "#DC2626",
            fontSize: "1.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
          }}
        >
          🗑️
        </div>

        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#2E1A0C", margin: "0 0 8px 0" }}>
          Delete Coupon Code?
        </h3>

        <p style={{ fontSize: "0.9rem", color: "#666", margin: "0 0 20px 0", lineHeight: "1.5" }}>
          Are you sure you want to permanently delete{" "}
          <strong style={{ color: "#2E1A0C", background: "#F4EDE4", padding: "2px 6px", borderRadius: "4px" }}>
            {couponCode}
          </strong>
          ? Customers will no longer be able to redeem this discount code at checkout.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px 18px",
              background: "#F4EDE4",
              border: "1px solid #D1C7BD",
              borderRadius: "8px",
              fontWeight: 700,
              color: "#5C3A22",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px 18px",
              background: "#DC2626",
              border: "none",
              borderRadius: "8px",
              fontWeight: 800,
              color: "#FFFFFF",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(220, 38, 38, 0.4)",
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
