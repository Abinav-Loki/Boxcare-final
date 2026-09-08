"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Outside request store context (e.g. CLI runner), safely ignore
  }
}
import {
  customerSignUpSchema,
  customerSignInSchema,
  customerProfileUpdateSchema,
  customerAddressInputSchema,
  customerForgotPasswordSchema,
  customerResetPasswordSchema,
  SanitizedCustomer,
} from "@/lib/validation/customer";
import {
  hashCustomerPassword,
  verifyCustomerPassword,
  generateResetToken,
  hashResetToken,
} from "@/lib/auth/customer-passwords";
import {
  setCustomerSession,
  clearCustomerSession,
  getAuthenticatedCustomerId,
  getAuthenticatedCustomer,
} from "@/lib/auth/customer-session";
import { checkRateLimit, resetRateLimit } from "@/lib/auth/customer-rate-limit";
import { sendPasswordResetEmail } from "@/lib/email/customer-email";

export async function customerSignUpAction(rawInput: unknown): Promise<{
  success: boolean;
  error?: string;
  customer?: SanitizedCustomer;
}> {
  try {
    const validated = customerSignUpSchema.safeParse(rawInput);
    if (!validated.success) {
      const msg = validated.error.issues[0]?.message || "Invalid registration input";
      return { success: false, error: msg };
    }

    const { email, password, fullName, phone, companyName, gstNumber } = validated.data;

    // Rate limiting: max 5 signup attempts per email per 15 mins
    const rateCheck = checkRateLimit(`signup:${email}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return { success: false, error: `Too many signup attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.` };
    }

    // Friendly duplicate check
    const existing = await prisma.customer.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "An account with this email address already exists. Please sign in." };
    }

    const passwordHash = await hashCustomerPassword(password);
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=8B5E3C&textColor=ffffff`;

    const customer = await prisma.customer.create({
      data: {
        id: `cust_${crypto.randomBytes(8).toString("hex")}`,
        email,
        fullName,
        phone: phone || null,
        companyName: companyName || null,
        gstNumber: gstNumber || null,
        passwordHash,
        avatarUrl,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        companyName: true,
        gstNumber: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Establish secure HTTP-only customer session
    await setCustomerSession(customer.id, false);

    const sanitized: SanitizedCustomer = {
      id: customer.id,
      email: customer.email,
      fullName: customer.fullName,
      phone: customer.phone,
      companyName: customer.companyName,
      gstNumber: customer.gstNumber,
      avatarUrl: customer.avatarUrl,
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString().split("T")[0],
    };

    safeRevalidatePath("/profile");
    safeRevalidatePath("/(store)");

    return { success: true, customer: sanitized };
  } catch (err: unknown) {
    const errorObj = err as { code?: string };
    if (errorObj?.code === "P2002") {
      return { success: false, error: "An account with this email already exists." };
    }
    console.error("Error in customerSignUpAction:", err);
    return { success: false, error: "An unexpected error occurred during signup. Please try again." };
  }
}

export async function customerSignInAction(rawInput: unknown): Promise<{
  success: boolean;
  error?: string;
  customer?: SanitizedCustomer;
}> {
  try {
    const validated = customerSignInSchema.safeParse(rawInput);
    if (!validated.success) {
      return { success: false, error: "Please provide a valid email and password" };
    }

    const { email, password, rememberMe } = validated.data;

    // Rate limiting: max 5 login attempts per 15 mins
    const rateCheck = checkRateLimit(`login:${email}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return { success: false, error: `Too many failed login attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.` };
    }

    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer || !customer.isActive || !customer.passwordHash) {
      return { success: false, error: "Invalid email or password" };
    }

    const isMatch = await verifyCustomerPassword(password, customer.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Invalid email or password" };
    }

    // Reset rate limit upon successful authentication
    resetRateLimit(`login:${email}`);

    // Create secure HTTP-only session
    await setCustomerSession(customer.id, rememberMe);

    const sanitized: SanitizedCustomer = {
      id: customer.id,
      email: customer.email,
      fullName: customer.fullName,
      phone: customer.phone,
      companyName: customer.companyName,
      gstNumber: customer.gstNumber,
      avatarUrl: customer.avatarUrl,
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString().split("T")[0],
    };

    safeRevalidatePath("/profile");
    safeRevalidatePath("/(store)");

    return { success: true, customer: sanitized };
  } catch (err) {
    console.error("Error in customerSignInAction:", err);
    return { success: false, error: "An unexpected error occurred during signin. Please try again." };
  }
}

export async function customerSignOutAction(): Promise<{ success: boolean }> {
  try {
    await clearCustomerSession();
    safeRevalidatePath("/profile");
    safeRevalidatePath("/(store)");
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function customerGetProfileAction(): Promise<{
  success: boolean;
  customer: SanitizedCustomer | null;
}> {
  try {
    const customer = await getAuthenticatedCustomer();
    return { success: true, customer };
  } catch {
    return { success: false, customer: null };
  }
}

export async function customerUpdateProfileAction(rawInput: unknown): Promise<{
  success: boolean;
  error?: string;
  customer?: SanitizedCustomer;
}> {
  try {
    const customerId = await getAuthenticatedCustomerId();
    if (!customerId) {
      return { success: false, error: "You must be signed in to update your profile" };
    }

    const validated = customerProfileUpdateSchema.safeParse(rawInput);
    if (!validated.success) {
      const msg = validated.error.issues[0]?.message || "Invalid profile data";
      return { success: false, error: msg };
    }

    const { fullName, phone, companyName, gstNumber, avatarUrl } = validated.data;

    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: {
        fullName: fullName || undefined,
        phone: phone !== undefined ? phone : undefined,
        companyName: companyName !== undefined ? companyName : undefined,
        gstNumber: gstNumber !== undefined ? gstNumber : undefined,
        avatarUrl: avatarUrl !== undefined ? (avatarUrl || null) : undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        companyName: true,
        gstNumber: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    const sanitized: SanitizedCustomer = {
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      phone: updated.phone,
      companyName: updated.companyName,
      gstNumber: updated.gstNumber,
      avatarUrl: updated.avatarUrl,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString().split("T")[0],
    };

    safeRevalidatePath("/profile");

    return { success: true, customer: sanitized };
  } catch (err: unknown) {
    const msg = (err as Error)?.message || "Failed to update profile";
    console.error("Error in customerUpdateProfileAction:", err);
    return { success: false, error: msg };
  }
}

export interface CustomerAddressDTO {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  companyName: string;
  gstNumber: string;
  isDefault: boolean;
  createdAt: string;
}

export async function customerGetAddressesAction(): Promise<{
  success: boolean;
  addresses: CustomerAddressDTO[];
  error?: string;
}> {
  try {
    const customerId = await getAuthenticatedCustomerId();
    if (!customerId) {
      return { success: false, addresses: [], error: "Unauthorized" };
    }

    const addresses = await prisma.address.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return {
      success: true,
      addresses: addresses.map((a) => ({
        id: a.id,
        fullName: a.fullName,
        phone: a.phone,
        email: a.email,
        addressLine1: a.addressLine1,
        addressLine2: a.addressLine2 || "",
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        companyName: a.companyName || "",
        gstNumber: a.gstNumber || "",
        isDefault: a.isDefault,
        createdAt: a.createdAt.toISOString(),
      })),
    };
  } catch (err: unknown) {
    const msg = (err as Error)?.message || "Failed to load addresses";
    return { success: false, addresses: [], error: msg };
  }
}

export async function customerAddAddressAction(rawInput: unknown): Promise<{
  success: boolean;
  error?: string;
  address?: CustomerAddressDTO;
}> {
  try {
    const customerId = await getAuthenticatedCustomerId();
    if (!customerId) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const validated = customerAddressInputSchema.safeParse(rawInput);
    if (!validated.success) {
      const msg = validated.error.issues[0]?.message || "Invalid address fields";
      return { success: false, error: msg };
    }

    const data = validated.data;

    // If marked default, unset other defaults for this customer
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        id: `addr_${crypto.randomBytes(8).toString("hex")}`,
        customerId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        companyName: data.companyName || null,
        gstNumber: data.gstNumber || null,
        isDefault: data.isDefault || false,
      },
    });

    safeRevalidatePath("/profile");

    return {
      success: true,
      address: {
        id: address.id,
        fullName: address.fullName,
        phone: address.phone,
        email: address.email,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        companyName: address.companyName || "",
        gstNumber: address.gstNumber || "",
        isDefault: address.isDefault,
        createdAt: address.createdAt.toISOString(),
      },
    };
  } catch (err: unknown) {
    const msg = (err as Error)?.message || "Failed to add address";
    console.error("Error in customerAddAddressAction:", err);
    return { success: false, error: msg };
  }
}

export async function customerUpdateAddressAction(
  addressId: string,
  rawInput: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    const customerId = await getAuthenticatedCustomerId();
    if (!customerId) {
      return { success: false, error: "Unauthorized" };
    }

    // Ownership verification
    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.customerId !== customerId) {
      return { success: false, error: "Address not found or unauthorized" };
    }

    const validated = customerAddressInputSchema.safeParse(rawInput);
    if (!validated.success) {
      const msg = validated.error.issues[0]?.message || "Invalid address fields";
      return { success: false, error: msg };
    }

    const data = validated.data;

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    await prisma.address.update({
      where: { id: addressId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        companyName: data.companyName || null,
        gstNumber: data.gstNumber || null,
        isDefault: data.isDefault,
      },
    });

    safeRevalidatePath("/profile");
    return { success: true };
  } catch (err: unknown) {
    const msg = (err as Error)?.message || "Failed to update address";
    return { success: false, error: msg };
  }
}

export async function customerDeleteAddressAction(addressId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const customerId = await getAuthenticatedCustomerId();
    if (!customerId) {
      return { success: false, error: "Unauthorized" };
    }

    // Ownership verification
    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.customerId !== customerId) {
      return { success: false, error: "Address not found or unauthorized" };
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    safeRevalidatePath("/profile");
    return { success: true };
  } catch (err: unknown) {
    const msg = (err as Error)?.message || "Failed to delete address";
    return { success: false, error: msg };
  }
}

export async function customerSetDefaultAddressAction(addressId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const customerId = await getAuthenticatedCustomerId();
    if (!customerId) {
      return { success: false, error: "Unauthorized" };
    }

    // Ownership verification
    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.customerId !== customerId) {
      return { success: false, error: "Address not found or unauthorized" };
    }

    await prisma.address.updateMany({
      where: { customerId },
      data: { isDefault: false },
    });

    await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    safeRevalidatePath("/profile");
    return { success: true };
  } catch (err: unknown) {
    const msg = (err as Error)?.message || "Failed to set default address";
    return { success: false, error: msg };
  }
}

export interface CustomerOrderItemDTO {
  id: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerOrderDTO {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  itemsCount: number;
  trackingId?: string;
  courierName?: string;
  shippingAddress: string;
  items: CustomerOrderItemDTO[];
}

export async function customerGetOrdersAction(): Promise<{
  success: boolean;
  orders: CustomerOrderDTO[];
  error?: string;
}> {
  try {
    const customer = await getAuthenticatedCustomer();
    if (!customer) {
      return { success: false, orders: [], error: "Unauthorized" };
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerId: customer.id },
          { customerEmail: customer.email },
        ],
      },
      include: {
        items: true,
        shippingAddress: true,
        shipment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted: CustomerOrderDTO[] = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      date: o.createdAt.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: o.status,
      paymentStatus: o.paymentStatus,
      totalAmount: Math.round(o.totalPaise / 100),
      itemsCount: o.items.reduce((acc: number, it) => acc + it.quantity, 0),
      trackingId: o.shipment[0]?.trackingNumber || undefined,
      courierName: o.shipment[0]?.courierPartner || undefined,
      shippingAddress: o.shippingAddress
        ? `${o.shippingAddress.addressLine1}, ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.pincode}`
        : `${o.addressLine1}, ${o.city}, ${o.state} - ${o.pincode}`,
      items: o.items.map((it) => ({
        id: it.id,
        name: it.productName,
        size: it.material || "Standard",
        quantity: it.quantity,
        unitPrice: Math.round(it.unitPricePaise / 100),
        totalPrice: Math.round(it.totalPricePaise / 100),
      })),
    }));

    return { success: true, orders: formatted };
  } catch (err: unknown) {
    const msg = (err as Error)?.message || "Failed to load orders";
    console.error("Error in customerGetOrdersAction:", err);
    return { success: false, orders: [], error: msg };
  }
}

export async function customerForgotPasswordAction(rawInput: unknown): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  const genericMessage = "If this email is registered, password reset instructions have been sent.";

  try {
    const validated = customerForgotPasswordSchema.safeParse(rawInput);
    if (!validated.success) {
      return { success: false, message: "Please provide a valid email address", error: "Invalid email" };
    }

    const { email } = validated.data;

    // Rate limit: max 3 requests per 15 mins per email
    const rateCheck = checkRateLimit(`forgot:${email}`, 3, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        message: `Too many password reset requests. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        error: "Rate limit exceeded",
      };
    }

    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (customer && customer.isActive) {
      // Clean up old tokens for this customer
      await prisma.customerPasswordResetToken.deleteMany({
        where: { customerId: customer.id },
      });

      // Generate secure token + SHA-256 hash
      const { rawToken, tokenHash, expiresAt } = generateResetToken();

      await prisma.customerPasswordResetToken.create({
        data: {
          id: `rst_${crypto.randomBytes(8).toString("hex")}`,
          customerId: customer.id,
          tokenHash,
          expiresAt,
        },
      });

      // Send email without returning or exposing raw token
      await sendPasswordResetEmail(customer.email, rawToken);
    }

    return {
      success: true,
      message: genericMessage,
    };
  } catch (err) {
    console.error("Error in customerForgotPasswordAction:", err);
    return {
      success: true,
      message: genericMessage,
    };
  }
}

export async function customerResetPasswordAction(rawInput: unknown): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const validated = customerResetPasswordSchema.safeParse(rawInput);
    if (!validated.success) {
      const msg = validated.error.issues[0]?.message || "Invalid input";
      return { success: false, message: msg, error: "Validation failed" };
    }

    const { token, password } = validated.data;

    // Rate limiting: max 5 reset attempts per token hash per 15 mins
    const tokenHash = hashResetToken(token);
    const rateCheck = checkRateLimit(`reset:${tokenHash}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        message: `Too many attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        error: "Rate limit exceeded",
      };
    }

    const resetToken = await prisma.customerPasswordResetToken.findUnique({
      where: { tokenHash },
      include: { Customer: true },
    });

    if (!resetToken || resetToken.usedAt !== null || new Date() > resetToken.expiresAt) {
      return {
        success: false,
        message: "This password reset link is invalid or has expired. Please request a new one.",
        error: "Invalid or expired token",
      };
    }

    const newHash = await hashCustomerPassword(password);

    // Update password, mark token as used
    await prisma.$transaction([
      prisma.customer.update({
        where: { id: resetToken.customerId },
        data: { passwordHash: newHash },
      }),
      prisma.customerPasswordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate all tokens for this customer
      prisma.customerPasswordResetToken.deleteMany({
        where: { customerId: resetToken.customerId, id: { not: resetToken.id } },
      }),
    ]);

    // Invalidate existing sessions
    await clearCustomerSession();

    return {
      success: true,
      message: "Password reset successful! Please sign in with your new password.",
    };
  } catch (err: unknown) {
    const msg = (err as Error)?.message || "Failed to reset password";
    console.error("Error in customerResetPasswordAction:", err);
    return {
      success: false,
      message: "Failed to reset password. Please try again or request a new link.",
      error: msg,
    };
  }
}
