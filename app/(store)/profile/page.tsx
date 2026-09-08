"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomerAuth, SavedAddress, CustomerOrder, OrderItem } from "@/lib/auth/customer-auth-context";
import { useCart } from "@/components/store/cart-context";
import { PRODUCTS } from "@/lib/products-data";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn, isLoading, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress, signOut, signIn } = useCustomerAuth();
  const { addToCart } = useCart();

  // Active Tab state: 'profile' | 'addresses' | 'orders'
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders">("profile");

  // Read URL query tab on mount / change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "addresses" || tabParam === "orders" || tabParam === "profile") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Profile Edit Mode state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Avatar Upload / Select Modal state
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Address Modal state (for Add & Edit)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<SavedAddress, "id">>({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    type: "Office",
    isDefault: false,
  });
  const [addressError, setAddressError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Order Details Modal / Invoice Modal state
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [orderFilter, setOrderFilter] = useState<"all" | "active" | "delivered">("all");
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState<string | null>(null);

  // Sync user fields when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setDateOfBirth(user.dateOfBirth || "");
      setCompanyName(user.companyName || "");
      setGstNumber(user.gstNumber || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  // Handle Profile Photo Upload via File Reader
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
        setShowAvatarModal(false);
        updateProfile({ avatarUrl: reader.result });
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
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  ];

  // Save Profile Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!name.trim()) {
      setProfileMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }
    if (!email.trim()) {
      setProfileMessage({ type: "error", text: "Email cannot be empty." });
      return;
    }

    setIsSavingProfile(true);
    await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth: dateOfBirth.trim(),
      companyName: companyName.trim(),
      gstNumber: gstNumber.trim(),
      avatarUrl,
    });
    setIsSavingProfile(false);
    setIsEditingProfile(false);
    setProfileMessage({ type: "success", text: "Profile details updated successfully!" });
    setTimeout(() => setProfileMessage(null), 4000);
  };

  // Open Add Address Modal
  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      name: user?.name || "",
      phone: user?.phone || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      type: "Office",
      isDefault: (user?.addresses.length || 0) === 0,
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  // Open Edit Address Modal
  const openEditAddressModal = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      name: addr.name,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      type: addr.type,
      isDefault: addr.isDefault,
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  // Save Address (Create or Update)
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);

    if (!addressForm.name.trim() || !addressForm.phone.trim() || !addressForm.addressLine1.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.pincode.trim()) {
      setAddressError("Please complete all required address fields.");
      return;
    }

    if (editingAddressId) {
      await updateAddress(editingAddressId, addressForm);
    } else {
      await addAddress(addressForm);
    }
    setIsAddressModalOpen(false);
  };

  // Handle Reorder items back into Cart
  const handleReorder = (order: CustomerOrder) => {
    order.items.forEach((item) => {
      // Find original product or create a fallback product
      const foundProduct = PRODUCTS.find((p) => p.id === item.productId) || {
        id: item.productId || `prod_${Date.now()}`,
        slug: "boxcare-item",
        name: item.name,
        category: "Mailer Boxes",
        categorySlug: "mailer-boxes",
        categoryId: "mailer-boxes",
        size_inches: item.size,
        size_inches_short: item.size,
        size_cm: "Custom",
        length_in: 6,
        width_in: 6,
        height_in: 2,
        length_cm: 15,
        width_cm: 15,
        height_cm: 5,
        description: item.name,
        features: ["Kraft Flute", "Eco-Friendly"],
        prices: { "50": item.unitPrice * 50, "100": item.unitPrice * 100, "300": item.unitPrice * 300, "500": item.unitPrice * 500 },
        contact_number: "+91 98765 43210",
        availability: "In Stock",
        image: item.image || "/images/category-mailer-boxes.png",
        specifications: {},
      };
      addToCart(foundProduct as any, item.quantity, item.size);
    });

    setReorderSuccessMsg(`Added ${order.items.length} items from order #${order.orderNumber} to your cart!`);
    setTimeout(() => setReorderSuccessMsg(null), 4000);
  };

  // Filtered Orders
  const filteredOrders = user?.orders.filter((ord) => {
    if (orderFilter === "active") return ord.status === "Processing" || ord.status === "In Production" || ord.status === "Shipped";
    if (orderFilter === "delivered") return ord.status === "Delivered";
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#5C3A22", fontWeight: 600 }}>
          <svg style={{ animation: "spin 1s linear infinite", width: "24px", height: "24px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          <span>Loading your BoxCare profile...</span>
        </div>
      </div>
    );
  }

  // If user is not logged in, show sleek login gateway
  if (!isLoggedIn || !user) {
    return (
      <div style={{ minHeight: "calc(100vh - 140px)", backgroundColor: "#FAF7F2", padding: "60px 16px 80px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE0D5", padding: "48px 36px", textAlign: "center", boxShadow: "0 10px 40px rgba(92, 58, 34, 0.08)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#FAF7F2", border: "1.5px solid #E5D8C8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#5C3A22" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px", color: "#1F1A16", margin: "0 0 10px 0" }}>
            Customer Profile Access
          </h1>
          <p style={{ fontSize: "14px", color: "#7A6E65", lineHeight: 1.6, margin: "0 0 32px 0" }}>
            Sign in to view your profile details, manage saved shipping addresses, and track real-time packaging orders.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            <Link
              href="/signin"
              style={{
                width: "100%",
                padding: "14px 20px",
                backgroundColor: "#5C3A22",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(92, 58, 34, 0.2)",
                boxSizing: "border-box",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Sign In to Customer Account</span>
            </Link>

            <Link
              href="/signup"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 20px",
                backgroundColor: "#FAF7F2",
                color: "#5C3A22",
                border: "1.5px solid #D68A45",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              Create New Account
            </Link>
          </div>

          <div style={{ fontSize: "13px", color: "#8C7E72" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#5C3A22", fontWeight: 600, textDecoration: "underline" }}>
              Sign Up here
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", backgroundColor: "#FAF7F2", padding: "32px 16px 80px" }}>
      {/* Container */}
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#8C7E72", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#5C3A22", textDecoration: "none", fontWeight: 500 }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: "#1F1A16", fontWeight: 600 }}>My Account Profile</span>
        </div>

        {/* Success Alert Banner for Reorders */}
        {reorderSuccessMsg && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 20px",
              borderRadius: "12px",
              backgroundColor: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #A7F3D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{reorderSuccessMsg}</span>
            </div>
            <button
              onClick={() => router.push("/cart")}
              style={{
                backgroundColor: "#065F46",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View Cart
            </button>
          </div>
        )}

        {/* Top Profile Header Banner Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            border: "1px solid #EAE0D5",
            padding: "32px",
            marginBottom: "28px",
            boxShadow: "0 6px 24px rgba(92, 58, 34, 0.05)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* Left: Avatar + Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Avatar with edit overlay */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "84px",
                  height: "84px",
                  borderRadius: "50%",
                  border: "3px solid #5C3A22",
                  overflow: "hidden",
                  backgroundColor: "#FAF7F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(92, 58, 34, 0.15)",
                }}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "28px", fontWeight: 700, color: "#5C3A22" }}>
                    {user.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                aria-label="Change profile photo"
                title="Change photo"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "#5C3A22",
                  color: "#FFFFFF",
                  border: "2px solid #FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>

            {/* Name and Badges */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#1F1A16", margin: 0 }}>
                  {user.name}
                </h1>
                <span
                  style={{
                    backgroundColor: "#ECFDF5",
                    color: "#065F46",
                    border: "1px solid #A7F3D0",
                    padding: "3px 10px",
                    borderRadius: "14px",
                    fontSize: "11px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified Customer
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "#7A6E65" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {user.email}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {user.phone || "+91 Not Provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Stats & Sign Out */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", padding: "10px 18px", backgroundColor: "#FAF7F2", borderRadius: "12px", border: "1px solid #EAE0D5" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#5C3A22" }}>{user.orders.length}</div>
              <div style={{ fontSize: "11px", color: "#8C7E72", textTransform: "uppercase", fontWeight: 600 }}>Total Orders</div>
            </div>

            <div style={{ textAlign: "center", padding: "10px 18px", backgroundColor: "#FAF7F2", borderRadius: "12px", border: "1px solid #EAE0D5" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#5C3A22" }}>{user.addresses.length}</div>
              <div style={{ fontSize: "11px", color: "#8C7E72", textTransform: "uppercase", fontWeight: 600 }}>Saved Addresses</div>
            </div>

            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                backgroundColor: "#FEF2F2",
                color: "#DC2626",
                border: "1px solid #FECACA",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEE2E2")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Pills */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid #E5D8C8",
            marginBottom: "28px",
            overflowX: "auto",
            paddingBottom: "2px",
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
              borderRadius: "12px 12px 0 0",
              border: "none",
              backgroundColor: activeTab === "profile" ? "#FFFFFF" : "transparent",
              color: activeTab === "profile" ? "#5C3A22" : "#7A6E65",
              fontWeight: activeTab === "profile" ? 700 : 600,
              fontSize: "14px",
              cursor: "pointer",
              borderBottom: activeTab === "profile" ? "3px solid #5C3A22" : "3px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "12px 12px 0 0",
              border: "none",
              backgroundColor: activeTab === "addresses" ? "#FFFFFF" : "transparent",
              color: activeTab === "addresses" ? "#5C3A22" : "#7A6E65",
              fontWeight: activeTab === "addresses" ? 700 : 600,
              fontSize: "14px",
              cursor: "pointer",
              borderBottom: activeTab === "addresses" ? "3px solid #5C3A22" : "3px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Saved Addresses</span>
            <span
              style={{
                backgroundColor: activeTab === "addresses" ? "#5C3A22" : "#E5D8C8",
                color: activeTab === "addresses" ? "#FFFFFF" : "#5C3A22",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: "10px",
              }}
            >
              {user.addresses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "12px 12px 0 0",
              border: "none",
              backgroundColor: activeTab === "orders" ? "#FFFFFF" : "transparent",
              color: activeTab === "orders" ? "#5C3A22" : "#7A6E65",
              fontWeight: activeTab === "orders" ? 700 : 600,
              fontSize: "14px",
              cursor: "pointer",
              borderBottom: activeTab === "orders" ? "3px solid #5C3A22" : "3px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Order History</span>
            <span
              style={{
                backgroundColor: activeTab === "orders" ? "#5C3A22" : "#E5D8C8",
                color: activeTab === "orders" ? "#FFFFFF" : "#5C3A22",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: "10px",
              }}
            >
              {user.orders.length}
            </span>
          </button>
        </div>

        {/* TAB 1: PROFILE DETAILS */}
        {activeTab === "profile" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {/* Main Form Card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                border: "1px solid #EAE0D5",
                padding: "36px 32px",
                boxShadow: "0 6px 24px rgba(92, 58, 34, 0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid #F0E6DA", paddingBottom: "16px" }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#1F1A16", margin: "0 0 4px 0" }}>
                    Personal & Business Information
                  </h2>
                  <p style={{ fontSize: "13px", color: "#8C7E72", margin: 0 }}>
                    Manage your personal details and business invoicing information.
                  </p>
                </div>
                {!isEditingProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      backgroundColor: "#FAF7F2",
                      color: "#5C3A22",
                      border: "1.5px solid #D68A45",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span>Edit Details</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setName(user.name);
                      setEmail(user.email);
                      setPhone(user.phone);
                      setDateOfBirth(user.dateOfBirth || "");
                      setCompanyName(user.companyName || "");
                      setGstNumber(user.gstNumber || "");
                    }}
                    style={{
                      padding: "8px 14px",
                      backgroundColor: "transparent",
                      color: "#7A6E65",
                      border: "1px solid #D1C7BD",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {profileMessage && (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    backgroundColor: profileMessage.type === "success" ? "#ECFDF5" : "#FEF2F2",
                    color: profileMessage.type === "success" ? "#065F46" : "#991B1B",
                    border: `1px solid ${profileMessage.type === "success" ? "#A7F3D0" : "#FECACA"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {profileMessage.type === "success" ? <polyline points="20 6 9 17 4 12" /> : <circle cx="12" cy="12" r="10" />}
                  </svg>
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                      Full Name <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #E2D7CC",
                        fontSize: "14px",
                        color: "#1F1A16",
                        backgroundColor: isEditingProfile ? "#FFFFFF" : "#FAF7F2",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                      Email Address <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="email"
                      disabled={!isEditingProfile}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #E2D7CC",
                        fontSize: "14px",
                        color: "#1F1A16",
                        backgroundColor: isEditingProfile ? "#FFFFFF" : "#FAF7F2",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      disabled={!isEditingProfile}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #E2D7CC",
                        fontSize: "14px",
                        color: "#1F1A16",
                        backgroundColor: isEditingProfile ? "#FFFFFF" : "#FAF7F2",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      disabled={!isEditingProfile}
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #E2D7CC",
                        fontSize: "14px",
                        color: "#1F1A16",
                        backgroundColor: isEditingProfile ? "#FFFFFF" : "#FAF7F2",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                      Company / Brand Name (Optional)
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Craft Pack Ltd."
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #E2D7CC",
                        fontSize: "14px",
                        color: "#1F1A16",
                        backgroundColor: isEditingProfile ? "#FFFFFF" : "#FAF7F2",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* GSTIN Number */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                      GSTIN (For B2B Tax Invoicing)
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      placeholder="27AABCU9603R1ZM"
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #E2D7CC",
                        fontSize: "14px",
                        color: "#1F1A16",
                        backgroundColor: isEditingProfile ? "#FFFFFF" : "#FAF7F2",
                        outline: "none",
                        boxSizing: "border-box",
                        textTransform: "uppercase",
                      }}
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 24px",
                        backgroundColor: isSavingProfile ? "#8C7E72" : "#5C3A22",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: isSavingProfile ? "not-allowed" : "pointer",
                        boxShadow: "0 4px 12px rgba(92, 58, 34, 0.2)",
                      }}
                    >
                      {isSavingProfile ? "Saving Changes..." : "Save Profile Details"}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Quick Profile Summary / Benefits Card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  backgroundColor: "#2E1A0C",
                  backgroundImage: "radial-gradient(circle at 100% 0%, #5C3A22 0%, #2E1A0C 70%)",
                  borderRadius: "20px",
                  padding: "32px",
                  color: "#FFFFFF",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    backgroundColor: "rgba(214, 138, 69, 0.2)",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#D68A45",
                    marginBottom: "16px",
                    border: "1px solid rgba(214, 138, 69, 0.3)",
                  }}
                >
                  ★ {user.membershipTier || "Gold Wholesale Partner"}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: "#FAF7F2", margin: "0 0 10px 0" }}>
                  Exclusive Wholesale Benefits
                </h3>
                <p style={{ fontSize: "13px", color: "#C4B5A5", lineHeight: 1.5, margin: "0 0 20px 0" }}>
                  Enjoy automated quantity discounts, dedicated packaging engineers, priority production dispatch, and GST input credit reports.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "#FAF7F2" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D68A45" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Up to 35% tier discounts on bulk orders</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D68A45" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Instant dielines & 3D digital proofing</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D68A45" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Pan-India express logistics tracking</span>
                  </div>
                </div>
              </div>

              {/* Account Quick Links */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  border: "1px solid #EAE0D5",
                  padding: "24px",
                }}
              >
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1F1A16", margin: "0 0 14px 0" }}>
                  Quick Shortcuts
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    onClick={() => setActiveTab("orders")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      backgroundColor: "#FAF7F2",
                      border: "1px solid #EAE0D5",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5C3A22",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span>View Latest Orders & Shipment Status</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setActiveTab("addresses")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      backgroundColor: "#FAF7F2",
                      border: "1px solid #EAE0D5",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5C3A22",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span>Manage Saved Shipping Addresses</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === "addresses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#1F1A16", margin: "0 0 4px 0" }}>
                  Saved Shipping Addresses
                </h2>
                <p style={{ fontSize: "13px", color: "#8C7E72", margin: 0 }}>
                  Manage multiple shipping destinations for factory dispatch, warehouse, and head office delivery.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddAddressModal}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  backgroundColor: "#5C3A22",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(92, 58, 34, 0.15)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add New Address</span>
              </button>
            </div>

            {user.addresses.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  border: "1px dashed #D68A45",
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#5C3A22" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1F1A16", margin: "0 0 8px 0" }}>
                  No Saved Addresses Found
                </h3>
                <p style={{ fontSize: "14px", color: "#7A6E65", maxWidth: "420px", margin: "0 auto 20px" }}>
                  Add your office, factory, or warehouse shipping addresses for quick 1-click checkout.
                </p>
                <button
                  type="button"
                  onClick={openAddAddressModal}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#5C3A22",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      border: addr.isDefault ? "2px solid #5C3A22" : "1px solid #EAE0D5",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      boxShadow: addr.isDefault ? "0 8px 24px rgba(92, 58, 34, 0.08)" : "0 4px 12px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            backgroundColor: addr.type === "Office" ? "#EFF6FF" : addr.type === "Warehouse" ? "#FEF3C7" : "#F3F4F6",
                            color: addr.type === "Office" ? "#1E40AF" : addr.type === "Warehouse" ? "#92400E" : "#374151",
                            border: "1px solid rgba(0,0,0,0.05)",
                          }}
                        >
                          {addr.type}
                        </span>

                        {addr.isDefault && (
                          <span
                            style={{
                              backgroundColor: "#ECFDF5",
                              color: "#065F46",
                              border: "1px solid #A7F3D0",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Default Address
                          </span>
                        )}
                      </div>

                      {/* Recipient & Details */}
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1F1A16", margin: "0 0 6px 0" }}>
                        {addr.name}
                      </h3>
                      <p style={{ fontSize: "13px", color: "#5A4F44", lineHeight: 1.5, margin: "0 0 10px 0" }}>
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                        <br />
                        {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                      <div style={{ fontSize: "12px", color: "#8C7E72", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>Contact: {addr.phone}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F0E6DA", paddingTop: "14px", marginTop: "8px" }}>
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(addr.id)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#5C3A22",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}>Primary Destination</span>
                      )}

                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          type="button"
                          onClick={() => openEditAddressModal(addr)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#5C3A22",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(addr.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#DC2626",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDER HISTORY */}
        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#1F1A16", margin: "0 0 4px 0" }}>
                  Packaging Orders & Live Tracking
                </h2>
                <p style={{ fontSize: "13px", color: "#8C7E72", margin: 0 }}>
                  Track batch dispatch, view courier consignment numbers & download GST compliant tax invoices.
                </p>
              </div>

              {/* Order Filter Pills */}
              <div style={{ display: "flex", gap: "6px", backgroundColor: "#FFFFFF", padding: "4px", borderRadius: "10px", border: "1px solid #EAE0D5" }}>
                <button
                  type="button"
                  onClick={() => setOrderFilter("all")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: orderFilter === "all" ? "#5C3A22" : "transparent",
                    color: orderFilter === "all" ? "#FFFFFF" : "#7A6E65",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  All ({user.orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter("active")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: orderFilter === "active" ? "#5C3A22" : "transparent",
                    color: orderFilter === "active" ? "#FFFFFF" : "#7A6E65",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  In Production / Shipped
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter("delivered")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: orderFilter === "delivered" ? "#5C3A22" : "transparent",
                    color: orderFilter === "delivered" ? "#FFFFFF" : "#7A6E65",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Delivered
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  border: "1px dashed #EAE0D5",
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#5C3A22" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1F1A16", margin: "0 0 8px 0" }}>
                  No Orders in this View
                </h3>
                <p style={{ fontSize: "14px", color: "#7A6E65", margin: "0 0 20px 0" }}>
                  Explore our premium mailers, corrugated boxes, and packaging accessories to place your order.
                </p>
                <Link
                  href="/products"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: "#5C3A22",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Explore Box Products
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {filteredOrders.map((order) => {
                  const isDelivered = order.status === "Delivered";
                  const isInProduction = order.status === "In Production" || order.status === "Processing";

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "16px",
                        border: "1px solid #EAE0D5",
                        overflow: "hidden",
                        boxShadow: "0 4px 16px rgba(92, 58, 34, 0.04)",
                      }}
                    >
                      {/* Order Header Bar */}
                      <div
                        style={{
                          backgroundColor: "#FAF7F2",
                          borderBottom: "1px solid #EAE0D5",
                          padding: "16px 24px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "12px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                          <div>
                            <span style={{ fontSize: "11px", color: "#8C7E72", textTransform: "uppercase", fontWeight: 600, display: "block" }}>
                              Order ID
                            </span>
                            <span style={{ fontSize: "15px", fontWeight: 800, color: "#5C3A22" }}>
                              #{order.orderNumber}
                            </span>
                          </div>

                          <div style={{ width: "1px", height: "24px", backgroundColor: "#E0D5C7" }} />

                          <div>
                            <span style={{ fontSize: "11px", color: "#8C7E72", textTransform: "uppercase", fontWeight: 600, display: "block" }}>
                              Date Placed
                            </span>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "#2C2520" }}>
                              {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>

                          <div style={{ width: "1px", height: "24px", backgroundColor: "#E0D5C7" }} />

                          <div>
                            <span style={{ fontSize: "11px", color: "#8C7E72", textTransform: "uppercase", fontWeight: 600, display: "block" }}>
                              Total Amount
                            </span>
                            <span style={{ fontSize: "14px", fontWeight: 800, color: "#1F1A16" }}>
                              ₹{(order.totalAmount ?? 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              backgroundColor: isDelivered
                                ? "#ECFDF5"
                                : isInProduction
                                ? "#EFF6FF"
                                : "#FEF3C7",
                              color: isDelivered
                                ? "#065F46"
                                : isInProduction
                                ? "#1E40AF"
                                : "#92400E",
                              border: `1px solid ${
                                isDelivered
                                  ? "#A7F3D0"
                                  : isInProduction
                                  ? "#BFDBFE"
                                  : "#FDE68A"
                              }`,
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: isDelivered ? "#10B981" : isInProduction ? "#3B82F6" : "#F59E0B",
                              }}
                            />
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order Body & Items */}
                      <div style={{ padding: "20px 24px" }}>
                        {/* Courier & Tracking Strip */}
                        {order.trackingId && (
                          <div
                            style={{
                              backgroundColor: "#F7F2EC",
                              borderRadius: "10px",
                              padding: "12px 16px",
                              marginBottom: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "10px",
                              fontSize: "13px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C3A22" strokeWidth="2">
                                <rect x="1" y="3" width="15" height="13" />
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                <circle cx="5.5" cy="18.5" r="2.5" />
                                <circle cx="18.5" cy="18.5" r="2.5" />
                              </svg>
                              <div>
                                <span style={{ color: "#7A6E65" }}>Courier Partner: </span>
                                <strong>{order.courierName}</strong> • Consignment:{" "}
                                <code style={{ backgroundColor: "#FFFFFF", padding: "2px 6px", borderRadius: "4px", border: "1px solid #E5D8C8", fontWeight: 700, color: "#5C3A22" }}>
                                  {order.trackingId}
                                </code>
                              </div>
                            </div>
                            <span style={{ fontSize: "12px", color: "#5A4F44", fontWeight: 600 }}>
                              Est. Delivery: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "3-5 Days"}
                            </span>
                          </div>
                        )}

                        {/* Items List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingBottom: "12px",
                                borderBottom: "1px solid #F5EFEB",
                                gap: "16px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                <div
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "8px",
                                    backgroundColor: "#FAF7F2",
                                    border: "1px solid #EAE0D5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#5C3A22",
                                    flexShrink: 0,
                                  }}
                                >
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1F1A16", margin: "0 0 3px 0" }}>
                                    {item.name}
                                  </h4>
                                  <div style={{ fontSize: "12px", color: "#8C7E72" }}>
                                    Size / Spec: <strong>{item.size}</strong> • Qty: <strong>{item.quantity} Units</strong>
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "14px", fontWeight: 700, color: "#1F1A16" }}>
                                  ₹{(item.totalPrice ?? 0).toLocaleString()}
                                </div>
                                <div style={{ fontSize: "11px", color: "#8C7E72" }}>
                                  (₹{item.unitPrice}/unit)
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Action CTAs */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                          <div style={{ fontSize: "12px", color: "#8C7E72" }}>
                            Ship to: <strong>{order.shippingAddress}</strong>
                          </div>

                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowInvoiceModal(true);
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 14px",
                                backgroundColor: "#FAF7F2",
                                color: "#5C3A22",
                                border: "1.5px solid #D68A45",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                              </svg>
                              <span>GST Invoice</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReorder(order)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 16px",
                                backgroundColor: "#5C3A22",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(92, 58, 34, 0.15)",
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                              </svg>
                              <span>Reorder All Items</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: PROFILE PHOTO SELECTOR */}
      {showAvatarModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={() => setShowAvatarModal(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              padding: "28px",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              border: "1px solid #EAE0D5",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#1F1A16", margin: 0 }}>
                Update Profile Photo
              </h3>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                style={{ background: "none", border: "none", color: "#8C7E72", cursor: "pointer", fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            {/* Custom Photo Upload */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "8px" }}>
                Upload Custom Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1.5px dashed #D68A45",
                  backgroundColor: "#FAF7F2",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: "11px", color: "#8C7E72", marginTop: "4px", display: "block" }}>
                Supports JPG, PNG or WEBP (Max 2MB).
              </span>
            </div>

            {/* Or Select from Presets */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "10px" }}>
                Or Choose from Avatars
              </label>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(preset);
                      updateProfile({ avatarUrl: preset });
                      setShowAvatarModal(false);
                    }}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      padding: 0,
                      border: avatarUrl === preset ? "3px solid #5C3A22" : "2px solid #EAE0D5",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.0)")}
                  >
                    <img src={preset} alt="preset avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Reset / Remove Photo */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={() => {
                  setAvatarUrl("");
                  updateProfile({ avatarUrl: "" });
                  setShowAvatarModal(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#DC2626",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Remove Photo (Use Initials)
              </button>

              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#5C3A22",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ADDRESS */}
      {isAddressModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              padding: "32px",
              maxWidth: "540px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              border: "1px solid #EAE0D5",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#1F1A16", margin: 0 }}>
                {editingAddressId ? "Edit Shipping Address" : "Add New Delivery Address"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                style={{ background: "none", border: "none", color: "#8C7E72", cursor: "pointer", fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            {addressError && (
              <div style={{ padding: "10px 14px", backgroundColor: "#FEF2F2", color: "#DC2626", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
                {addressError}
              </div>
            )}

            <form onSubmit={handleSaveAddress} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Address Type Selector */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "6px" }}>
                  Address Type
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {(["Office", "Warehouse", "Home", "Other"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, type })}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: addressForm.type === type ? "2px solid #5C3A22" : "1.5px solid #E2D7CC",
                        backgroundColor: addressForm.type === type ? "#FAF7F2" : "#FFFFFF",
                        color: addressForm.type === type ? "#5C3A22" : "#7A6E65",
                        fontWeight: addressForm.type === type ? 700 : 500,
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                    Contact Name <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                    Phone Number <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                  Building, Unit / Street Address <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="e.g. Unit 402, Oberoi Commerz II"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                  Area, Landmark, Road (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine2 || ""}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="e.g. Goregaon East, Western Express Highway"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>

              {/* City, State, Pincode */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                    City <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="Mumbai"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                    State <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="Maharashtra"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#2C2520", marginBottom: "4px" }}>
                    Pincode <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="400063"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E2D7CC", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Set as Default checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <input
                  id="make-default-addr"
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  style={{ width: "16px", height: "16px", accentColor: "#5C3A22", cursor: "pointer" }}
                />
                <label htmlFor="make-default-addr" style={{ fontSize: "13px", color: "#4A4036", cursor: "pointer", userSelect: "none" }}>
                  Make this my default shipping address
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  style={{ padding: "10px 18px", backgroundColor: "#FAF7F2", color: "#7A6E65", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", backgroundColor: "#5C3A22", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  {editingAddressId ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE ADDRESS CONFIRMATION */}
      {deleteConfirmId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              border: "1px solid #EAE0D5",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1F1A16", margin: "0 0 8px 0" }}>
              Delete Saved Address?
            </h3>
            <p style={{ fontSize: "13px", color: "#7A6E65", margin: "0 0 24px 0" }}>
              Are you sure you want to remove this delivery address from your profile? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                style={{ flex: 1, padding: "10px", backgroundColor: "#FAF7F2", border: "1px solid #D1C7BD", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#5A4F44" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAddress(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                style={{ flex: 1, padding: "10px", backgroundColor: "#DC2626", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GST TAX INVOICE PREVIEW */}
      {showInvoiceModal && selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={() => setShowInvoiceModal(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              padding: "36px",
              maxWidth: "680px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              border: "1px solid #EAE0D5",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Invoice Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #5C3A22", paddingBottom: "20px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#5C3A22", display: "flex", alignItems: "center", gap: "8px" }}>
                  BoxCare Premium Packaging
                </div>
                <div style={{ fontSize: "12px", color: "#7A6E65", marginTop: "4px" }}>
                  BoxCare Packaging India Pvt Ltd • GSTIN: 27AABCB1234F1Z8
                  <br />
                  Logistics Park, Andheri East, Mumbai, MH 400069
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "inline-block", padding: "4px 10px", backgroundColor: "#F7F2EC", borderRadius: "6px", fontWeight: 700, fontSize: "12px", color: "#5C3A22" }}>
                  TAX INVOICE
                </span>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F1A16", marginTop: "6px" }}>
                  {selectedOrder.gstInvoiceNo || `INV-${selectedOrder.orderNumber}`}
                </div>
                <div style={{ fontSize: "12px", color: "#8C7E72" }}>
                  Date: {new Date(selectedOrder.date).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px", fontSize: "13px", backgroundColor: "#FAF7F2", padding: "14px 16px", borderRadius: "10px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#8C7E72", textTransform: "uppercase" }}>Billed To:</span>
                <div style={{ fontWeight: 700, color: "#1F1A16", marginTop: "2px" }}>{user.name}</div>
                {user.companyName && <div style={{ color: "#5A4F44" }}>{user.companyName}</div>}
                {user.gstNumber && <div style={{ color: "#5C3A22", fontWeight: 600 }}>GSTIN: {user.gstNumber}</div>}
                <div style={{ color: "#7A6E65", marginTop: "2px" }}>{user.email}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#8C7E72", textTransform: "uppercase" }}>Ship To:</span>
                <div style={{ color: "#5A4F44", marginTop: "2px" }}>{selectedOrder.shippingAddress}</div>
                <div style={{ color: "#7A6E65", marginTop: "4px" }}>
                  Courier: {selectedOrder.courierName} ({selectedOrder.trackingId})
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "20px" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #EAE0D5", backgroundColor: "#FAF7F2", textAlign: "left" }}>
                  <th style={{ padding: "10px" }}>Item Description</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Qty</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Unit Price</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #F0E6DA" }}>
                    <td style={{ padding: "10px" }}>
                      <strong>{item.name}</strong>
                      <div style={{ fontSize: "11px", color: "#8C7E72" }}>Spec: {item.size}</div>
                    </td>
                    <td style={{ padding: "10px", textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ padding: "10px", textAlign: "right" }}>₹{item.unitPrice}</td>
                    <td style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>₹{(item.totalPrice ?? 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Breakdown */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
              <div style={{ width: "240px", fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#7A6E65" }}>
                  <span>Taxable Subtotal:</span>
                  <span>₹{Math.round((selectedOrder.totalAmount ?? 0) / 1.18).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#7A6E65" }}>
                  <span>CGST (9%):</span>
                  <span>₹{Math.round(((selectedOrder.totalAmount ?? 0) / 1.18) * 0.09).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#7A6E65" }}>
                  <span>SGST (9%):</span>
                  <span>₹{Math.round(((selectedOrder.totalAmount ?? 0) / 1.18) * 0.09).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "15px", color: "#5C3A22", borderTop: "1.5px solid #EAE0D5", paddingTop: "8px" }}>
                  <span>Total Amount Paid:</span>
                  <span>₹{(selectedOrder.totalAmount ?? 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}>✓ Payment Verified & Captured</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#FAF7F2",
                    color: "#5C3A22",
                    border: "1.5px solid #D68A45",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#5C3A22",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#5C3A22", fontWeight: 600 }}>Loading BoxCare Profile...</div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
