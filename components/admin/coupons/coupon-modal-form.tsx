"use client";

import React, { useState, useEffect } from "react";
import { AdminCoupon, CouponDiscountType, CouponStatus } from "./coupon-types";

interface CouponModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: AdminCoupon) => void;
  couponToEdit?: AdminCoupon | null;
}

export function CouponModalForm({
  isOpen,
  onClose,
  onSave,
  couponToEdit,
}: CouponModalFormProps) {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<CouponDiscountType>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(1000);
  const [maxDiscountCap, setMaxDiscountCap] = useState<string>("500");
  const [isUnlimitedUses, setIsUnlimitedUses] = useState(false);
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split("T")[0]);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<CouponStatus>("ACTIVE");
  const [isFeatured, setIsFeatured] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (couponToEdit) {
      setCode(couponToEdit.code);
      setTitle(couponToEdit.title);
      setDescription(couponToEdit.description || "");
      setDiscountType(couponToEdit.discountType);
      setDiscountValue(couponToEdit.discountValue);
      setMinOrderValue(couponToEdit.minOrderValue);
      setMaxDiscountCap(couponToEdit.maxDiscountCap ? couponToEdit.maxDiscountCap.toString() : "");
      setIsUnlimitedUses(couponToEdit.usageLimit === null);
      setUsageLimit(couponToEdit.usageLimit ?? 500);
      setValidFrom(couponToEdit.validFrom);
      setValidUntil(couponToEdit.validUntil);
      setStatus(couponToEdit.status);
      setIsFeatured(couponToEdit.isFeatured || false);
    } else {
      // Defaults for new coupon
      setCode("");
      setTitle("");
      setDescription("");
      setDiscountType("PERCENTAGE");
      setDiscountValue(10);
      setMinOrderValue(1000);
      setMaxDiscountCap("500");
      setIsUnlimitedUses(false);
      setUsageLimit(500);
      setValidFrom(new Date().toISOString().split("T")[0]);
      setValidUntil(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
      setStatus("ACTIVE");
      setIsFeatured(false);
    }
    setErrors({});
  }, [couponToEdit, isOpen]);

  if (!isOpen) return null;

  const generateRandomCode = () => {
    const prefixes = ["BOX", "SAVE", "DEAL", "PACK", "FESTIVE", "VIP", "CARE"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(10 + Math.random() * 90);
    setCode(`${prefix}${number}`);
    if (!title) {
      setTitle(`${prefix} ${number}% Special Discount`);
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!code.trim()) {
      errs.code = "Coupon code is required.";
    } else if (!/^[A-Z0-9_-]+$/i.test(code.trim())) {
      errs.code = "Coupon code can only contain letters, numbers, and hyphens.";
    }
    if (!title.trim()) {
      errs.title = "Coupon title is required.";
    }
    if (discountType !== "FREE_SHIPPING" && (discountValue <= 0 || isNaN(discountValue))) {
      errs.discountValue = "Discount value must be greater than 0.";
    }
    if (discountType === "PERCENTAGE" && discountValue > 100) {
      errs.discountValue = "Percentage discount cannot exceed 100%.";
    }
    if (validFrom && validUntil && new Date(validFrom) > new Date(validUntil)) {
      errs.validUntil = "Valid until date must be after valid from date.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newCoupon: AdminCoupon = {
      id: couponToEdit ? couponToEdit.id : `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: discountType === "FREE_SHIPPING" ? 0 : Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscountCap: discountType === "PERCENTAGE" && maxDiscountCap ? Number(maxDiscountCap) : undefined,
      usageCount: couponToEdit ? couponToEdit.usageCount : 0,
      usageLimit: isUnlimitedUses ? null : Number(usageLimit) || 100,
      validFrom,
      validUntil,
      status,
      createdAt: couponToEdit ? couponToEdit.createdAt : new Date().toISOString().split("T")[0],
      isFeatured,
    };

    onSave(newCoupon);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(20, 18, 16, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          border: "1px solid #EDE3D4",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #EDE3D4",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FAF7F2",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#2E1A0C" }}>
              {couponToEdit ? "✏️ Edit Coupon & Offer" : "✨ Create New Coupon & Offer"}
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#777" }}>
              Configure promo codes, discount values, redemption limits, and validity.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.4rem",
              color: "#888",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Row 1: Code & Generator */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "flex-end" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24", marginBottom: "6px" }}>
                Coupon Code *
              </label>
              <input
                type="text"
                placeholder="e.g. BOXCARE10"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.code ? "#DC2626" : "#D1C7BD"}`,
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  outline: "none",
                  background: "#FDFBF7",
                  textTransform: "uppercase",
                }}
              />
              {errors.code && <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>{errors.code}</span>}
            </div>

            <button
              type="button"
              onClick={generateRandomCode}
              style={{
                padding: "10px 14px",
                background: "#F4EDE4",
                border: "1px solid #D6C7B2",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#5C3A22",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
              }}
            >
              <span>⚡</span>
              <span>Generate Code</span>
            </button>
          </div>

          {/* Row 2: Title & Description */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24", marginBottom: "6px" }}>
              Coupon Title *
            </label>
            <input
              type="text"
              placeholder="e.g. 10% Off First Bulk Order"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: `1px solid ${errors.title ? "#DC2626" : "#D1C7BD"}`,
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            {errors.title && <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>{errors.title}</span>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24", marginBottom: "6px" }}>
              Short Description / Internal Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Applicable on all corrugated box orders above ₹1,500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #D1C7BD",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
          </div>

          {/* Row 3: Discount Type Selector */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24", marginBottom: "8px" }}>
              Discount Type *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {[
                { id: "PERCENTAGE", label: "Percentage %", icon: "%", desc: "e.g. 10% or 20% off" },
                { id: "FIXED_AMOUNT", label: "Flat ₹ Discount", icon: "₹", desc: "e.g. ₹500 flat cash off" },
                { id: "FREE_SHIPPING", label: "Free Shipping", icon: "🚚", desc: "Waives delivery fee" },
              ].map((t) => (
                <div
                  key={t.id}
                  onClick={() => setDiscountType(t.id as CouponDiscountType)}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    border: discountType === t.id ? "2px solid #D68A45" : "1px solid #D1C7BD",
                    background: discountType === t.id ? "#FFF9F2" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 800, fontSize: "0.9rem", color: "#2E1A0C" }}>
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#777", marginTop: "4px" }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 4: Discount Values, Caps & Min Order */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
            {discountType !== "FREE_SHIPPING" && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24", marginBottom: "6px" }}>
                  Discount Value ({discountType === "PERCENTAGE" ? "%" : "₹"}) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={discountType === "PERCENTAGE" ? 100 : 50000}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: `1px solid ${errors.discountValue ? "#DC2626" : "#D1C7BD"}`,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    outline: "none",
                  }}
                />
                {errors.discountValue && <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>{errors.discountValue}</span>}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24", marginBottom: "6px" }}>
                Min Order Value (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(Number(e.target.value))}
                placeholder="0 for no minimum"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #D1C7BD",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            {discountType === "PERCENTAGE" && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24", marginBottom: "6px" }}>
                  Max Discount Cap (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxDiscountCap}
                  onChange={(e) => setMaxDiscountCap(e.target.value)}
                  placeholder="e.g. 1000 (Optional)"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #D1C7BD",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>
            )}
          </div>

          {/* Row 5: Usage Limit & Unlimited Toggle */}
          <div style={{ background: "#FBF9F5", border: "1px solid #EDE3D4", padding: "14px 16px", borderRadius: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isUnlimitedUses ? "0" : "12px" }}>
              <div>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2E1A0C" }}>Redemption / Usage Limits</span>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.78rem", color: "#777" }}>
                  Set how many total times customers can redeem this coupon code.
                </p>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#5C3A22" }}>
                <input
                  type="checkbox"
                  checked={isUnlimitedUses}
                  onChange={(e) => setIsUnlimitedUses(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <span>Unlimited Uses</span>
              </label>
            </div>

            {!isUnlimitedUses && (
              <div style={{ width: "200px" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#555", marginBottom: "4px" }}>
                  Maximum Redemptions:
                </label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #D1C7BD",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                  }}
                />
              </div>
            )}
          </div>

          {/* Row 6: Validity Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24", marginBottom: "6px" }}>
                Valid From *
              </label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #D1C7BD",
                  fontSize: "0.88rem",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24", marginBottom: "6px" }}>
                Valid Until *
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.validUntil ? "#DC2626" : "#D1C7BD"}`,
                  fontSize: "0.88rem",
                  outline: "none",
                }}
              />
              {errors.validUntil && <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>{errors.validUntil}</span>}
            </div>
          </div>

          {/* Row 7: Status & Featured Checkbox */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #EDE3D4", paddingTop: "14px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#3D2E24" }}>Initial Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CouponStatus)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #D1C7BD",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  outline: "none",
                  background: "#FFFFFF",
                }}
              >
                <option value="ACTIVE">🟢 Active</option>
                <option value="INACTIVE">⚪ Inactive</option>
                <option value="EXPIRED">🔴 Expired</option>
                <option value="USED_UP">🟠 Used Up</option>
              </select>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 700, color: "#5C3A22", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: "16px", height: "16px" }}
              />
              <span>Highlight on Storefront Offer Banner</span>
            </label>
          </div>

          {/* Modal Footer Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              borderTop: "1px solid #EDE3D4",
              paddingTop: "18px",
              marginTop: "4px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
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
              type="submit"
              style={{
                padding: "10px 24px",
                background: "#D68A45",
                border: "none",
                borderRadius: "8px",
                fontWeight: 800,
                color: "#FFFFFF",
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(214, 138, 69, 0.4)",
              }}
            >
              {couponToEdit ? "Save Changes ✓" : "Create Coupon 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
