"use client";

import { useState, useEffect } from "react";

export interface CmsStoreData {
  announcement: {
    message1: string;
    message2: string;
    message3: string;
    message4: string;
  };
  heroSlide1: {
    badge: string;
    title: string;
    subtitle: string;
    primaryBtn: string;
    secondaryBtn: string;
  };
  heroSlide2: {
    badge: string;
    title: string;
    subtitle: string;
    primaryBtn: string;
    secondaryBtn: string;
  };
  heroSlide3: {
    badge: string;
    title: string;
    subtitle: string;
    primaryBtn: string;
    secondaryBtn: string;
  };
  categoriesSection: {
    title: string;
    subtitle: string;
  };
  industrySection: {
    title: string;
    subtitle: string;
  };
  packingMaterialSection: {
    title: string;
    subtitle: string;
  };
  builderSection: {
    title: string;
    subtitle: string;
    badge: string;
    ctaText: string;
  };
  newsletterSection: {
    title: string;
    subtitle: string;
    btnText: string;
  };
  imageOverrides?: Record<string, string>;
  imageStyles?: Record<string, { sizePercent?: number; opacity?: number; isHidden?: boolean }>;
  elementStyles?: Record<string, { color?: string; fontSize?: number; textAlign?: string; isHidden?: boolean }>;
}

export const DEFAULT_CMS_DATA: CmsStoreData = {
  imageOverrides: {},
  imageStyles: {},
  elementStyles: {},
  announcement: {
    message1: "🎉 Get 10% off your first bulk order — Use code BOXCARE10",
    message2: "🚚 Free shipping on orders above ₹2,000",
    message3: "♻️ 100% Eco-friendly packaging materials",
    message4: "📦 MOQ as low as 50 boxes",
  },
  heroSlide1: {
    badge: "Custom Packaging",
    title: "Your Brand Deserves Better Packaging.",
    subtitle: "Create custom boxes that protect your products and leave a lasting impression.",
    primaryBtn: "Shop Custom Boxes",
    secondaryBtn: "Calculate Dimensions",
  },
  heroSlide2: {
    badge: "Eco-Friendly Packaging",
    title: "Sustainable Packaging for a Greener Future.",
    subtitle: "Choose eco-friendly packaging solutions without compromising on quality or style.",
    primaryBtn: "Explore Eco Collection",
    secondaryBtn: "Calculate Dimensions",
  },
  heroSlide3: {
    badge: "Bulk Order Benefits",
    title: "Packaging That Grows With Your Business.",
    subtitle: "From startups to large-scale brands, we deliver reliable packaging at competitive prices.",
    primaryBtn: "Get A Free Quote",
    secondaryBtn: "Custom 3D Configurator",
  },
  categoriesSection: {
    title: "Our Products",
    subtitle: "High-quality packaging solutions for every need",
  },
  industrySection: {
    title: "Shop by Industry",
    subtitle: "Find the perfect packaging tailored to your product category",
  },
  packingMaterialSection: {
    title: "All Type Packing Material",
    subtitle: "One-stop destination for corrugated boxes, tapes, rolls, and shipping essentials",
  },
  builderSection: {
    badge: "3D LIVE BUILDER",
    title: "Custom Box 3D Configurator",
    subtitle: "Enter exact custom dimensions, choose 3-ply or 5-ply kraft board, view in 3D, and calculate instant volume tier pricing.",
    ctaText: "Launch 3D Box Builder",
  },
  newsletterSection: {
    title: "Stay Updated with Box Care",
    subtitle: "Subscribe for factory wholesale discounts, new size releases, and packaging guides.",
    btnText: "Subscribe",
  },
};

const PUBLISHED_STORAGE_KEY = "boxcare_live_cms_data_v3";
const DRAFT_STORAGE_KEY = "boxcare_draft_cms_data_v3";
const DRAFT_HISTORY_KEY = "boxcare_draft_cms_history_v3";
const DRAFT_HISTORY_INDEX_KEY = "boxcare_draft_cms_hist_idx_v3";

export function isCmsDraftMode(): boolean {
  if (typeof window === "undefined") return false;
  const inIframe = window.self !== window.top;
  const hasCmsParam = window.location.search.includes("cms_mode=true") || window.location.pathname.startsWith("/admin/pages");
  return inIframe || hasCmsParam;
}

export function getStoredCmsData(isDraft?: boolean): CmsStoreData {
  if (typeof window === "undefined") return DEFAULT_CMS_DATA;
  const targetDraft = isDraft !== undefined ? isDraft : isCmsDraftMode();
  try {
    if (targetDraft) {
      const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (rawDraft) return { ...DEFAULT_CMS_DATA, ...JSON.parse(rawDraft) };
      // If draft not yet initialized, fall back to published
      const rawPub = localStorage.getItem(PUBLISHED_STORAGE_KEY);
      if (rawPub) return { ...DEFAULT_CMS_DATA, ...JSON.parse(rawPub) };
    } else {
      const rawPub = localStorage.getItem(PUBLISHED_STORAGE_KEY);
      if (rawPub) return { ...DEFAULT_CMS_DATA, ...JSON.parse(rawPub) };
    }
  } catch (e) {
    console.error("Error reading CMS data from localStorage", e);
  }
  return DEFAULT_CMS_DATA;
}

