"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StorefrontPage, STOREFRONT_PAGES_LIST } from "./pages-types";
import { InlineCmsEditor } from "./inline-cms-editor";

export function PagesManager() {
  const [pages, setPages] = useState<StorefrontPage[]>(STOREFRONT_PAGES_LIST);
  const [editingPage, setEditingPage] = useState<StorefrontPage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "CORE" | "COMMERCE" | "POLICY">("ALL");

  // If a page is chosen for visual CMS editing, open the inline studio
  if (editingPage) {
    return <InlineCmsEditor page={editingPage} onBack={() => setEditingPage(null)} />;
  }

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || page.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleToggleStatus = (id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
            }
          : p
      )
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#2B2B2B", margin: 0, letterSpacing: "-0.02em" }}>
              Storefront Pages & CMS
            </h1>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#F7F2EC", color: "#5C3A22", border: "1px solid #EDE3D4" }}>
              {pages.length} Pages
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#6B6B6B", margin: "4px 0 0 0" }}>
            Visually customize storefront landing pages, headings, banners, and policy contents in real-time.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setEditingPage(pages[0])}
            style={{
              padding: "8px 18px",
              background: "#5C3A22",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(92, 58, 34, 0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>✨</span>
            <span>Edit Home Page (Visual CMS)</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EDE3D4",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: "0 1px 3px rgba(43,43,43,0.03)",
        }}
      >
        <div style={{ width: "300px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search pages by name or path..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "#F7F2EC",
              border: "1px solid #EDE3D4",
              borderRadius: "8px",
              padding: "7px 12px 7px 32px",
              fontSize: "12px",
              color: "#2B2B2B",
              outline: "none",
            }}
          />
          <svg
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#8E8880" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", background: "#F7F2EC", padding: "3px", borderRadius: "8px", border: "1px solid #EDE3D4", gap: "2px" }}>
          {[
            { id: "ALL", label: "All Pages" },
            { id: "CORE", label: "Core Pages" },
            { id: "COMMERCE", label: "Commerce" },
            { id: "POLICY", label: "Policies" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as any)}
              style={{
                padding: "4px 12px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: typeFilter === tab.id ? "#5C3A22" : "transparent",
                color: typeFilter === tab.id ? "#FFFFFF" : "#6B6B6B",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Pages Table */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #EDE3D4",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(43,43,43,0.04)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#F7F2EC", borderBottom: "1px solid #EDE3D4", fontSize: "11px", fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 20px" }}>Page Title</th>
                <th style={{ padding: "12px 20px" }}>Storefront Route</th>
                <th style={{ padding: "12px 20px" }}>Type</th>
                <th style={{ padding: "12px 20px" }}>Sections</th>
                <th style={{ padding: "12px 20px" }}>Status</th>
                <th style={{ padding: "12px 20px" }}>Last Modified</th>
                <th style={{ padding: "12px 20px", textAlign: "right" }}>Visual CMS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {filteredPages.map((page, i) => (
                <tr
                  key={page.id}
                  style={{
                    borderBottom: i === filteredPages.length - 1 ? "none" : "1px solid #EDE3D4",
                    background: "#FFFFFF",
                  }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 700, color: "#2B2B2B" }}>{page.title}</div>
                  </td>
                  <td style={{ padding: "14px 20px", fontFamily: "monospace", color: "#5C3A22" }}>
                    {page.path}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#F7F2EC", color: "#6B6B6B", border: "1px solid #EDE3D4" }}>
                      {page.type}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: 600, color: "#4A4A4A" }}>
                    {page.sectionsCount} Sections
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button
                      onClick={() => handleToggleStatus(page.id)}
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "6px",
                        background: page.status === "PUBLISHED" ? "#ECFDF5" : "#F3F4F6",
                        color: page.status === "PUBLISHED" ? "#059669" : "#6B7280",
                        border: `1px solid ${page.status === "PUBLISHED" ? "#A7F3D0" : "#E5E7EB"}`,
                        cursor: "pointer",
                      }}
                    >
                      {page.status === "PUBLISHED" ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td style={{ padding: "14px 20px", color: "#8E8880", fontSize: "11px" }}>
                    {page.lastModified}
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <Link
                        href={page.path}
                        target="_blank"
                        style={{
                          padding: "5px 10px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#5C3A22",
                          background: "#F7F2EC",
                          borderRadius: "6px",
                          border: "1px solid #EDE3D4",
                          textDecoration: "none",
                        }}
                      >
                        Live ↗
                      </Link>
                      <button
                        onClick={() => setEditingPage(page)}
                        style={{
                          padding: "5px 12px",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#FFFFFF",
                          background: "#5C3A22",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>✏️</span>
                        <span>Edit CMS</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
