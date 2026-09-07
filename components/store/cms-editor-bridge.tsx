"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLiveCms } from "@/lib/cms-data";

type DomAction =
  | { type: "TEXT"; element: HTMLElement; prev: string; next: string }
  | { type: "STYLE"; element: HTMLElement; prop: string; prev: string; next: string }
  | { type: "IMAGE_SRC"; element: HTMLImageElement; prev: string; next: string };

export function CmsEditorBridge() {
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { updateCms, undo, redo } = useLiveCms();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeImageRef = useRef<HTMLImageElement | null>(null);
  const selectedElementRef = useRef<HTMLElement | null>(null);
  const undoStackRef = useRef<DomAction[]>([]);
  const redoStackRef = useRef<DomAction[]>([]);

  useEffect(() => {
    // Check if loaded in CMS edit mode either via query param or inside iframe
    const inIframe = typeof window !== "undefined" && window.self !== window.top;
    const hasCmsParam = searchParams.get("cms_mode") === "true";
    if (inIframe || hasCmsParam) {
      setIsEditMode(true);
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeImageRef.current) {
      const reader = new FileReader();
      const currentImg = activeImageRef.current;
      const prevSrc = currentImg.src;
      reader.onload = (event) => {
        if (event.target?.result && currentImg) {
          const newSrc = event.target.result as string;
          undoStackRef.current.push({ type: "IMAGE_SRC", element: currentImg, prev: prevSrc, next: newSrc });
          redoStackRef.current = [];
          currentImg.src = newSrc;
          showToast("📷 Image updated successfully from file upload!");
          window.parent?.postMessage(
            { type: "CMS_IMAGE_CHANGED", src: event.target.result },
            "*"
          );
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper to remove selected highlight from all images
  const clearAllSelectedImages = () => {
    document.querySelectorAll(".cms-selected-image").forEach((el) => {
      el.classList.remove("cms-selected-image");
    });
  };

  // Listen for styling and image instructions from the Admin Inspector
  useEffect(() => {
    if (!isEditMode) return;

    const handleParentMessage = (event: MessageEvent) => {
      if (!event.data) return;

      // 1. TEXT STYLES FROM INSPECTOR
      if (event.data.type === "APPLY_INSPECTOR_STYLE") {
        const { color, fontSize, textAlign, isHidden } = event.data.styles || {};
        const el = selectedElementRef.current;
        if (el) {
          if (color !== undefined) {
            undoStackRef.current.push({ type: "STYLE", element: el, prop: "color", prev: el.style.color || "", next: color });
            el.style.color = color;
          }
          if (fontSize !== undefined) {
            undoStackRef.current.push({ type: "STYLE", element: el, prop: "fontSize", prev: el.style.fontSize || "", next: `${fontSize}px` });
            el.style.fontSize = `${fontSize}px`;
          }
          if (textAlign !== undefined) {
            undoStackRef.current.push({ type: "STYLE", element: el, prop: "textAlign", prev: el.style.textAlign || "", next: textAlign });
            el.style.textAlign = textAlign;
          }
          if (isHidden !== undefined) {
            undoStackRef.current.push({ type: "STYLE", element: el, prop: "visibility", prev: el.style.visibility || "", next: isHidden ? "hidden" : "visible" });
            el.style.visibility = isHidden ? "hidden" : "visible";
            if (isHidden) {
              el.dataset.cmsHidden = "true";
            } else {
              delete el.dataset.cmsHidden;
            }
          }
          redoStackRef.current = [];
        }
      }

      // 2. IMAGE STYLES & SWAP FROM IMAGE INSPECTOR
      else if (event.data.type === "APPLY_IMAGE_STYLE") {
        const { src, sizePercent, opacity, isHidden, triggerUpload } = event.data || {};
        const img = activeImageRef.current;
        if (triggerUpload) {
          fileInputRef.current?.click();
          return;
        }
        if (img) {
          if (src !== undefined && img.src !== src) {
            undoStackRef.current.push({ type: "IMAGE_SRC", element: img, prev: img.src, next: src });
            img.src = src;
            showToast("📷 Image swapped from storefront media library!");
          }
          if (sizePercent !== undefined) {
            undoStackRef.current.push({ type: "STYLE", element: img, prop: "maxWidth", prev: img.style.maxWidth || "", next: `${sizePercent}%` });
            img.style.maxWidth = `${sizePercent}%`;
            img.style.height = "auto";
          }
          if (opacity !== undefined) {
            undoStackRef.current.push({ type: "STYLE", element: img, prop: "opacity", prev: img.style.opacity || "", next: `${opacity}` });
            img.style.opacity = `${opacity}`;
          }
          if (isHidden !== undefined) {
            undoStackRef.current.push({ type: "STYLE", element: img, prop: "visibility", prev: img.style.visibility || "", next: isHidden ? "hidden" : "visible" });
            img.style.visibility = isHidden ? "hidden" : "visible";
            if (isHidden) {
              img.dataset.cmsHidden = "true";
            } else {
              delete img.dataset.cmsHidden;
            }
          }
          redoStackRef.current = [];
        }
      }

      // 3. TRIGGER UNDO
      else if (event.data.type === "TRIGGER_UNDO") {
        if (undoStackRef.current.length > 0) {
          const action = undoStackRef.current.pop()!;
          redoStackRef.current.push(action);
          if (action.type === "TEXT") {
            action.element.innerText = action.prev;
          } else if (action.type === "STYLE") {
            (action.element.style as any)[action.prop] = action.prev;
            if (action.prop === "visibility") {
              if (action.prev === "hidden") {
                action.element.dataset.cmsHidden = "true";
              } else {
                delete action.element.dataset.cmsHidden;
              }
            }
          } else if (action.type === "IMAGE_SRC") {
            action.element.src = action.prev;
          }
        }
        undo();
      }

      // 4. TRIGGER REDO
      else if (event.data.type === "TRIGGER_REDO") {
        if (redoStackRef.current.length > 0) {
          const action = redoStackRef.current.pop()!;
          undoStackRef.current.push(action);
          if (action.type === "TEXT") {
            action.element.innerText = action.next;
          } else if (action.type === "STYLE") {
            (action.element.style as any)[action.prop] = action.next;
            if (action.prop === "visibility") {
              if (action.next === "hidden") {
                action.element.dataset.cmsHidden = "true";
              } else {
                delete action.element.dataset.cmsHidden;
              }
            }
          } else if (action.type === "IMAGE_SRC") {
            action.element.src = action.next;
          }
        }
        redo();
      }
    };

    window.addEventListener("message", handleParentMessage);
    return () => window.removeEventListener("message", handleParentMessage);
  }, [isEditMode]);

  // Forward keyboard shortcuts from within the iframe to the Studio parent
  useEffect(() => {
    if (!isEditMode) return;
    const handleFrameKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          window.parent?.postMessage({ type: "KEYBOARD_REDO" }, "*");
        } else {
          e.preventDefault();
          window.parent?.postMessage({ type: "KEYBOARD_UNDO" }, "*");
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        window.parent?.postMessage({ type: "KEYBOARD_REDO" }, "*");
      }
    };

    window.addEventListener("keydown", handleFrameKeyDown);
    return () => window.removeEventListener("keydown", handleFrameKeyDown);
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;

    // Prevent navigation on links while in CMS edit mode
    const handleLinkClick = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Strictly separate clicks: Image Click vs Text Click
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // -------------------------------------------------------------
      // 1. STRICT IMAGE CLICK: Highlights Image & Opens Image Inspector
      // -------------------------------------------------------------
      if (target.tagName === "IMG") {
        e.preventDefault();
        e.stopPropagation();

        const img = target as HTMLImageElement;
        clearAllSelectedImages();
        img.classList.add("cms-selected-image");

        activeImageRef.current = img;
        selectedElementRef.current = img;

        const computed = window.getComputedStyle(img);
        window.parent?.postMessage(
          {
            type: "IMAGE_SELECTED",
            src: img.src,
            alt: img.alt || "Storefront Artwork",
            styles: {
              sizePercent: 100,
              opacity: parseFloat(computed.opacity) || 1,
              isHidden: img.style.visibility === "hidden" || img.dataset.cmsHidden === "true",
            },
          },
          "*"
        );
        return;
      }

      // If clicked outside an image, clear image selection highlight
      clearAllSelectedImages();

      // -------------------------------------------------------------
      // 2. BUTTON / LINK TEXT CLICK: Edit only the text
      // -------------------------------------------------------------
      const isButtonOrAnchor =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.classList.contains("btn") ||
        target.classList.contains("hero-slide-btn") ||
        target.classList.contains("nl-btn");

      if (isButtonOrAnchor) {
        e.preventDefault();
        e.stopPropagation();

        const textTarget = (target.querySelector("span:not(.ann-sep)") || target) as HTMLElement;
        selectedElementRef.current = textTarget;

        const computed = window.getComputedStyle(textTarget);
        window.parent?.postMessage(
          {
            type: "ELEMENT_SELECTED",
            tagName: target.tagName,
            textSnippet: textTarget.innerText.slice(0, 30),
            styles: {
              color: computed.color,
              fontSize: parseInt(computed.fontSize) || 16,
              textAlign: computed.textAlign || "left",
              isHidden: computed.visibility === "hidden" || textTarget.dataset.cmsHidden === "true",
            },
          },
          "*"
        );

        textTarget.contentEditable = "true";
        textTarget.dataset.cmsInitialText = textTarget.innerText.trim();
        textTarget.focus();

        const range = document.createRange();
        range.selectNodeContents(textTarget);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);

        const handleButtonBlur = () => {
          textTarget.contentEditable = "false";
          const prevText = textTarget.dataset.cmsInitialText || "";
          const newText = textTarget.innerText.trim();
          if (newText) {
            if (newText !== prevText) {
              undoStackRef.current.push({ type: "TEXT", element: textTarget, prev: prevText, next: newText });
              redoStackRef.current = [];
            }
            updateCms((prev) => {
              const updated = { ...prev };
              if (target.classList.contains("hero-slide-btn") || target.closest(".hero-slide-action")) {
                const slideNum = target.closest("[data-slide]")?.getAttribute("data-slide");
                if (slideNum === "2") {
                  updated.heroSlide2.primaryBtn = newText;
                } else if (slideNum === "3") {
                  updated.heroSlide3.primaryBtn = newText;
                } else {
                  updated.heroSlide1.primaryBtn = newText;
                }
              } else if (target.classList.contains("nl-btn") || target.closest(".nl-form")) {
                updated.newsletterSection.btnText = newText;
              } else if (target.classList.contains("btn-primary") || target.closest(".builder-section")) {
                updated.builderSection.ctaText = newText;
              }
              return updated;
            });
            window.parent?.postMessage({ type: "CMS_TEXT_CHANGED", text: newText }, "*");
          }
          textTarget.removeEventListener("blur", handleButtonBlur);
        };
        textTarget.addEventListener("blur", handleButtonBlur);
        return;
      }

      // -------------------------------------------------------------
      // 3. REGULAR TEXT ELEMENT CLICK: Switch to Text Inspector Mode
      // -------------------------------------------------------------
      const textTags = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN", "LABEL", "STRONG", "B", "I", "SMALL"];
      if (textTags.includes(target.tagName) || target.classList.contains("stamp-text")) {
        e.preventDefault();
        e.stopPropagation();

        selectedElementRef.current = target;

        const computed = window.getComputedStyle(target);
        window.parent?.postMessage(
          {
            type: "ELEMENT_SELECTED",
            tagName: target.tagName,
            textSnippet: target.innerText.slice(0, 30),
            styles: {
              color: computed.color,
              fontSize: parseInt(computed.fontSize) || 16,
              textAlign: computed.textAlign || "left",
              isHidden: computed.visibility === "hidden" || target.dataset.cmsHidden === "true",
            },
          },
          "*"
        );

        target.contentEditable = "true";
        target.dataset.cmsInitialText = target.innerText.trim();
        target.focus();

        const handleTextBlur = () => {
          target.contentEditable = "false";
          const prevText = target.dataset.cmsInitialText || "";
          const newText = target.innerText.trim();
          if (newText) {
            if (newText !== prevText) {
              undoStackRef.current.push({ type: "TEXT", element: target, prev: prevText, next: newText });
              redoStackRef.current = [];
            }
            updateCms((prev) => {
              const updated = { ...prev };
              if (target.closest(".announce-bar")) {
                updated.announcement.message1 = newText;
              } else if (target.closest(".hero-slider") || target.closest(".hero-slide-content") || target.closest(".vintage-stamp")) {
                const slideNum = target.closest("[data-slide]")?.getAttribute("data-slide");
                if (slideNum === "2") {
                  if (target.tagName === "H1" || target.classList.contains("hero-slide-title")) {
                    updated.heroSlide2.title = newText;
                  } else if (target.tagName === "P" || target.classList.contains("hero-slide-subtitle")) {
                    updated.heroSlide2.subtitle = newText;
                  } else if (target.classList.contains("stamp-text")) {
                    updated.heroSlide2.badge = newText;
                  }
                } else if (slideNum === "3") {
                  if (target.tagName === "H1" || target.classList.contains("hero-slide-title")) {
                    updated.heroSlide3.title = newText;
                  } else if (target.tagName === "P" || target.classList.contains("hero-slide-subtitle")) {
                    updated.heroSlide3.subtitle = newText;
                  } else if (target.classList.contains("stamp-text")) {
                    updated.heroSlide3.badge = newText;
                  }
                } else {
                  if (target.tagName === "H1" || target.classList.contains("hero-slide-title")) {
                    updated.heroSlide1.title = newText;
                  } else if (target.tagName === "P" || target.classList.contains("hero-slide-subtitle")) {
                    updated.heroSlide1.subtitle = newText;
                  } else if (target.classList.contains("stamp-text")) {
                    updated.heroSlide1.badge = newText;
                  }
                }
              } else if (target.closest(".category-section")) {
                if (target.tagName === "H2" || target.classList.contains("section-title")) {
                  updated.categoriesSection.title = newText;
                } else if (target.tagName === "P" && !target.classList.contains("cat-desc")) {
                  updated.categoriesSection.subtitle = newText;
                }
              } else if (target.closest(".industry-section")) {
                if (target.tagName === "H2" || target.classList.contains("section-title")) {
                  updated.industrySection.title = newText;
                } else if (target.tagName === "P") {
                  updated.industrySection.subtitle = newText;
                }
              } else if (target.closest(".packing-material-section")) {
                if (target.tagName === "H2" || target.classList.contains("pm-section-title")) {
                  updated.packingMaterialSection.title = newText;
                }
              } else if (target.closest(".builder-section")) {
                if (target.tagName === "H2") {
                  updated.builderSection.title = newText;
                } else if (target.tagName === "P") {
                  updated.builderSection.subtitle = newText;
                } else if (target.classList.contains("section-tag")) {
                  updated.builderSection.badge = newText;
                }
              } else if (target.closest(".newsletter-section")) {
                if (target.tagName === "H2") {
                  updated.newsletterSection.title = newText;
                } else if (target.tagName === "P") {
                  updated.newsletterSection.subtitle = newText;
                }
              }
              return updated;
            });
            window.parent?.postMessage({ type: "CMS_TEXT_CHANGED", text: newText }, "*");
          }
          target.removeEventListener("blur", handleTextBlur);
        };

        target.addEventListener("blur", handleTextBlur);
      }
    };

    document.addEventListener("click", handleGlobalClick, true);
    document.addEventListener("click", handleLinkClick, false);

    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
      document.removeEventListener("click", handleLinkClick, false);
    };
  }, [isEditMode, updateCms]);

  if (!isEditMode) return null;

  return (
    <>
      {/* Hidden File Input for Image Uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        style={{ display: "none" }}
      />

      {/* Floating Action Toast in Edit Mode */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 99999,
            background: "#24201D",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            border: "1px solid #D68A45",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <style>{`
        /* Visual cues for isolated text elements only */
        h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover,
        p:hover, .stamp-text:hover, .section-title:hover, .section-sub:hover,
        .pm-section-title:hover, .announce-track span:hover, .cat-name:hover, .cat-desc:hover {
          outline: 2px dashed #D68A45 !important;
          outline-offset: 2px !important;
          background: rgba(214, 138, 69, 0.08) !important;
          border-radius: 4px !important;
          cursor: text !important;
        }

        /* Visual cues for isolated buttons */
        button:hover, .hero-slide-btn:hover, .nl-btn:hover, a.btn:hover, a.btn-primary:hover {
          outline: 2px dashed #D68A45 !important;
          outline-offset: 2px !important;
          cursor: text !important;
        }

        /* Hover on unselected images */
        img:hover {
          outline: 3px dashed #3B82F6 !important;
          outline-offset: 3px !important;
          filter: brightness(0.94) !important;
          cursor: pointer !important;
        }

        /* PERSISTENT SELECTED IMAGE HIGHLIGHT */
        .cms-selected-image {
          outline: 3.5px solid #3B82F6 !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 8px 25px rgba(59, 130, 246, 0.4) !important;
          border-radius: 6px !important;
          position: relative !important;
          z-index: 50 !important;
          filter: brightness(1.02) !important;
          transition: all 0.2s ease !important;
        }

        /* Active text editing outline */
        [contenteditable="true"] {
          outline: 2.5px solid #D68A45 !important;
          outline-offset: 2px !important;
          background: rgba(214, 138, 69, 0.15) !important;
          border-radius: 4px !important;
          box-shadow: 0 0 10px rgba(214, 138, 69, 0.3) !important;
        }
      `}</style>
    </>
  );
}