export function saveStoredCmsData(data: CmsStoreData, isDraft?: boolean) {
  if (typeof window === "undefined") return;
  const targetDraft = isDraft !== undefined ? isDraft : isCmsDraftMode();
  try {
    if (targetDraft) {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event("boxcare_cms_draft_updated"));
    } else {
      localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event("boxcare_cms_published"));
    }
  } catch (e) {
    console.error("Error saving CMS data to localStorage", e);
  }
}

export function publishDraftCms() {
  if (typeof window === "undefined") return;
  try {
    const draftData = getStoredCmsData(true);
    localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(draftData));
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
    window.dispatchEvent(new Event("boxcare_cms_published"));
    window.dispatchEvent(new Event("boxcare_cms_draft_updated"));
  } catch (e) {
    console.error("Error publishing CMS data", e);
  }
}

export function getStoredHistory(): { history: CmsStoreData[]; index: number } {
  if (typeof window === "undefined") {
    return { history: [DEFAULT_CMS_DATA], index: 0 };
  }
  try {
    const rawHist = localStorage.getItem(DRAFT_HISTORY_KEY);
    const rawIdx = localStorage.getItem(DRAFT_HISTORY_INDEX_KEY);
    if (rawHist) {
      const parsed = JSON.parse(rawHist);
      const idx = rawIdx ? parseInt(rawIdx, 10) : parsed.length - 1;
      return { history: parsed, index: isNaN(idx) ? 0 : idx };
    }
  } catch (e) {
    console.error("Error reading history from localStorage", e);
  }
  const current = getStoredCmsData(true);
  return { history: [current], index: 0 };
}

export function saveStoredHistory(history: CmsStoreData[], index: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_HISTORY_KEY, JSON.stringify(history));
    localStorage.setItem(DRAFT_HISTORY_INDEX_KEY, index.toString());
  } catch (e) {
    console.error("Error saving history to localStorage", e);
  }
}

export function useLiveCms(isDraftOverride?: boolean) {
  const [cms, setCms] = useState<CmsStoreData>(DEFAULT_CMS_DATA);
  const [history, setHistory] = useState<CmsStoreData[]>([DEFAULT_CMS_DATA]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const getEffectiveIsDraft = () => {
    return isDraftOverride !== undefined ? isDraftOverride : isCmsDraftMode();
  };

  const syncStateFromStorage = () => {
    const isDraft = getEffectiveIsDraft();
    const current = getStoredCmsData(isDraft);
    if (isDraft) {
      const { history: h, index: idx } = getStoredHistory();
      setCms(current);
      setHistory(h.length > 0 ? h : [current]);
      setHistoryIndex(idx);
    } else {
      setCms(current);
    }
  };

  useEffect(() => {
    syncStateFromStorage();

    const handlePublishedUpdate = () => {
      syncStateFromStorage();
    };

    const handleDraftUpdate = () => {
      if (getEffectiveIsDraft()) {
        syncStateFromStorage();
      }
    };

    window.addEventListener("boxcare_cms_published", handlePublishedUpdate);
    window.addEventListener("boxcare_cms_draft_updated", handleDraftUpdate);
    window.addEventListener("storage", handlePublishedUpdate);
    return () => {
      window.removeEventListener("boxcare_cms_published", handlePublishedUpdate);
      window.removeEventListener("boxcare_cms_draft_updated", handleDraftUpdate);
      window.removeEventListener("storage", handlePublishedUpdate);
    };
  }, [isDraftOverride]);

  const updateCms = (updater: (prev: CmsStoreData) => CmsStoreData) => {
    const isDraft = getEffectiveIsDraft();
    const { history: currHist, index: currIdx } = getStoredHistory();
    const currentData = getStoredCmsData(isDraft);
    const next = updater(currentData);

    const sliced = currHist.slice(0, currIdx + 1);
    const newHist = [...sliced, next];
    if (newHist.length > 50) newHist.shift();
    const newIdx = newHist.length - 1;

    saveStoredCmsData(next, isDraft);
    if (isDraft) {
      saveStoredHistory(newHist, newIdx);
      setHistory(newHist);
      setHistoryIndex(newIdx);
    }

    setCms(next);
    return next;
  };

  const undo = () => {
    const isDraft = getEffectiveIsDraft();
    if (!isDraft) return false;
    const { history: currHist, index: currIdx } = getStoredHistory();
    if (currIdx > 0) {
      const prevIdx = currIdx - 1;
      const prevState = currHist[prevIdx];
      saveStoredCmsData(prevState, true);
      saveStoredHistory(currHist, prevIdx);

      setCms(prevState);
      setHistory(currHist);
      setHistoryIndex(prevIdx);
      return true;
    }
    return false;
  };

  const redo = () => {
    const isDraft = getEffectiveIsDraft();
    if (!isDraft) return false;
    const { history: currHist, index: currIdx } = getStoredHistory();
    if (currIdx < currHist.length - 1) {
      const nextIdx = currIdx + 1;
      const nextState = currHist[nextIdx];
      saveStoredCmsData(nextState, true);
      saveStoredHistory(currHist, nextIdx);

      setCms(nextState);
      setHistory(currHist);
      setHistoryIndex(nextIdx);
      return true;
    }
    return false;
  };

  const resetCms = () => {
    saveStoredCmsData(DEFAULT_CMS_DATA, true);
    saveStoredHistory([DEFAULT_CMS_DATA], 0);
    setCms(DEFAULT_CMS_DATA);
    setHistory([DEFAULT_CMS_DATA]);
    setHistoryIndex(0);
  };

  return {
    cms,
    updateCms,
    resetCms,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    historyIndex,
    historyLength: history.length,
    publishDraftCms,
  };
}
