interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

export function checkGoogleOAuthRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  return checkRateLimit(`google-oauth-init:${identifier}`, 30, 15 * 60 * 1000); // 30 in 15 min
}

export function checkGoogleCallbackRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  return checkRateLimit(`google-oauth-callback:${identifier}`, 30, 15 * 60 * 1000); // 30 in 15 min
}
