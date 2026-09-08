const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /passwordhash/i,
  /token/i,
  /tokenhash/i,
  /secret/i,
  /api[_-]?key/i,
  /auth/i,
  /cookie/i,
  /session/i,
  /csrf/i,
  /pkce/i,
  /verifier/i,
  /nonce/i,
  /private[_-]?key/i,
  /encryption/i,
  /credential/i,
];

/**
 * Recursively cleans sensitive fields from objects and arrays before persisting in ActivityLog snapshots.
 */
export function sanitizeAuditData<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input !== 'object') {
    return input;
  }

  if (input instanceof Date) {
    return input.toISOString() as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeAuditData(item)) as unknown as T;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    const isSensitive = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
    if (isSensitive) {
      continue; // Strip completely
    }

    sanitized[key] = sanitizeAuditData(value);
  }

  return sanitized as T;
}
