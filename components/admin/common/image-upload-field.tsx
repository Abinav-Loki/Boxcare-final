"use client";

import React, { useState, useRef } from "react";

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (newImageUrl: string) => void;
  presetImages?: { label: string; url: string }[];
  helperText?: string;
}

export function ImageUploadField({
  label = "Box Artwork / Category Image",
  value,
  onChange,
  presetImages = [],
  helperText = "Upload PNG, JPG, or WEBP (up to 5MB) or select from library.",
}: ImageUploadFieldProps) {
  const [activeMode, setActiveMode] = useState<"upload" | "library" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, SVG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Label and Mode Switcher Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
        <label style={{ fontSize: "11px", fontWeight: 700, color: "#4A4A4A", margin: 0 }}>
          {label}
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            background: "#F7F2EC",
            padding: "2px",
            borderRadius: "6px",
            border: "1px solid #EDE3D4",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMode("upload")}
            style={{
              padding: "3px 8px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: activeMode === "upload" ? "#5C3A22" : "transparent",
              color: activeMode === "upload" ? "#FFFFFF" : "#5C3A22",
            }}
          >
            📤 Upload File
          </button>
          {presetImages.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveMode("library")}
              style={{
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: activeMode === "library" ? "#5C3A22" : "transparent",
                color: activeMode === "library" ? "#FFFFFF" : "#5C3A22",
              }}
            >
              🖼️ Library
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setActiveMode("url");
              setCustomUrlInput(value);
            }}
            style={{
              padding: "3px 8px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: activeMode === "url" ? "#5C3A22" : "transparent",
              color: activeMode === "url" ? "#FFFFFF" : "#5C3A22",
            }}
          >
            🔗 URL
          </button>
        </div>
      </div>

      {/* 1. Direct File Upload Box */}
      {activeMode === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: isDragging ? "2px dashed #D68A45" : "1.5px dashed #D1C7BD",
            background: isDragging ? "#FAF4EC" : "#FFFFFF",
            borderRadius: "10px",
            padding: "16px",
            textAlign: "center",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.15s ease",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {value ? (
            <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%" }}>
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "8px",
                  background: "#F7F2EC",
                  border: "1px solid #EDE3D4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  flexShrink: 0,
                }}
              >
                <img
                  src={value}
                  alt="Uploaded Preview"
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              </div>

              <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#2E1A0C" }}>
                  Image Selected / Uploaded
                </div>
                <div style={{ fontSize: "11px", color: "#8E8880", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {value.startsWith("data:") ? "Custom Image Uploaded (Base64)" : value}
                </div>
                <div style={{ fontSize: "10px", color: "#D68A45", fontWeight: 700, marginTop: "2px" }}>
                  Click or drag another image to replace
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background: "#FEE2E2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: "24px" }}>📸</div>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#5C3A22" }}>
                  Click to browse image
                </span>
                <span style={{ fontSize: "12px", color: "#6B6B6B" }}> or drag &amp; drop file here</span>
              </div>
              <span style={{ fontSize: "10px", color: "#8E8880" }}>{helperText}</span>
            </>
          )}
        </div>
      )}

      {/* 2. Preset Library Selection */}
      {activeMode === "library" && presetImages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px", maxHeight: "150px", overflowY: "auto", padding: "4px" }}>
            {presetImages.map((img) => {
              const isSelected = value === img.url;
              return (
                <div
                  key={img.url}
                  onClick={() => onChange(img.url)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    background: isSelected ? "#F3EDE6" : "#FFFFFF",
                    border: isSelected ? "1.5px solid #5C3A22" : "1px solid #EDE3D4",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "#F7F2EC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2px",
                      flexShrink: 0,
                    }}
                  >
                    <img src={img.url} alt={img.label} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: isSelected ? 800 : 600, color: "#2E1A0C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {img.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Direct Image URL Input */}
      {activeMode === "url" && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="e.g. /images/mailer-boxes.png or https://..."
            value={customUrlInput}
            onChange={(e) => {
              setCustomUrlInput(e.target.value);
              onChange(e.target.value);
            }}
            style={{
              flex: 1,
              background: "#FFFFFF",
              border: "1px solid #D1C7BD",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "12px",
              color: "#2E1A0C",
            }}
          />
          {value && (
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
                background: "#F7F2EC",
                border: "1px solid #EDE3D4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
                flexShrink: 0,
              }}
            >
              <img src={value} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
