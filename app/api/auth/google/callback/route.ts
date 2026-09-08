import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  exchangeGoogleCode,
  verifyGoogleIdToken,
  handleGoogleCustomerAuth,
} from "@/lib/auth/google-oauth";
import { setCustomerSession } from "@/lib/auth/customer-session";
import { checkGoogleCallbackRateLimit } from "@/lib/auth/customer-rate-limit";

function clearOAuthCookies(response: NextResponse): void {
  const clearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/auth/google",
    maxAge: 0,
  };
  response.cookies.set("google_oauth_state", "", clearOptions);
  response.cookies.set("google_oauth_code_verifier", "", clearOptions);
  response.cookies.set("google_oauth_nonce", "", clearOptions);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const buildErrorRedirect = (errorCode: string): NextResponse => {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("error", errorCode);
    const response = NextResponse.redirect(signinUrl);
    clearOAuthCookies(response);
    return response;
  };

  try {
    // 1. Rate Limiting Check
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const rateLimit = checkGoogleCallbackRateLimit(ip);
    if (!rateLimit.allowed) {
      return buildErrorRedirect("rate_limit");
    }

    // 2. Read stored OAuth cookies before clearing
    const storedState = request.cookies.get("google_oauth_state")?.value;
    const storedVerifier = request.cookies.get("google_oauth_code_verifier")?.value;
    const storedNonce = request.cookies.get("google_oauth_nonce")?.value;

    // 3. Validate OAuth state using constant-time comparison
    if (!state || !storedState) {
      return buildErrorRedirect("auth_failed");
    }

    if (
      state.length !== storedState.length ||
      !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState))
    ) {
      return buildErrorRedirect("auth_failed");
    }

    // 4. Handle OAuth cancellation/errors from Google
    if (errorParam) {
      if (errorParam === "access_denied") {
        return buildErrorRedirect("oauth_cancelled");
      }
      return buildErrorRedirect("auth_failed");
    }

    // Validate code, verifier, and nonce presence
    if (!code || !storedVerifier || !storedNonce) {
      return buildErrorRedirect("auth_failed");
    }

    // 5. Exchange authorization code using code_verifier
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      `${request.nextUrl.origin}/api/auth/google/callback`;

    const tokenResponse = await exchangeGoogleCode(code, storedVerifier, redirectUri);

    // 6. Cryptographically verify Google ID token, claims, and nonce
    const validatedIdentity = await verifyGoogleIdToken(tokenResponse.id_token, storedNonce);

    // 7. Perform Customer/CustomerAccount database transaction
    const { customerId } = await handleGoogleCustomerAuth(validatedIdentity);

    // 8. Create existing BoxCare customer session
    await setCustomerSession(customerId, false);

    // 9. Redirect to /profile and clear OAuth cookies
    const profileUrl = new URL("/profile", request.url);
    const successResponse = NextResponse.redirect(profileUrl);
    clearOAuthCookies(successResponse);
    return successResponse;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "";

    if (errorMsg === "UNVERIFIED_EMAIL") {
      return buildErrorRedirect("unverified_email");
    }

    if (errorMsg === "CONFLICT_ERROR") {
      return buildErrorRedirect("conflict_error");
    }

    // Default safe failure
    return buildErrorRedirect("auth_failed");
  }
}
