import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";

export interface GoogleTrustedIdentity {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface GoogleJWKKey {
  kty: string;
  alg?: string;
  use?: string;
  kid: string;
  n: string;
  e: string;
  [key: string]: unknown;
}

interface JWKCache {
  keys: GoogleJWKKey[];
  expiresAt: number;
}

let jwkCache: JWKCache | null = null;

/**
 * Generate a cryptographically random 32-byte hex state for CSRF protection.
 */
export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate PKCE code verifier and S256 code challenge.
 */
export function generatePKCE(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  return { codeVerifier, codeChallenge };
}

/**
 * Generate a cryptographically random 32-byte hex nonce for OIDC replay prevention.
 */
export function generateOAuthNonce(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Build the Google OAuth 2.0 authorization URL.
 */
export function getGoogleAuthUrl(
  state: string,
  codeChallenge: string,
  nonce: string,
  origin?: string
): string {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    (origin ? `${origin}/api/auth/google/callback` : "http://localhost:3000/api/auth/google/callback");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    nonce: nonce,
    access_type: "online",
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Fetch Google's public JWKS keyset with in-memory caching and TTL.
 */
export async function fetchGoogleJWKS(forceFresh = false): Promise<GoogleJWKKey[]> {
  const now = Date.now();
  if (!forceFresh && jwkCache && jwkCache.expiresAt > now && jwkCache.keys.length > 0) {
    return jwkCache.keys;
  }

  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/certs", {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Google JWKS: ${res.status}`);
    }

    const data = (await res.json()) as { keys?: GoogleJWKKey[] };
    if (!data.keys || !Array.isArray(data.keys)) {
      throw new Error("Invalid JWKS payload from Google");
    }

    // Parse Cache-Control max-age if present, default to 1 hour
    let maxAge = 3600;
    const cacheControl = res.headers.get("cache-control");
    if (cacheControl) {
      const match = cacheControl.match(/max-age=(\d+)/i);
      if (match && match[1]) {
        maxAge = parseInt(match[1], 10);
      }
    }

    jwkCache = {
      keys: data.keys,
      expiresAt: now + maxAge * 1000,
    };

    return data.keys;
  } catch (err) {
    // If fresh fetch fails but stale cache exists, fallback safely
    if (jwkCache && jwkCache.keys.length > 0) {
      return jwkCache.keys;
    }
    throw err;
  }
}

/**
 * Exchange the authorization code for tokens server-side.
 */
export async function exchangeGoogleCode(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{ id_token: string; access_token?: string }> {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    code_verifier: codeVerifier,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`Google token exchange failed with status: ${res.status}`);
  }

  const tokenData = (await res.json()) as { id_token?: string; access_token?: string };
  if (!tokenData.id_token || typeof tokenData.id_token !== "string") {
    throw new Error("Google response did not contain a valid ID token");
  }

  return {
    id_token: tokenData.id_token,
    access_token: tokenData.access_token,
  };
}

/**
 * Cryptographically verify the Google ID token against Google's trusted JWKS,
 * validate RS256 signature, issuer, audience, expiration, sub, email, email_verified, and OIDC nonce.
 */
export async function verifyGoogleIdToken(
  idToken: string,
  expectedNonce: string,
  customJWKS?: GoogleJWKKey[] // For test injection
): Promise<GoogleTrustedIdentity> {
  if (!idToken || typeof idToken !== "string") {
    throw new Error("INVALID_JWT_STRUCTURE");
  }

  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new Error("INVALID_JWT_STRUCTURE");
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  if (!headerB64 || !payloadB64 || !signatureB64) {
    throw new Error("INVALID_JWT_STRUCTURE");
  }

  // Parse header ONLY to inspect kid and alg
  let header: { alg?: string; kid?: string };
  try {
    const headerJson = Buffer.from(headerB64, "base64url").toString("utf-8");
    header = JSON.parse(headerJson);
  } catch {
    throw new Error("INVALID_JWT_HEADER");
  }

  if (header.alg !== "RS256" || !header.kid || typeof header.kid !== "string") {
    throw new Error("INVALID_JWT_ALGORITHM_OR_KID");
  }

  // Retrieve signing key from JWKS with single retry on rotation
  let keys = customJWKS || (await fetchGoogleJWKS(false));
  let matchingKey = keys.find((k) => k.kid === header.kid);

  if (!matchingKey && !customJWKS) {
    // Perform ONE fresh JWKS fetch to handle key rotation
    keys = await fetchGoogleJWKS(true);
    matchingKey = keys.find((k) => k.kid === header.kid);
  }

  if (!matchingKey) {
    throw new Error("UNKNOWN_SIGNING_KEY");
  }

  // Import JWK into Node.js PublicKeyObject
  let publicKey: crypto.KeyObject;
  try {
    publicKey = crypto.createPublicKey({
      key: matchingKey as unknown as crypto.JsonWebKey,
      format: "jwk",
    });
  } catch {
    throw new Error("FAILED_TO_IMPORT_JWK");
  }

  // Cryptographically verify RS256 signature
  const signedData = Buffer.from(`${headerB64}.${payloadB64}`);
  const signatureBuffer = Buffer.from(signatureB64, "base64url");
  const isSignatureValid = crypto.verify("RSA-SHA256", signedData, publicKey, signatureBuffer);

  if (!isSignatureValid) {
    throw new Error("INVALID_SIGNATURE");
  }

  // Signature verified! Now parse and strictly validate payload claims
  let payload: {
    iss?: string;
    aud?: string;
    exp?: number;
    sub?: string;
    email?: string;
    email_verified?: boolean | string;
    nonce?: string;
    name?: string;
    picture?: string;
  };

  try {
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf-8");
    payload = JSON.parse(payloadJson);
  } catch {
    throw new Error("INVALID_JWT_PAYLOAD");
  }

  // 1. Issuer Validation
  const validIssuers = ["https://accounts.google.com", "accounts.google.com"];
  if (!payload.iss || !validIssuers.includes(payload.iss)) {
    throw new Error("INVALID_ISSUER");
  }

  // 2. Audience Validation
  const expectedAud = process.env.GOOGLE_CLIENT_ID;
  if (!payload.aud || (expectedAud && payload.aud !== expectedAud)) {
    throw new Error("INVALID_AUDIENCE");
  }

  // 3. Expiration Validation
  const nowUnix = Math.floor(Date.now() / 1000);
  if (!payload.exp || typeof payload.exp !== "number" || payload.exp <= nowUnix) {
    throw new Error("TOKEN_EXPIRED");
  }

  // 4. Subject Validation
  if (!payload.sub || typeof payload.sub !== "string" || payload.sub.trim() === "") {
    throw new Error("MISSING_SUBJECT");
  }

  // 5. Email Validation
  if (
    !payload.email ||
    typeof payload.email !== "string" ||
    !payload.email.includes("@") ||
    payload.email.trim() === ""
  ) {
    throw new Error("MISSING_OR_INVALID_EMAIL");
  }

  // 6. Email Verified Validation
  const isEmailVerified = payload.email_verified === true || payload.email_verified === "true";
  if (!isEmailVerified) {
    throw new Error("UNVERIFIED_EMAIL");
  }

  // 7. OIDC Nonce Validation
  if (!payload.nonce || typeof payload.nonce !== "string" || payload.nonce !== expectedNonce) {
    throw new Error("INVALID_OR_MISMATCHED_NONCE");
  }

  // Return TRUSTED Google Identity
  return {
    sub: payload.sub.trim(),
    email: payload.email.trim().toLowerCase(),
    name: payload.name?.trim() || undefined,
    picture: payload.picture?.trim() || undefined,
  };
}

