"use client";

import React from "react";

interface NavigationDeleteModalProps {
  isOpen: boolean;
  itemTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  hasChildren?: boolean;
}

export function NavigationDeleteModal({
  isOpen,
  itemTitle,
  onClose,
  onConfirm,
  hasChildren = false,
}: NavigationDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(30, 27, 24, 0.65)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#FFFFFF",
          border: "1px solid #EDE3D4",
          borderRadius: "18px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#FEE2E2",
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
            }}
          >
            🗑️
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#2E1A0C" }}>
              Delete Navigation Item?
            </h3>
            <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#6B6B6B", lineHeight: "1.5" }}>
              Are you sure you want to remove <strong style={{ color: "#2E1A0C" }}>&quot;{itemTitle}&quot;</strong> from storefront navigation?
              {hasChildren && (
                <span style={{ display: "block", marginTop: "8px", fontWeight: 700, color: "#DC2626" }}>
                  ⚠️ Warning: All child dropdown menu items under this parent will also be removed.
                </span>
              )}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 16px",
              borderRadius: "10px",
              border: "1px solid #D1C7BD",
              background: "#FFFFFF",
              color: "#5C3A22",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "9px 18px",
              borderRadius: "10px",
              border: "none",
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(220, 38, 38, 0.25)",
            }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
