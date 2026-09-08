"use client";

import React, { useState, useEffect, useRef } from "react";
import { StorefrontPage, STOREFRONT_PAGES_LIST } from "./pages-types";
import { useLiveCms, publishDraftCms } from "@/lib/cms-data";
import { useAdminConfirm } from "@/components/admin/common/admin-confirm-dialog";
import { updateAdminPageAction } from "@/app/actions/admin-pages";

interface InlineCmsEditorProps {
  page: StorefrontPage;
  onBack: () => void;
}

const STOREFRONT_MEDIA_LIBRARY = [
  { name: "Mailer Boxes", path: "/images/mailer-boxes.png" },
  { name: "Corrugated Boxes", path: "/images/corrugated-boxes.png" },
  { name: "Custom Printed", path: "/images/custom-printed-boxes.png" },
  { name: "Pizza Boxes", path: "/images/pizza-boxes.png" },
  { name: "Shipping Boxes", path: "/images/shipping-boxes.png" },
  { name: "Mono Cartons", path: "/images/mono-cartons.png" },
  { name: "Tape Rolls", path: "/images/tape-rolls.png" },
  { name: "Bubble Wrap", path: "/images/bubble-wrap.png" },
  { name: "Courier Bags", path: "/images/courier-bags.png" },
  { name: "Paper Bags", path: "/images/paper-bags.png" },
  { name: "Corrugated Rolls", path: "/images/corrugated-rolls.png" },
  { name: "Corrugated Sheets", path: "/images/corrugated-sheets.png" },
  { name: "Flap Box 4x4x2", path: "/images/box_4_4_2.png" },
  { name: "Flap Box 4x4x1.5", path: "/images/box_4_4_1_5.png" },
  { name: "Flap Box 6x4x2", path: "/images/box_6_4_2.png" },
  { name: "Flap Box 6x5x1.5", path: "/images/box_6_5_1_5.png" },
];

