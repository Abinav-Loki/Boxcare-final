import { NextRequest, NextResponse } from "next/server";
import {
  generateOAuthState,
  generatePKCE,
  generateOAuthNonce,
  getGoogleAuthUrl,
} from "@/lib/auth/google-oauth";
import { checkGoogleOAuthRateLimit } from "@/lib/auth/customer-rate-limit";

export async function GET(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const rateLimit = checkGoogleOAuthRateLimit(ip);
    if (!rateLimit.allowed) {
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("error", "rate_limit");
      return NextResponse.redirect(signinUrl);
    }

    // 2. Check if Google OAuth credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID) {
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("error", "not_configured");
      return NextResponse.redirect(signinUrl);
    }

    // 3. Generate CSRF state, PKCE verifier/challenge, and OIDC nonce
    const state = generateOAuthState();
    const { codeVerifier, codeChallenge } = generatePKCE();
    const nonce = generateOAuthNonce();

    // 4. Construct authorization URL
    const authUrl = getGoogleAuthUrl(state, codeChallenge, nonce, request.nextUrl.origin);

    // 5. Create redirect response and attach short-lived secure cookies
    const response = NextResponse.redirect(authUrl);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/api/auth/google",
      maxAge: 600, // 10 minutes
    };

    response.cookies.set("google_oauth_state", state, cookieOptions);
    response.cookies.set("google_oauth_code_verifier", codeVerifier, cookieOptions);
    response.cookies.set("google_oauth_nonce", nonce, cookieOptions);

    return response;
  } catch {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("error", "auth_failed");
    return NextResponse.redirect(signinUrl);
  }
}