/**
 * Safely handles customer database lookup, linking, and creation inside a Prisma transaction.
 * Strictly checks cross-account consistency and handles concurrency safely.
 */
export async function handleGoogleCustomerAuth(
  identity: GoogleTrustedIdentity
): Promise<{ customerId: string }> {
  const normalizedEmail = identity.email.trim().toLowerCase();

  return await prisma.$transaction(async (tx) => {
    // Case A: Check if a CustomerAccount already exists for (provider="google", providerAccountId=sub)
    const existingAccount = await tx.customerAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: identity.sub,
        },
      },
      include: {
        Customer: true,
      },
    });

    if (existingAccount) {
      const customer = existingAccount.Customer;

      // Consistency checks
      if (!customer || !customer.isActive) {
        throw new Error("ACCOUNT_INACTIVE");
      }

      // Check if associated customer's email is consistent with the verified Google email
      if (customer.email.trim().toLowerCase() !== normalizedEmail) {
        // Conflict: Google account ID was registered to Customer A, but incoming token has email for Customer B
        // Reject safely without modifying either customer
        throw new Error("CONFLICT_ERROR");
      }

      // Update avatarUrl if not set
      if (!customer.avatarUrl && identity.picture) {
        await tx.customer.update({
          where: { id: customer.id },
          data: { avatarUrl: identity.picture },
        });
      }

      return { customerId: customer.id };
    }

    // Case B: No CustomerAccount exists for this Google sub. Check if a Customer exists with the verified email.
    const existingCustomer = await tx.customer.findUnique({
      where: { email: normalizedEmail },
      include: {
        CustomerAccount: true,
      },
    });

    if (existingCustomer) {
      if (!existingCustomer.isActive) {
        throw new Error("ACCOUNT_INACTIVE");
      }

      // Check if this existing customer already has a conflicting Google account
      const existingGoogleAccount = existingCustomer.CustomerAccount.find(
        (acc) => acc.provider === "google"
      );

      if (existingGoogleAccount) {
        if (existingGoogleAccount.providerAccountId !== identity.sub) {
          // Customer already linked to a different Google account
          throw new Error("CONFLICT_ERROR");
        }
      }

      // Safe linking: Create the CustomerAccount association for this customer
      await tx.customerAccount.create({
        data: {
          id: `acc_${crypto.randomBytes(8).toString("hex")}`,
          customerId: existingCustomer.id,
          provider: "google",
          providerAccountId: identity.sub,
          updatedAt: new Date(),
        },
      });

      // Update avatarUrl if not set
      if (!existingCustomer.avatarUrl && identity.picture) {
        await tx.customer.update({
          where: { id: existingCustomer.id },
          data: { avatarUrl: identity.picture },
        });
      }

      return { customerId: existingCustomer.id };
    }

    // Case C: Neither Customer nor CustomerAccount exists -> Create new customer and Google account
    const newCustomer = await tx.customer.create({
      data: {
        id: `cust_${crypto.randomBytes(8).toString("hex")}`,
        email: normalizedEmail,
        fullName: identity.name || normalizedEmail.split("@")[0],
        avatarUrl: identity.picture || null,
        passwordHash: null, // Passwordless initially
        isActive: true,
      },
    });

    await tx.customerAccount.create({
      data: {
        id: `acc_${crypto.randomBytes(8).toString("hex")}`,
        customerId: newCustomer.id,
        provider: "google",
        providerAccountId: identity.sub,
        updatedAt: new Date(),
      },
    });

    return { customerId: newCustomer.id };
  });
}
