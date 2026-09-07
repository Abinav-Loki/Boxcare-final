"use client";

import React from "react";
import { PromotionalOffer } from "./coupon-types";

interface OffersSectionProps {
  offers: PromotionalOffer[];
  onApplyOfferCode?: (code: string) => void;
}

export function OffersSection({ offers }: OffersSectionProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #EDE3D4",
        borderRadius: "16px",
        padding: "20px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#2E1A0C" }}>
            📣 Active Storefront Promotional Offers & Deals
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem", color: "#777" }}>
            Promotional banners highlighted across customer cart drawers and top announcement tickers.
          </p>
        </div>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "3px 10px", borderRadius: "8px", background: "#FAF7F2", color: "#8B5E3C", border: "1px solid #EDE3D4" }}>
          {offers.length} Live Campaigns
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            style={{
              background: offer.bgColor || "#FFF8F0",
              border: "1px solid #EDE3D4",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: "rgba(0,0,0,0.06)",
                    color: offer.textColor || "#8B4513",
                    letterSpacing: "0.5px",
                  }}
                >
                  {offer.badge}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 900,
                    color: offer.textColor || "#8B4513",
                  }}
                >
                  {offer.discountText}
                </span>
              </div>

              <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: 800, color: "#2E1A0C" }}>
                {offer.title}
              </h4>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#555", lineHeight: "1.4" }}>
                {offer.description}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px dashed rgba(0,0,0,0.12)",
                paddingTop: "10px",
                marginTop: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.75rem", color: "#777" }}>Code:</span>
                <strong style={{ fontSize: "0.85rem", color: "#2E1A0C", background: "#FFFFFF", padding: "2px 8px", borderRadius: "6px", border: "1px solid #EDE3D4" }}>
                  {offer.couponCode}
                </strong>
              </div>

              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}>
                {offer.validUntil}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
