"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  twoFactorEnabled: boolean;
  status: "active" | "away" | "busy";
  lastLogin: string;
  notifications: {
    orderAlerts: boolean;
    stockAlerts: boolean;
    customerInquiries: boolean;
    emailDigest: boolean;
    soundEnabled: boolean;
  };
  storeSettings: {
    storeName: string;
    supportEmail: string;
    supportPhone: string;
    whatsappNumber: string;
    warehouseAddress: string;
    gstin: string;
    currency: string;
    freeShippingThreshold: number;
    defaultTaxRate: number;
  };
}

const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  id: "adm_usr_01",
  name: "Abinav Loki",
  email: "admin@boxcare.in",
  phone: "+91 98765 43210",
  role: "Super Administrator",
  department: "Executive & Operations",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Lead administrator responsible for BoxCare packaging catalog management, order fulfillment logistics, and custom box pricing engine.",
  location: "Mumbai HQ, Maharashtra",
  timezone: "Asia/Kolkata (IST +5:30)",
  twoFactorEnabled: true,
  status: "active",
  lastLogin: "Today at 2:15 PM (Windows / Chrome)",
  notifications: {
    orderAlerts: true,
    stockAlerts: true,
    customerInquiries: true,
    emailDigest: false,
    soundEnabled: true,
  },
  storeSettings: {
    storeName: "BoxCare Premium Packaging",
    supportEmail: "support@boxcare.in",
    supportPhone: "+91 98765 43210",
    whatsappNumber: "+91 98765 43210",
    warehouseAddress: "Plot 18, Shree Rajlaxmi Commercial Complex, Bhiwandi, Thane, MH 421302",
    gstin: "27AABCU9603R1ZM",
    currency: "INR (₹)",
    freeShippingThreshold: 5000,
    defaultTaxRate: 18,
  },
};

const STORAGE_ADMIN_KEY = "boxcare_admin_profile";

interface AdminProfileContextType {
  admin: AdminProfile;
  updateAdminProfile: (data: Partial<AdminProfile>) => Promise<boolean>;
  updateStoreSettings: (settings: Partial<AdminProfile["storeSettings"]>) => Promise<boolean>;
  updateNotifications: (notifications: Partial<AdminProfile["notifications"]>) => Promise<boolean>;
  setAdminStatus: (status: "active" | "away" | "busy") => void;
  resetToDefault: () => void;
}

const AdminProfileContext = createContext<AdminProfileContextType | undefined>(undefined);

export function AdminProfileProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile>(DEFAULT_ADMIN_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ADMIN_KEY);
      if (stored) {
        setAdmin(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading admin profile from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const persist = (updated: AdminProfile) => {
    setAdmin(updated);
    try {
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving admin profile to localStorage", e);
    }
  };

  const updateAdminProfile = async (data: Partial<AdminProfile>) => {
    const updated = { ...admin, ...data };
    persist(updated);
    return true;
  };

  const updateStoreSettings = async (settings: Partial<AdminProfile["storeSettings"]>) => {
    const updated = {
      ...admin,
      storeSettings: {
        ...admin.storeSettings,
        ...settings,
      },
    };
    persist(updated);
    return true;
  };

  const updateNotifications = async (notifications: Partial<AdminProfile["notifications"]>) => {
    const updated = {
      ...admin,
      notifications: {
        ...admin.notifications,
        ...notifications,
      },
    };
    persist(updated);
    return true;
  };

  const setAdminStatus = (status: "active" | "away" | "busy") => {
    const updated = { ...admin, status };
    persist(updated);
  };

  const resetToDefault = () => {
    persist(DEFAULT_ADMIN_PROFILE);
  };

  return (
    <AdminProfileContext.Provider
      value={{
        admin,
        updateAdminProfile,
        updateStoreSettings,
        updateNotifications,
        setAdminStatus,
        resetToDefault,
      }}
    >
      {children}
    </AdminProfileContext.Provider>
  );
}

export function useAdminProfile() {
  const context = useContext(AdminProfileContext);
  if (!context) {
    throw new Error("useAdminProfile must be used within an AdminProfileProvider");
  }
  return context;
}