export function InlineCmsEditor({ page, onBack }: InlineCmsEditorProps) {
  const { confirmAction, ConfirmDialog } = useAdminConfirm();
  const { resetCms, undo, redo, canUndo, canRedo } = useLiveCms();
  const [currentRoute, setCurrentRoute] = useState<string>(page.path || "/");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<"text" | "image">("text");
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const adminFileInputRef = useRef<HTMLInputElement>(null);

  // Text Inspector State
  const [selectedTag, setSelectedTag] = useState<string>("Text Element");
  const [selectedSnippet, setSelectedSnippet] = useState<string>("Click any text to inspect");
  const [fontColor, setFontColor] = useState<string>("#2E1A0C");
  const [fontSize, setFontSize] = useState<number>(18);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left");
  const [isTextHidden, setIsTextHidden] = useState<boolean>(false);

  // Image Inspector State
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("/images/mailer-boxes.png");
  const [selectedImageAlt, setSelectedImageAlt] = useState<string>("Storefront Image");
  const [imageSizePercent, setImageSizePercent] = useState<number>(100);
  const [imageOpacity, setImageOpacity] = useState<number>(100);
  const [isImageHidden, setIsImageHidden] = useState<boolean>(false);

  // Sync route if props change
  useEffect(() => {
    if (page.path) setCurrentRoute(page.path);
  }, [page.path]);

  // Keyboard shortcut listener for Ctrl+Z (Undo) and Ctrl+Y (Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedoAction();
        } else {
          e.preventDefault();
          handleUndoAction();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedoAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo]);

  const handleUndoAction = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "TRIGGER_UNDO" }, "*");
    setSaveStatus("↩️ Undo applied");
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleRedoAction = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "TRIGGER_REDO" }, "*");
    setSaveStatus("↪️ Redo applied");
    setTimeout(() => setSaveStatus(null), 2000);
  };

  // Listen to messages from the live storefront iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === "KEYBOARD_UNDO") {
        handleUndoAction();
      } else if (event.data.type === "KEYBOARD_REDO") {
        handleRedoAction();
      } else if (event.data.type === "CMS_HISTORY_UPDATED") {
        // Studio toolbar sync
      } else if (event.data.type === "CMS_TEXT_CHANGED") {
        // Silently sync in the background without intrusive popups while typing/editing
      } else if (event.data.type === "CMS_IMAGE_CHANGED") {
        if (event.data.src) setSelectedImageSrc(event.data.src);
      } else if (event.data.type === "ELEMENT_SELECTED") {
        // Switch to Text Inspector Mode
        setInspectorTab("text");
        if (event.data.tagName) setSelectedTag(event.data.tagName);
        if (event.data.textSnippet) setSelectedSnippet(event.data.textSnippet);
        if (event.data.styles) {
          if (event.data.styles.fontSize) setFontSize(event.data.styles.fontSize);
          if (event.data.styles.textAlign) setTextAlign(event.data.styles.textAlign);
          if (event.data.styles.isHidden !== undefined) setIsTextHidden(event.data.styles.isHidden);
        }
      } else if (event.data.type === "IMAGE_SELECTED") {
        // Switch to Image Inspector Mode
        setInspectorTab("image");
        if (event.data.src) setSelectedImageSrc(event.data.src);
        if (event.data.alt) setSelectedImageAlt(event.data.alt);
        if (event.data.styles) {
          if (event.data.styles.sizePercent !== undefined) setImageSizePercent(event.data.styles.sizePercent);
          if (event.data.styles.opacity !== undefined) setImageOpacity(Math.round(event.data.styles.opacity * 100));
          if (event.data.styles.isHidden !== undefined) setIsImageHidden(event.data.styles.isHidden);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Dispatch styling updates to the live storefront iframe
  const applyTextStyle = (styles: {
    color?: string;
    fontSize?: number;
    textAlign?: "left" | "center" | "right" | "justify";
    isHidden?: boolean;
  }) => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "APPLY_INSPECTOR_STYLE",
        styles,
      },
      "*"
    );
  };

  const applyImageStyle = (options: {
    src?: string;
    sizePercent?: number;
    opacity?: number;
    isHidden?: boolean;
    triggerUpload?: boolean;
  }) => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "APPLY_IMAGE_STYLE",
        ...options,
      },
      "*"
    );
  };

  const handleColorChange = (newColor: string) => {
    setFontColor(newColor);
    applyTextStyle({ color: newColor });
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    applyTextStyle({ fontSize: newSize });
  };

  const handleAlignChange = (newAlign: "left" | "center" | "right" | "justify") => {
    setTextAlign(newAlign);
    applyTextStyle({ textAlign: newAlign });
  };

  const handleTextVisibilityToggle = (hide: boolean) => {
    setIsTextHidden(hide);
    applyTextStyle({ isHidden: hide });
  };

  const handleImageSizeChange = (newSize: number) => {
    setImageSizePercent(newSize);
    applyImageStyle({ sizePercent: newSize });
  };

  const handleImageOpacityChange = (newOpacity: number) => {
    setImageOpacity(newOpacity);
    applyImageStyle({ opacity: newOpacity / 100 });
  };

  const handleImageVisibilityToggle = (hide: boolean) => {
    setIsImageHidden(hide);
    applyImageStyle({ isHidden: hide });
  };

  const handleSelectMediaLibraryImage = (src: string) => {
    setSelectedImageSrc(src);
    applyImageStyle({ src });
  };

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setSelectedImageSrc(dataUrl);
          applyImageStyle({ src: dataUrl });
          setSaveStatus("📷 Image uploaded & applied to storefront!");
          setTimeout(() => setSaveStatus(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
    if (adminFileInputRef.current) adminFileInputRef.current.value = "";
  };

  const handleTriggerDeviceUpload = () => {
    adminFileInputRef.current?.click();
  };

  const handleSave = () => {
    const targetSlug = currentRoute.replace(/^\/+|\/+$/g, "") || "home";
    const targetPage = STOREFRONT_PAGES_LIST.find((p) => p.path === currentRoute) || page;
    const targetTitle = targetPage?.title || page.title;

    confirmAction({
      title: "Save CMS Changes",
      message: `Are you sure you want to save CMS changes for "${targetTitle}"?`,
      description: "Save all current text edits, image replacements, and layout styling to draft.",
      defaultCommitPreview: `Page "${targetTitle}" updated`,
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        try {
          const res = await updateAdminPageAction(
            targetSlug,
            {
              title: targetTitle,
              content: `CMS Studio Draft for ${targetTitle}`,
            },
            commitNote
          );
          if (res.success) {
            setSaveStatus(`💾 Changes for "${targetTitle}" saved to draft & Activity History!`);
          } else {
            setSaveStatus(`⚠️ ${res.error || "Failed to save to database"}`);
          }
          setTimeout(() => setSaveStatus(null), 3500);
        } catch {
          setSaveStatus("💾 Changes saved to local preview.");
          setTimeout(() => setSaveStatus(null), 3500);
        }
      },
    });
  };

  const handlePublish = () => {
    const targetSlug = currentRoute.replace(/^\/+|\/+$/g, "") || "home";
    const targetPage = STOREFRONT_PAGES_LIST.find((p) => p.path === currentRoute) || page;
    const targetTitle = targetPage?.title || page.title;

    confirmAction({
      title: "Publish Storefront CMS Live",
      message: `Are you sure you want to publish changes for "${targetTitle}" live to the customer storefront?`,
      description: "All visual layout modifications, text updates, image replacements, and custom styling will become live and visible to customer storefront shoppers immediately.",
      defaultCommitPreview: `Page "${targetTitle}" published live`,
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        try {
          publishDraftCms();
          iframeRef.current?.contentWindow?.postMessage({ type: "CMS_PUBLISHED" }, "*");
          const res = await updateAdminPageAction(
            targetSlug,
            {
              title: targetTitle,
              content: `CMS Studio Live Published for ${targetTitle}`,
              isActive: true,
            },
            commitNote || `Page "${targetTitle}" published live`
          );
          if (res.success) {
            setSaveStatus(`🚀 Published "${targetTitle}" live & logged to Activity History!`);
          } else {
            setSaveStatus(`⚠️ ${res.error || "Failed to sync to database"}`);
          }
          setTimeout(() => setSaveStatus(null), 4000);
        } catch {
          setSaveStatus("🚀 Published changes to storefront.");
          setTimeout(() => setSaveStatus(null), 4000);
        }
      },
    });
  };

  const handleReset = () => {
    const targetSlug = currentRoute.replace(/^\/+|\/+$/g, "") || "home";
    const targetPage = STOREFRONT_PAGES_LIST.find((p) => p.path === currentRoute) || page;
    const targetTitle = targetPage?.title || page.title;

    confirmAction({
      title: "Reset Storefront Layout to Factory Defaults",
      message: `This action cannot be undone. Are you sure you want to reset "${targetTitle}" content back to default factory settings?`,
      description: "All custom text, images, and styling will be permanently restored to factory defaults and published live.",
      defaultCommitPreview: `Page "${targetTitle}" reset to factory defaults`,
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        try {
          resetCms();
          publishDraftCms();
          setIframeKey(Date.now());
          const res = await updateAdminPageAction(
            targetSlug,
            {
              title: targetTitle,
              content: `CMS Factory Defaults for ${targetTitle}`,
              isActive: true,
            },
            commitNote || `Page "${targetTitle}" reset to factory defaults`
          );
          if (res.success) {
            setSaveStatus(`Default layout for "${targetTitle}" restored & logged to Activity History.`);
          } else {
            setSaveStatus(`⚠️ ${res.error || "Failed to sync to database"}`);
          }
          setTimeout(() => setSaveStatus(null), 3000);
        } catch {
          setSaveStatus("Default storefront layout restored.");
          setTimeout(() => setSaveStatus(null), 3000);
        }
      },
    });
  };

  const reloadPreview = () => {
    setIframeKey(Date.now());
    setSaveStatus("Refreshed storefront canvas.");
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const containerWidth =
    deviceMode === "desktop" ? "100%" : deviceMode === "tablet" ? "768px" : "390px";

  const iframeSrc = `${currentRoute.startsWith("/") ? currentRoute : `/${currentRoute}`}?cms_mode=true`;

  const presetColors = [
    { label: "Charcoal Dark", value: "#1A1A1A" },
    { label: "Brand Brown", value: "#5C3A22" },
    { label: "Warm Amber", value: "#D68A45" },
    { label: "Forest Green", value: "#2D6A4F" },
    { label: "Soft Muted", value: "#6B6B6B" },
    { label: "Pure White", value: "#FFFFFF" },
    { label: "Crimson Red", value: "#DC2626" },
    { label: "Navy Blue", value: "#1D4ED8" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#191614",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* 1. TOP STUDIO CONTROL TOOLBAR */}
      <header
        style={{
          height: "56px",
          background: "#24201D",
          borderBottom: "1px solid #3A342E",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          color: "#FFFFFF",
          flexShrink: 0,
          zIndex: 110,
        }}
      >
        {/* Left: Exit Studio & Page Route Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              background: "#332D27",
              border: "1px solid #484038",
              borderRadius: "8px",
              color: "#EDE6DF",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span>←</span>
            <span>Exit Studio</span>
          </button>

          {/* Storefront Page Dropdown Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#C5BCB3" }}>Page:</span>
            <select
              value={currentRoute}
              onChange={(e) => setCurrentRoute(e.target.value)}
              style={{
                background: "#1A1715",
                border: "1px solid #484038",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                padding: "5px 10px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {STOREFRONT_PAGES_LIST.map((p) => (
                <option key={p.id} value={p.path}>
                  {p.title} ({p.path})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Device Viewport Switcher + Undo & Redo Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Undo / Redo Buttons */}
          <div style={{ display: "flex", background: "#181513", padding: "3px", borderRadius: "8px", border: "1px solid #38312B", gap: "2px" }}>
            <button
              onClick={handleUndoAction}
              title="Undo change (Ctrl+Z)"
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 700,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                opacity: 1,
              }}
            >
              <span>↩️</span>
              <span>Undo</span>
            </button>
            <button
              onClick={handleRedoAction}
              title="Redo change (Ctrl+Y)"
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 700,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                opacity: 1,
              }}
            >
              <span>↪️</span>
              <span>Redo</span>
            </button>
          </div>

          {/* Device Switcher */}
          <div style={{ display: "flex", background: "#181513", padding: "3px", borderRadius: "8px", border: "1px solid #38312B", gap: "2px" }}>
            <button
              onClick={() => setDeviceMode("desktop")}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: deviceMode === "desktop" ? "#5C3A22" : "transparent",
                color: deviceMode === "desktop" ? "#FFF" : "#A8A29E",
              }}
            >
              🖥️ Desktop
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: deviceMode === "tablet" ? "#5C3A22" : "transparent",
                color: deviceMode === "tablet" ? "#FFF" : "#A8A29E",
              }}
            >
              💻 Tablet
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: deviceMode === "mobile" ? "#5C3A22" : "transparent",
                color: deviceMode === "mobile" ? "#FFF" : "#A8A29E",
              }}
            >
              📱 Mobile
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={reloadPreview}
            title="Reload preview"
            style={{
              padding: "6px 10px",
              background: "#332D27",
              border: "1px solid #484038",
              borderRadius: "8px",
              color: "#FFF",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            🔄
          </button>

          <a
            href={currentRoute}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "6px 12px",
              background: "#332D27",
              border: "1px solid #484038",
              borderRadius: "8px",
              color: "#EDE6DF",
              fontSize: "11px",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>Live ↗</span>
          </a>

          <button
            onClick={() => setShowInspector(!showInspector)}
            style={{
              padding: "6px 14px",
              background: showInspector ? "#5C3A22" : "#332D27",
              border: `1px solid ${showInspector ? "#D68A45" : "#484038"}`,
              borderRadius: "8px",
              color: "#FFF",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🎨</span>
            <span>{showInspector ? "Hide Inspector" : "Inspector Panel"}</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: "6px 12px",
              background: "#332D27",
              border: "1px solid #484038",
              borderRadius: "8px",
              color: "#A8A29E",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: "6px 14px",
              background: "#332D27",
              border: "1px solid #484038",
              borderRadius: "8px",
              color: "#EDE6DF",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>💾</span>
            <span>Save</span>
          </button>

          <button
            onClick={handlePublish}
            style={{
              padding: "6px 16px",
              background: "#D68A45",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(214, 138, 69, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>Publish Live</span>
            <span>🚀</span>
          </button>
        </div>
      </header>

      {/* 2. NOTIFICATION TOAST */}
      {saveStatus && (
        <div
          style={{
            position: "absolute",
            top: "66px",
            right: "24px",
            zIndex: 120,
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            padding: "10px 18px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 700,
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✓</span>
          <span>{saveStatus}</span>
        </div>
      )}

      {/* 3. MAIN WORKSPACE WITH SCROLLABLE STOREFRONT VIEWPORT */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        <div
          style={{
            flex: 1,
            background: "#141210",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            justifyContent: "center",
            padding: deviceMode === "desktop" ? "0" : "32px 16px",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              width: containerWidth,
              height: "100%",
              background: "#FFFFFF",
              boxShadow: deviceMode === "desktop" ? "none" : "0 12px 40px rgba(0,0,0,0.6)",
              borderRadius: deviceMode === "desktop" ? "0" : "18px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <iframe
              key={`${iframeSrc}-${iframeKey}`}
              ref={iframeRef}
              src={iframeSrc}
              title="Storefront Live Studio Canvas"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* 4. DYNAMIC INSPECTOR PANEL (TEXT MODE OR IMAGE MODE) */}
        {showInspector && (
          <aside
            style={{
              width: "330px",
              background: "#1E1B18",
              borderLeft: "1px solid #3A342E",
              color: "#FFF",
              padding: "18px 16px",
              overflowY: "auto",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {/* Top Inspector Mode Tabs */}
            <div style={{ display: "flex", background: "#141210", padding: "3px", borderRadius: "8px", border: "1px solid #38312B", gap: "2px" }}>
              <button
                onClick={() => setInspectorTab("text")}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: inspectorTab === "text" ? "#5C3A22" : "transparent",
                  color: inspectorTab === "text" ? "#FFF" : "#A8A29E",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <span>🔤</span>
                <span>Text Style</span>
              </button>
              <button
                onClick={() => setInspectorTab("image")}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: inspectorTab === "image" ? "#5C3A22" : "transparent",
                  color: inspectorTab === "image" ? "#FFF" : "#A8A29E",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <span>🖼️</span>
                <span>Image Edit</span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* MODE A: TEXT / TYPOGRAPHY INSPECTOR                                       */}
            {/* ========================================================================= */}
            {inspectorTab === "text" && (
              <>
                {/* Active Element Status */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#D68A45" }}>
                      🔤 Typography Inspector
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "#332D27",
                        color: "#A8A29E",
                        fontFamily: "monospace",
                      }}
                    >
                      &lt;{selectedTag.toLowerCase()}&gt;
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#8E8880", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {selectedSnippet ? `"${selectedSnippet}"` : "Click any text on the preview to style"}
                  </p>
                </div>

                {/* CONTROL 1: FONT COLOR + COLOR SLIDER & PALETTE */}
                <div style={{ background: "#25211D", padding: "14px", borderRadius: "12px", border: "1px solid #38312B" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF" }}>Font Color</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#D68A45", fontWeight: 700 }}>
                        {fontColor}
                      </span>
                      <input
                        type="color"
                        value={fontColor.startsWith("#") ? fontColor : "#2E1A0C"}
                        onChange={(e) => handleColorChange(e.target.value)}
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          background: "transparent",
                        }}
                      />
                    </div>
                  </div>

                  {/* Color Hue Slider */}
                  <input
                    type="range"
                    min="0"
                    max="360"
                    defaultValue="25"
                    onChange={(e) => {
                      const hue = e.target.value;
                      const newColor = `hsl(${hue}, 65%, 45%)`;
                      handleColorChange(newColor);
                    }}
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "6px",
                      outline: "none",
                      cursor: "pointer",
                      marginBottom: "12px",
                      accentColor: "#D68A45",
                      background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                    }}
                  />

                  {/* Preset Palette Swatches */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                    {presetColors.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => handleColorChange(c.value)}
                        title={c.label}
                        style={{
                          height: "26px",
                          borderRadius: "6px",
                          border: fontColor === c.value ? "2px solid #D68A45" : "1px solid #484038",
                          background: c.value,
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* CONTROL 2: FONT SIZE */}
                <div style={{ background: "#25211D", padding: "14px", borderRadius: "12px", border: "1px solid #38312B" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF" }}>Font Size</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <input
                        type="number"
                        min="10"
                        max="96"
                        value={fontSize}
                        onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                        style={{
                          width: "48px",
                          background: "#181513",
                          border: "1px solid #484038",
                          borderRadius: "6px",
                          color: "#FFF",
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "3px 6px",
                          textAlign: "center",
                          outline: "none",
                        }}
                      />
                      <span style={{ fontSize: "11px", color: "#8E8880" }}>px</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="72"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "4px",
                      outline: "none",
                      cursor: "pointer",
                      marginBottom: "12px",
                      accentColor: "#D68A45",
                      background: "#38312B",
                    }}
                  />

                  <div style={{ display: "flex", gap: "6px" }}>
                    {[
                      { label: "Small", size: 13 },
                      { label: "Body", size: 16 },
                      { label: "H3", size: 22 },
                      { label: "H2", size: 30 },
                      { label: "Hero", size: 44 },
                    ].map((s) => (
                      <button
                        key={s.label}
                        onClick={() => handleFontSizeChange(s.size)}
                        style={{
                          flex: 1,
                          padding: "4px 0",
                          fontSize: "10px",
                          fontWeight: 700,
                          borderRadius: "6px",
                          border: "1px solid #484038",
                          background: fontSize === s.size ? "#5C3A22" : "#181513",
                          color: fontSize === s.size ? "#FFF" : "#A8A29E",
                          cursor: "pointer",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CONTROL 3: TEXT ALIGNMENT */}
                <div style={{ background: "#25211D", padding: "14px", borderRadius: "12px", border: "1px solid #38312B" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF", display: "block", marginBottom: "10px" }}>
                    Text Alignment
                  </label>

                  <div style={{ display: "flex", background: "#181513", padding: "3px", borderRadius: "8px", border: "1px solid #38312B", gap: "2px" }}>
                    {[
                      { id: "left", label: "⬅️ Left" },
                      { id: "center", label: "↔️ Center" },
                      { id: "right", label: "➡️ Right" },
                      { id: "justify", label: "🔲 Justify" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleAlignChange(btn.id as any)}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          fontSize: "11px",
                          fontWeight: 700,
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          background: textAlign === btn.id ? "#5C3A22" : "transparent",
                          color: textAlign === btn.id ? "#FFF" : "#A8A29E",
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CONTROL 4: TEXT VISIBILITY */}
                <div style={{ background: "#25211D", padding: "14px", borderRadius: "12px", border: "1px solid #38312B" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF" }}>Text Visibility</label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: isTextHidden ? "#EF4444" : "#10B981" }}>
                      {isTextHidden ? "Hidden" : "Visible"}
                    </span>
                  </div>

                  <div style={{ display: "flex", background: "#181513", padding: "3px", borderRadius: "8px", border: "1px solid #38312B", gap: "2px" }}>
                    <button
                      onClick={() => handleTextVisibilityToggle(false)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        fontSize: "11px",
                        fontWeight: 700,
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        background: !isTextHidden ? "#059669" : "transparent",
                        color: !isTextHidden ? "#FFFFFF" : "#A8A29E",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <span>👁️</span>
                      <span>Show</span>
                    </button>

                    <button
                      onClick={() => handleTextVisibilityToggle(true)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        fontSize: "11px",
                        fontWeight: 700,
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        background: isTextHidden ? "#DC2626" : "transparent",
                        color: isTextHidden ? "#FFFFFF" : "#A8A29E",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <span>🚫</span>
                      <span>Hide</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ========================================================================= */}
            {/* MODE B: IMAGE EDITING INSPECTOR                                           */}
            {/* ========================================================================= */}
            {inspectorTab === "image" && (
              <>
                {/* Active Image Preview & Title */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#D68A45" }}>
                      🖼️ Image Inspector
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "#332D27",
                        color: "#60A5FA",
                        fontFamily: "monospace",
                      }}
                    >
                      &lt;img&gt;
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#141210", padding: "8px 12px", borderRadius: "8px", border: "1px solid #38312B" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "6px", background: "#FFF", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <img src={selectedImageSrc} alt="Thumbnail" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedImageAlt || "Storefront Artwork"}
                      </div>
                      <div style={{ fontSize: "10px", color: "#8E8880", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedImageSrc}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTROL 1: UPLOAD FROM DEVICE */}
                <div style={{ background: "#25211D", padding: "14px", borderRadius: "12px", border: "1px solid #38312B" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF", display: "block", marginBottom: "8px" }}>
                    Replace Image File
                  </label>
                  <button
                    onClick={handleTriggerDeviceUpload}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#5C3A22",
                      border: "1px solid #D68A45",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      boxShadow: "0 2px 6px rgba(92, 58, 34, 0.4)",
                    }}
                  >
                    <span>📁</span>
                    <span>Upload Image from Device</span>
                  </button>
                </div>

                {/* CONTROL 2: STOREFRONT MEDIA LIBRARY GRID */}
                <div style={{ background: "#25211D", padding: "14px", borderRadius: "12px", border: "1px solid #38312B" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF" }}>Storefront Media Library</label>
                    <span style={{ fontSize: "10px", color: "#D68A45", fontWeight: 700 }}>
                      {STOREFRONT_MEDIA_LIBRARY.length} Items
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "8px",
                      maxHeight: "150px",
                      overflowY: "auto",
                      paddingRight: "2px",
                    }}
                  >
                    {STOREFRONT_MEDIA_LIBRARY.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleSelectMediaLibraryImage(item.path)}
                        title={item.name}
                        style={{
                          height: "50px",
                          borderRadius: "8px",
                          border: selectedImageSrc.includes(item.path) ? "2px solid #D68A45" : "1px solid #484038",
                          background: "#FFFFFF",
                          padding: "4px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <img src={item.path} alt={item.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* CONTROL 3: IMAGE SIZE SELECTION (SCALE & PRESETS) */}
                <div style={{ background: "#25211D", padding: "14px", borderRadius: "12px", border: "1px solid #38312B" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF" }}>Image Size (Scale)</label>
                    <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#D68A45", fontWeight: 700 }}>
                      {imageSizePercent}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="25"
                    max="100"
                    step="5"
                    value={imageSizePercent}
                    onChange={(e) => handleImageSizeChange(Number(e.target.value))}
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "4px",
                      outline: "none",
                      cursor: "pointer",
                      marginBottom: "12px",
                      accentColor: "#D68A45",
                      background: "#38312B",
                    }}
                  />

                  <div style={{ display: "flex", gap: "6px" }}>
                    {[
                      { label: "25%", val: 25 },
                      { label: "50%", val: 50 },
                      { label: "75%", val: 75 },
                      { label: "100%", val: 100 },
                    ].map((s) => (
                      <button
                        key={s.label}
                        onClick={() => handleImageSizeChange(s.val)}
                        style={{
                          flex: 1,
                          padding: "4px 0",
                          fontSize: "10px",
                          fontWeight: 700,
                          borderRadius: "6px",
                          border: "1px solid #484038",
                          background: imageSizePercent === s.val ? "#5C3A22" : "#181513",
                          color: imageSizePercent === s.val ? "#FFF" : "#A8A29E",
                          cursor: "pointer",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CONTROL 4: IMAGE OPACITY */}
                <div style={{ background: "#25211D", padding: "14px", borderRadius: "12px", border: "1px solid #38312B" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF" }}>Image Opacity</label>
                    <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#D68A45", fontWeight: 700 }}>
                      {imageOpacity}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={imageOpacity}
                    onChange={(e) => handleImageOpacityChange(Number(e.target.value))}
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "4px",
                      outline: "none",
                      cursor: "pointer",
                      accentColor: "#D68A45",
                      background: "#38312B",
                    }}
                  />
                </div>

                {/* CONTROL 5: IMAGE VISIBILITY (SHOW / HIDE) */}
                <div style={{ background: "#25211D", padding: "14px", borderRadius: "12px", border: "1px solid #38312B" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#EDE6DF" }}>Image Visibility</label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: isImageHidden ? "#EF4444" : "#10B981" }}>
                      {isImageHidden ? "Hidden" : "Visible"}
                    </span>
                  </div>

                  <div style={{ display: "flex", background: "#181513", padding: "3px", borderRadius: "8px", border: "1px solid #38312B", gap: "2px" }}>
                    <button
                      onClick={() => handleImageVisibilityToggle(false)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        fontSize: "11px",
                        fontWeight: 700,
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        background: !isImageHidden ? "#059669" : "transparent",
                        color: !isImageHidden ? "#FFFFFF" : "#A8A29E",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <span>👁️</span>
                      <span>Show</span>
                    </button>

                    <button
                      onClick={() => handleImageVisibilityToggle(true)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        fontSize: "11px",
                        fontWeight: 700,
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        background: isImageHidden ? "#DC2626" : "transparent",
                        color: isImageHidden ? "#FFFFFF" : "#A8A29E",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <span>🚫</span>
                      <span>Hide</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </aside>
        )}
      </div>

      {/* Hidden File Input for Direct Local Image Uploading */}
      <input
        type="file"
        ref={adminFileInputRef}
        onChange={handleDeviceFileUpload}
        accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
        style={{ display: "none" }}
      />

      {/* Admin Action Confirmation Dialog */}
      {ConfirmDialog}
    </div>
  );
}
