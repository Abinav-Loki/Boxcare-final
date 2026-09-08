"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  customerSignUpAction,
  customerSignInAction,
  customerSignOutAction,
  customerGetProfileAction,
  customerUpdateProfileAction,
  customerGetAddressesAction,
  customerAddAddressAction,
  customerUpdateAddressAction,
  customerDeleteAddressAction,
  customerSetDefaultAddressAction,
  customerGetOrdersAction,
} from "@/app/actions/customer-auth";

export interface SavedAddress {
  id: string;
  type?: string;
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  companyName?: string;
  gstNumber?: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  paymentStatus?: string;
  totalAmount: number;
  itemsCount: number;
  trackingId?: string;
  courierName?: string;
  estimatedDelivery?: string;
  shippingAddress: string;
  items: OrderItem[];
  gstInvoiceNo?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  companyName?: string;
  gstNumber?: string;
  membershipTier?: string;
  createdAt: string;
  addresses: SavedAddress[];
  orders: CustomerOrder[];
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (email: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { name: string; email: string; password?: string; confirmPassword?: string; phone?: string; companyName?: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<CustomerUser>) => Promise<boolean>;
  addAddress: (address: Omit<SavedAddress, "id">) => Promise<SavedAddress | null>;
  updateAddress: (id: string, address: Partial<SavedAddress>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      const profileRes = await customerGetProfileAction();
      if (profileRes.success && profileRes.customer) {
        const c = profileRes.customer;

        // Fetch addresses & orders concurrently
        const [addrRes, ordRes] = await Promise.all([
          customerGetAddressesAction(),
          customerGetOrdersAction(),
        ]);

        const addresses: SavedAddress[] = addrRes.success
          ? addrRes.addresses.map((a) => ({
              id: a.id,
              name: a.fullName,
              phone: a.phone,
              email: a.email,
              addressLine1: a.addressLine1,
              addressLine2: a.addressLine2,
              city: a.city,
              state: a.state,
              pincode: a.pincode,
              companyName: a.companyName,
              gstNumber: a.gstNumber,
              isDefault: a.isDefault,
            }))
          : [];

        const orders: CustomerOrder[] = ordRes.success ? ordRes.orders : [];

        setUser({
          id: c.id,
          name: c.fullName,
          email: c.email,
          phone: c.phone || "",
          avatarUrl: c.avatarUrl || undefined,
          companyName: c.companyName || "",
          gstNumber: c.gstNumber || "",
          membershipTier: "Standard Member",
          createdAt: c.createdAt,
          addresses,
          orders,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to load customer auth session:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const signIn = async (email: string, password?: string, rememberMe: boolean = true) => {
    try {
      const res = await customerSignInAction({
        email,
        password: password || "",
        rememberMe,
      });

      if (!res.success || !res.customer) {
        return { success: false, error: res.error || "Invalid email or password" };
      }

      await loadUserData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Sign in failed" };
    }
  };

  const signUp = async (data: {
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    companyName?: string;
  }) => {
    try {
      const res = await customerSignUpAction({
        fullName: data.name,
        email: data.email,
        password: data.password || "",
        confirmPassword: data.confirmPassword || data.password || "",
        phone: data.phone,
        companyName: data.companyName,
      });

      if (!res.success || !res.customer) {
        return { success: false, error: res.error || "Failed to create account" };
      }

      await loadUserData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const signOut = async () => {
    try {
      await customerSignOutAction();
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<CustomerUser>): Promise<boolean> => {
    try {
      const res = await customerUpdateProfileAction({
        fullName: data.name,
        phone: data.phone,
        companyName: data.companyName,
        gstNumber: data.gstNumber,
        avatarUrl: data.avatarUrl,
      });

      if (res.success && res.customer) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: res.customer!.fullName,
                phone: res.customer!.phone || "",
                companyName: res.customer!.companyName || "",
                gstNumber: res.customer!.gstNumber || "",
                avatarUrl: res.customer!.avatarUrl || undefined,
              }
            : null
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addAddress = async (address: Omit<SavedAddress, "id">): Promise<SavedAddress | null> => {
    try {
      const res = await customerAddAddressAction({
        fullName: address.name,
        phone: address.phone,
        email: address.email || user?.email || "customer@boxcare.in",
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        companyName: address.companyName,
        gstNumber: address.gstNumber,
        isDefault: address.isDefault,
      });

      if (res.success && res.address) {
        const newAddr: SavedAddress = {
          id: res.address.id,
          name: res.address.fullName,
          phone: res.address.phone,
          email: res.address.email,
          addressLine1: res.address.addressLine1,
          addressLine2: res.address.addressLine2,
          city: res.address.city,
          state: res.address.state,
          pincode: res.address.pincode,
          companyName: res.address.companyName,
          gstNumber: res.address.gstNumber,
          isDefault: res.address.isDefault,
        };

        setUser((prev) =>
          prev
            ? {
                ...prev,
                addresses: newAddr.isDefault
                  ? [newAddr, ...prev.addresses.map((a) => ({ ...a, isDefault: false }))]
                  : [newAddr, ...prev.addresses],
              }
            : null
        );
        return newAddr;
      }
      return null;
    } catch {
      return null;
    }
  };

  const updateAddress = async (id: string, address: Partial<SavedAddress>): Promise<boolean> => {
    try {
      const current = user?.addresses.find((a) => a.id === id);
      if (!current) return false;

      const res = await customerUpdateAddressAction(id, {
        fullName: address.name ?? current.name,
        phone: address.phone ?? current.phone,
        email: address.email ?? current.email ?? user?.email ?? "customer@boxcare.in",
        addressLine1: address.addressLine1 ?? current.addressLine1,
        addressLine2: address.addressLine2 ?? current.addressLine2,
        city: address.city ?? current.city,
        state: address.state ?? current.state,
        pincode: address.pincode ?? current.pincode,
        companyName: address.companyName ?? current.companyName,
        gstNumber: address.gstNumber ?? current.gstNumber,
        isDefault: address.isDefault ?? current.isDefault,
      });

      if (res.success) {
        await loadUserData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteAddress = async (id: string): Promise<boolean> => {
    try {
      const res = await customerDeleteAddressAction(id);
      if (res.success) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                addresses: prev.addresses.filter((a) => a.id !== id),
              }
            : null
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const setDefaultAddress = async (id: string): Promise<boolean> => {
    try {
      const res = await customerSetDefaultAddressAction(id);
      if (res.success) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                addresses: prev.addresses.map((a) => ({
                  ...a,
                  isDefault: a.id === id,
                })),
              }
            : null
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        refreshProfile: loadUserData,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
