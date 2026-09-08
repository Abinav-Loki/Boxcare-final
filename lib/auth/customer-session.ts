import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { SanitizedCustomer } from "@/lib/validation/customer";

const SESSION_COOKIE_NAME = "customer_session_token";
const SESSION_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SESSION_SECRET ||
  "boxcare-customer-session-secret-salt-2026";

interface SessionPayload {
  customerId: string;
  issuedAt: number;
  expiresAt: number;
}

function signSessionData(data: SessionPayload): string {
  const jsonStr = JSON.stringify(data);
  const base64Data = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(base64Data)
    .digest("base64url");
  return `${base64Data}.${signature}`;
}

function verifySessionToken(token: string): SessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const [base64Data, signature] = token.split(".");
  if (!base64Data || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(base64Data)
    .digest("base64url");

  // Constant-time comparison
  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(base64Data, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(jsonStr);
    if (!payload.customerId || !payload.expiresAt) return null;
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setCustomerSession(
  customerId: string,
  rememberMe: boolean = false
): Promise<void> {
  try {
    const cookieStore = await cookies();
    const maxAgeSeconds = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days vs 1 day
    const issuedAt = Date.now();
    const expiresAt = issuedAt + maxAgeSeconds * 1000;

    const token = signSessionData({
      customerId,
      issuedAt,
      expiresAt,
    });

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });
  } catch {
    // If called outside request context, safely continue
  }
}

export async function clearCustomerSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // If called outside request context, safely continue
  }
}

export async function getAuthenticatedCustomerId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload) return null;

    return payload.customerId;
  } catch {
    return null;
  }
}

export async function getAuthenticatedCustomer(): Promise<SanitizedCustomer | null> {
  const customerId = await getAuthenticatedCustomerId();
  if (!customerId) return null;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId, isActive: true },
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

    if (!customer) return null;

    return {
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
  } catch (err) {
    console.error("Error fetching authenticated customer:", err);
    return null;
  }
}
