"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAdminProfile } from "@/lib/auth/admin-profile-context";
import { getAdminSettingsAction, updateAdminSettingsAction } from "@/app/actions/admin-settings";

import { useAdminConfirm } from "@/components/admin/common/admin-confirm-dialog";
import { changeAdminLoginPasswordAction, changeAdminActionPasswordAction } from "@/app/actions/admin-auth";

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const { admin, updateAdminProfile, updateStoreSettings, updateNotifications, setAdminStatus, resetToDefault } = useAdminProfile();
  const { confirmAction, ConfirmDialog } = useAdminConfirm();

  // Tab State: 'profile' | 'store' | 'security' | 'notifications'
  const [activeTab, setActiveTab] = useState<"profile" | "store" | "security" | "notifications">("profile");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "profile" || tabParam === "store" || tabParam === "security" || tabParam === "notifications") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Profile Form States
  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [phone, setPhone] = useState(admin.phone);
  const [role, setRole] = useState(admin.role);
  const [department, setDepartment] = useState(admin.department);
  const [avatarUrl, setAvatarUrl] = useState(admin.avatarUrl || "");
  const [bio, setBio] = useState(admin.bio || "");
  const [location, setLocation] = useState(admin.location || "");
  const [timezone, setTimezone] = useState(admin.timezone || "");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Store Settings Form States
  const [storeName, setStoreName] = useState(admin.storeSettings.storeName);
  const [supportEmail, setSupportEmail] = useState(admin.storeSettings.supportEmail);
  const [supportPhone, setSupportPhone] = useState(admin.storeSettings.supportPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(admin.storeSettings.whatsappNumber);
  const [warehouseAddress, setWarehouseAddress] = useState(admin.storeSettings.warehouseAddress);
  const [gstin, setGstin] = useState(admin.storeSettings.gstin);
  const [currency, setCurrency] = useState(admin.storeSettings.currency);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(admin.storeSettings.freeShippingThreshold);
  const [defaultTaxRate, setDefaultTaxRate] = useState(admin.storeSettings.defaultTaxRate);
  const [storeSuccessMsg, setStoreSuccessMsg] = useState<string | null>(null);
  const [isSavingStore, setIsSavingStore] = useState(false);

  // Load DB settings on mount
  useEffect(() => {
    async function loadDbSettings() {
      try {
        const res = await getAdminSettingsAction();
        if (res.success && res.data) {
          const s = res.data;
          if (s["store_name"]) setStoreName(s["store_name"]);
          if (s["support_email"]) setSupportEmail(s["support_email"]);
          if (s["support_phone"]) setSupportPhone(s["support_phone"]);
          if (s["whatsapp_number"]) setWhatsappNumber(s["whatsapp_number"]);
          if (s["warehouse_address"]) setWarehouseAddress(s["warehouse_address"]);
          if (s["gstin"]) setGstin(s["gstin"]);
          if (s["currency"]) setCurrency(s["currency"]);
          if (s["free_shipping_threshold"]) setFreeShippingThreshold(Number(s["free_shipping_threshold"]));
          if (s["default_tax_rate"]) setDefaultTaxRate(Number(s["default_tax_rate"]));
        }
      } catch (err) {
        console.error("Failed to load settings from DB:", err);
      }
    }
    loadDbSettings();
  }, []);

  // 1. Admin Login Password State
  const [loginCurrentPass, setLoginCurrentPass] = useState("");
  const [loginNewPass, setLoginNewPass] = useState("");
  const [loginConfirmPass, setLoginConfirmPass] = useState("");
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);
  const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);
  const [isChangingLoginPass, setIsChangingLoginPass] = useState(false);

  // 2. Admin Verification Password State
  const [actionCurrentPass, setActionCurrentPass] = useState("");
  const [actionNewPass, setActionNewPass] = useState("");
  const [actionConfirmPass, setActionConfirmPass] = useState("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);
  const [isChangingActionPass, setIsChangingActionPass] = useState(false);

  // 2FA state
  const [twoFactor, setTwoFactor] = useState(admin.twoFactorEnabled);

  // Notification States
  const [notifications, setNotifications] = useState(admin.notifications);
  const [notifSuccessMsg, setNotifSuccessMsg] = useState<string | null>(null);

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Avatar Presets
  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  ];

  // Save Profile Handler (Protected with Password Verification)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    confirmAction({
      title: "Update Admin Profile",
      message: "Are you sure you want to save changes to your administrator profile?",
      description: "This updates your admin identity, email, and contact info in the system.",
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        setIsSavingProfile(true);
        await updateAdminProfile({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: role.trim(),
          department: department.trim(),
          avatarUrl,
          bio: bio.trim(),
          location: location.trim(),
          timezone: timezone.trim(),
        });
        setIsSavingProfile(false);
        setProfileSuccessMsg("Admin profile details saved successfully!");
        setTimeout(() => setProfileSuccessMsg(null), 3500);
      },
    });
  };

  // Save Store Settings Handler (Protected with Password Verification)
  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    confirmAction({
      title: "Save Store Configuration",
      message: "Are you sure you want to update the store settings and logistics parameters?",
      description: "Changes affect shipping rates, tax calculations, and contact info in the database.",
      defaultCommitPreview: "Setting updated",
      confirmLabel: "Continue to Verify",
      onConfirm: async (commitNote?: string) => {
        setIsSavingStore(true);
        const storePayload = {
          storeName: storeName.trim(),
          supportEmail: supportEmail.trim(),
          supportPhone: supportPhone.trim(),
          whatsappNumber: whatsappNumber.trim(),
          warehouseAddress: warehouseAddress.trim(),
          gstin: gstin.trim(),
          currency,
          freeShippingThreshold: Number(freeShippingThreshold) || 0,
          defaultTaxRate: Number(defaultTaxRate) || 0,
        };

        await updateStoreSettings(storePayload);

        // Persist to PostgreSQL database
        await updateAdminSettingsAction({
          store_name: storePayload.storeName,
          support_email: storePayload.supportEmail,
          support_phone: storePayload.supportPhone,
          whatsapp_number: storePayload.whatsappNumber,
          warehouse_address: storePayload.warehouseAddress,
          gstin: storePayload.gstin,
          currency: storePayload.currency,
          free_shipping_threshold: String(storePayload.freeShippingThreshold),
          default_tax_rate: String(storePayload.defaultTaxRate),
        }, commitNote);

        setIsSavingStore(false);
        setStoreSuccessMsg("Store configuration and logistics rules updated in database!");
        setTimeout(() => setStoreSuccessMsg(null), 3500);
      },
    });
  };

  // Save Admin Login Password Handler
  const handleSaveLoginPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrorMsg(null);
    setLoginSuccessMsg(null);

    if (!loginCurrentPass) {
      setLoginErrorMsg("Please enter your current login password.");
      return;
    }
    if (!loginNewPass || loginNewPass.length < 6) {
      setLoginErrorMsg("New login password must be at least 6 characters.");
      return;
    }
    if (loginNewPass !== loginConfirmPass) {
      setLoginErrorMsg("New login passwords do not match.");
      return;
    }

    setIsChangingLoginPass(true);
    try {
      const res = await changeAdminLoginPasswordAction(loginCurrentPass.trim(), loginNewPass.trim());
      setIsChangingLoginPass(false);
      if (!res.success) {
        setLoginErrorMsg(res.error || "Failed to update login password");
        return;
      }
      setLoginCurrentPass("");
      setLoginNewPass("");
      setLoginConfirmPass("");
      setLoginSuccessMsg("✓ Admin Login Password successfully updated and hashed in database!");
      setTimeout(() => setLoginSuccessMsg(null), 4000);
    } catch (err: any) {
      setIsChangingLoginPass(false);
      setLoginErrorMsg(err.message || "Failed to update login password");
    }
  };

  // Save Admin Action Verification Password Handler
  const handleSaveActionPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionErrorMsg(null);
    setActionSuccessMsg(null);

    if (!actionCurrentPass) {
      setActionErrorMsg("Please enter your current verification password.");
      return;
    }
    if (!actionNewPass || actionNewPass.length < 6) {
      setActionErrorMsg("New verification password must be at least 6 characters.");
      return;
    }
    if (actionNewPass !== actionConfirmPass) {
      setActionErrorMsg("New verification passwords do not match.");
      return;
    }

    setIsChangingActionPass(true);
    try {
      const res = await changeAdminActionPasswordAction(actionCurrentPass.trim(), actionNewPass.trim());
      setIsChangingActionPass(false);
      if (!res.success) {
        setActionErrorMsg(res.error || "Failed to update verification password");
        return;
      }
      setActionCurrentPass("");
      setActionNewPass("");
      setActionConfirmPass("");
      setActionSuccessMsg("✓ Admin Action Verification Password successfully updated and hashed in database!");
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      setIsChangingActionPass(false);
      setActionErrorMsg(err.message || "Failed to update verification password");
    }
  };

  // Save Notifications Handler
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    confirmAction({
      title: "Save Notification Preferences",
      message: "Are you sure you want to do this?",
      description: "Save email and SMS order alert preferences to the database.",
      confirmLabel: "Continue to Verify",
      onConfirm: async () => {
        await updateNotifications(notifications);
        setNotifSuccessMsg("Admin alert triggers and notification preferences saved!");
        setTimeout(() => setNotifSuccessMsg(null), 3500);
      },
    });
  };

  return (
    <div>
      {/* Header Title Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#8E8880", marginBottom: "6px" }}>
            <Link href="/admin/dashboard" style={{ color: "#5C3A22", textDecoration: "none", fontWeight: 600 }}>
              Admin Console
            </Link>
            <span>/</span>
            <span style={{ color: "#2B2B2B", fontWeight: 700 }}>Settings & Admin Profile</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1F1A16", margin: 0, letterSpacing: "-0.02em" }}>
            Admin Settings & Profile
          </h1>
          <p style={{ fontSize: "13px", color: "#7A6E65", margin: "4px 0 0 0" }}>
            Manage administrator credentials, operational store parameters, logistics hub addresses, and system notifications.
          </p>
        </div>

        {/* Quick Reset Button */}
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset admin profile & settings to system defaults?")) {
              resetToDefault();
              setName("Abinav Loki");
              setEmail("admin@boxcare.in");
              setRole("Super Administrator");
              setDepartment("Executive & Operations");
              setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            backgroundColor: "#FAF7F2",
            border: "1px solid #E5D8C8",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#7A6E65",
            cursor: "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Tabs Navigation Bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid #E5D8C8",
          marginBottom: "28px",
          overflowX: "auto",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderRadius: "10px 10px 0 0",
            border: "none",
            backgroundColor: activeTab === "profile" ? "#FFFFFF" : "transparent",
            color: activeTab === "profile" ? "#5C3A22" : "#7A6E65",
            fontWeight: activeTab === "profile" ? 700 : 600,
            fontSize: "13px",
            cursor: "pointer",
            borderBottom: activeTab === "profile" ? "3px solid #5C3A22" : "3px solid transparent",
            transition: "all 0.15s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Admin Profile Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("store")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderRadius: "10px 10px 0 0",
            border: "none",
            backgroundColor: activeTab === "store" ? "#FFFFFF" : "transparent",
            color: activeTab === "store" ? "#5C3A22" : "#7A6E65",
            fontWeight: activeTab === "store" ? 700 : 600,
            fontSize: "13px",
            cursor: "pointer",
            borderBottom: activeTab === "store" ? "3px solid #5C3A22" : "3px solid transparent",
            transition: "all 0.15s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>Store & Business Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderRadius: "10px 10px 0 0",
            border: "none",
            backgroundColor: activeTab === "security" ? "#FFFFFF" : "transparent",
            color: activeTab === "security" ? "#5C3A22" : "#7A6E65",
            fontWeight: activeTab === "security" ? 700 : 600,
            fontSize: "13px",
            cursor: "pointer",
            borderBottom: activeTab === "security" ? "3px solid #5C3A22" : "3px solid transparent",
            transition: "all 0.15s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Security & Sessions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderRadius: "10px 10px 0 0",
            border: "none",
            backgroundColor: activeTab === "notifications" ? "#FFFFFF" : "transparent",
            color: activeTab === "notifications" ? "#5C3A22" : "#7A6E65",
            fontWeight: activeTab === "notifications" ? 700 : 600,
            fontSize: "13px",
            cursor: "pointer",
            borderBottom: activeTab === "notifications" ? "3px solid #5C3A22" : "3px solid transparent",
            transition: "all 0.15s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span>Alerts & Notifications</span>
        </button>
      </div>

      {/* TAB 1: ADMIN PROFILE DETAILS */}
      {activeTab === "profile" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {/* Main Edit Form */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #EDE3D4",
              padding: "32px",
              boxShadow: "0 2px 10px rgba(43,43,43,0.03)",
            }}
          >
            <div style={{ borderBottom: "1px solid #F0E6DA", paddingBottom: "16px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1F1A16", margin: "0 0 4px 0" }}>
                Administrator Identity & Credentials
              </h2>
              <p style={{ fontSize: "13px", color: "#8C7E72", margin: 0 }}>
                This identity is associated with catalog updates, order fulfillment approvals, and GST invoice signatures.
              </p>
            </div>

            {profileSuccessMsg && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#ECFDF5",
                  color: "#065F46",
                  border: "1px solid #A7F3D0",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Photo & Avatar Customization */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "10px" }}>
                  Profile Photograph / Display Avatar
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid #5C3A22",
                      backgroundColor: "#FAF7F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Admin Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "20px", fontWeight: 700, color: "#5C3A22" }}>
                        {name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Preset Selector */}
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          padding: 0,
                          border: avatarUrl === preset ? "2px solid #5C3A22" : "1px solid #EAE0D5",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        <img src={preset} alt="preset" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </button>
                    ))}
                    <label
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#FAF7F2",
                        border: "1px dashed #D68A45",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#5C3A22",
                        cursor: "pointer",
                      }}
                    >
                      Upload File
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Grid: Name, Email, Phone, Role */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                    Full Name <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                    Official Email <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                    Primary Location / Hub
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Bio / Operational Scope */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                  Operational Bio & Notes
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box", resize: "vertical" }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: isSavingProfile ? "#8C7E72" : "#5C3A22",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: isSavingProfile ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 8px rgba(92, 58, 34, 0.2)",
                  }}
                >
                  {isSavingProfile ? "Saving Profile..." : "Save Admin Profile Details"}
                </button>
              </div>
            </form>
          </div>

          {/* Admin Identity Card Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                backgroundColor: "#1E1B18",
                borderRadius: "16px",
                padding: "28px",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                border: "1px solid #2F2A25",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#5C3A22",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #D68A45",
                  }}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "18px", fontWeight: 700 }}>{name.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>{name}</div>
                  <div style={{ fontSize: "12px", color: "#D68A45", fontWeight: 600 }}>{role}</div>
                  <div style={{ fontSize: "11px", color: "#8E8880" }}>{department}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", borderTop: "1px solid #2F2A25", paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#C8C2BA" }}>
                  <span>Admin ID:</span>
                  <strong style={{ color: "#FFF" }}>{admin.id}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#C8C2BA" }}>
                  <span>Security Access:</span>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>Full Root Permissions</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#C8C2BA" }}>
                  <span>Two-Factor Auth:</span>
                  <span style={{ color: admin.twoFactorEnabled ? "#10B981" : "#F59E0B", fontWeight: 700 }}>
                    {admin.twoFactorEnabled ? "Active & Enforced" : "Disabled"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#C8C2BA" }}>
                  <span>Session IP:</span>
                  <span style={{ color: "#FFF" }}>127.0.0.1 (Local Dev)</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation to Storefront */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #EDE3D4",
                padding: "20px",
              }}
            >
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1F1A16", margin: "0 0 10px 0" }}>
                Storefront Quick Switch
              </h4>
              <p style={{ fontSize: "12px", color: "#7A6E65", margin: "0 0 14px 0" }}>
                Preview live customer storefront layout and test cart & checkout interactions in real time.
              </p>
              <Link
                href="/"
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px",
                  backgroundColor: "#FAF7F2",
                  border: "1.5px solid #D68A45",
                  borderRadius: "8px",
                  color: "#5C3A22",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <span>Launch Storefront Preview</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STORE & BUSINESS RULES */}
      {activeTab === "store" && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EDE3D4",
            padding: "32px",
            maxWidth: "880px",
            boxShadow: "0 2px 10px rgba(43,43,43,0.03)",
          }}
        >
          <div style={{ borderBottom: "1px solid #F0E6DA", paddingBottom: "16px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1F1A16", margin: "0 0 4px 0" }}>
              Store Operations & Business Configuration
            </h2>
            <p style={{ fontSize: "13px", color: "#8C7E72", margin: 0 }}>
              Set customer support contact info, warehouse dispatch addresses, GST tax rates, and free delivery thresholds.
            </p>
          </div>

          {storeSuccessMsg && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "#ECFDF5",
                color: "#065F46",
                border: "1px solid #A7F3D0",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{storeSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveStore} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                  Store Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                  Support Email Address
                </label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                  Customer Support Helpline
                </label>
                <input
                  type="tel"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                  WhatsApp Business Contact
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                  Registered GSTIN
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                  Free Shipping Minimum (₹)
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                Primary Warehouse & Dispatch Hub Address
              </label>
              <textarea
                rows={2}
                value={warehouseAddress}
                onChange={(e) => setWarehouseAddress(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={isSavingStore}
                style={{
                  padding: "12px 24px",
                  backgroundColor: isSavingStore ? "#8C7E72" : "#5C3A22",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: isSavingStore ? "not-allowed" : "pointer",
                }}
              >
                {isSavingStore ? "Updating Store Rules..." : "Save Store Configuration"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SECURITY & SESSIONS */}
      {activeTab === "security" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {/* 1. Change Admin Login Password Form */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #EDE3D4",
              padding: "28px",
              boxShadow: "0 2px 8px rgba(43,43,43,0.03)",
            }}
          >
            <div style={{ borderBottom: "1px solid #F0E6DA", paddingBottom: "14px", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "16px" }}>🔑</span>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1F1A16", margin: 0 }}>
                  Change Admin Login Password
                </h2>
              </div>
              <p style={{ fontSize: "12px", color: "#8C7E72", margin: 0 }}>
                Used to authenticate at <code>/admin/login</code> to enter the BoxCare Console.
              </p>
            </div>

            {loginSuccessMsg && (
              <div style={{ marginBottom: "16px", padding: "10px 14px", backgroundColor: "#ECFDF5", color: "#065F46", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
                {loginSuccessMsg}
              </div>
            )}
            {loginErrorMsg && (
              <div style={{ marginBottom: "16px", padding: "10px 14px", backgroundColor: "#FEF2F2", color: "#991B1B", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
                ⚠️ {loginErrorMsg}
              </div>
            )}

            <form onSubmit={handleSaveLoginPassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                  Current Login Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current login password"
                  value={loginCurrentPass}
                  onChange={(e) => setLoginCurrentPass(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                  New Login Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Enter new strong password"
                  value={loginNewPass}
                  onChange={(e) => setLoginNewPass(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                  Confirm New Login Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter new login password"
                  value={loginConfirmPass}
                  onChange={(e) => setLoginConfirmPass(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                <button
                  type="submit"
                  disabled={isChangingLoginPass}
                  style={{
                    padding: "9px 18px",
                    backgroundColor: isChangingLoginPass ? "#8C7E72" : "#5C3A22",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: isChangingLoginPass ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 6px rgba(92,58,34,0.2)",
                  }}
                >
                  {isChangingLoginPass ? "Updating..." : "Update Login Password"}
                </button>
              </div>
            </form>
          </div>

          {/* 2. Change Admin Action Verification Password Form */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #EDE3D4",
              padding: "28px",
              boxShadow: "0 2px 8px rgba(43,43,43,0.03)",
            }}
          >
            <div style={{ borderBottom: "1px solid #F0E6DA", paddingBottom: "14px", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "16px" }}>🔒</span>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1F1A16", margin: 0 }}>
                  Change Action Verification Password
                </h2>
              </div>
              <p style={{ fontSize: "12px", color: "#8C7E72", margin: 0 }}>
                Used to authorize database changes (Add, Edit, Delete, Hide/Show, Status).
              </p>
            </div>

            {actionSuccessMsg && (
              <div style={{ marginBottom: "16px", padding: "10px 14px", backgroundColor: "#ECFDF5", color: "#065F46", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
                {actionSuccessMsg}
              </div>
            )}
            {actionErrorMsg && (
              <div style={{ marginBottom: "16px", padding: "10px 14px", backgroundColor: "#FEF2F2", color: "#991B1B", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
                ⚠️ {actionErrorMsg}
              </div>
            )}

            <form onSubmit={handleSaveActionPassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                  Current Verification Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current verification password"
                  value={actionCurrentPass}
                  onChange={(e) => setActionCurrentPass(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                  New Verification Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Enter new strong verification password"
                  value={actionNewPass}
                  onChange={(e) => setActionNewPass(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                  Confirm New Verification Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter new verification password"
                  value={actionConfirmPass}
                  onChange={(e) => setActionConfirmPass(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                <button
                  type="submit"
                  disabled={isChangingActionPass}
                  style={{
                    padding: "9px 18px",
                    backgroundColor: isChangingActionPass ? "#8C7E72" : "#D68A45",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: isChangingActionPass ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 6px rgba(214,138,69,0.25)",
                  }}
                >
                  {isChangingActionPass ? "Updating..." : "Update Verification Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Component */}
      {ConfirmDialog}

      {/* TAB 4: ALERTS & NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EDE3D4",
            padding: "32px",
            maxWidth: "760px",
          }}
        >
          <div style={{ borderBottom: "1px solid #F0E6DA", paddingBottom: "16px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1F1A16", margin: "0 0 4px 0" }}>
              Admin Notifications & Audio Triggers
            </h2>
            <p style={{ fontSize: "13px", color: "#8C7E72", margin: 0 }}>
              Configure when the admin console chimes and sends email dispatch reports.
            </p>
          </div>

          {notifSuccessMsg && (
            <div style={{ marginBottom: "16px", padding: "10px 14px", backgroundColor: "#ECFDF5", color: "#065F46", borderRadius: "8px", fontSize: "13px" }}>
              {notifSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveNotifications} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { key: "orderAlerts", title: "New Customer Order Placed", desc: "Show immediate browser popup when a store order is confirmed." },
              { key: "stockAlerts", title: "Low Flute Paper & Corrugated Stock Warning", desc: "Notify when raw box stock drops below 50 units." },
              { key: "customerInquiries", title: "Custom Box 3D Inquiries & RFQs", desc: "Notify when a B2B trade customer requests an unlisted box dieline quote." },
              { key: "emailDigest", title: "Daily Executive Financial Digest", desc: "Send summary of daily sales and order dispatches at 8:00 PM." },
              { key: "soundEnabled", title: "Console Sound Effects & Chimes", desc: "Play subtle audio notification upon receiving high-value orders." },
            ].map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  backgroundColor: "#FAF7F2",
                  border: "1px solid #EAE0D5",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F1A16" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#7A6E65", marginTop: "2px" }}>{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                  style={{ width: "18px", height: "18px", accentColor: "#5C3A22", cursor: "pointer" }}
                />
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#5C3A22",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save Notification Preferences
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#5C3A22", fontWeight: 600 }}>Loading Admin Settings...</div>
        </div>
      }
    >
      <AdminSettingsContent />
    </Suspense>
  );
}
