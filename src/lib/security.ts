// Eternal Vowz (E&V) Production Security Engine
// Defends against OWASP Top 10 vulnerabilities:
// 1. Cross-Site Scripting (XSS via malicious URI schemes or input stuffing)
// 2. Open Redirects
// 3. API Abuse / Rate Limiting (DoS & Brute-force protection)
// 4. Data tampering & Parameter pollution

const SAFE_EXTERNAL_PROTOCOLS = ['https://', 'http://', 'mailto:', 'tel:'];

/**
 * Sanitizes external URLs (e.g. Google Maps links, custom URLs)
 * Disallows javascript:, vbscript:, data:text/html, file:, UNC paths, entity bypasses, etc.
 */
export function safeExternalUrl(rawUrl: string | null | undefined, fallback = '#'): string {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallback;

  // Immediately reject any backslashes (prevents UNC and Windows path injection)
  if (trimmed.includes('\\')) return fallback;

  // Immediately reject protocol-relative URLs
  if (trimmed.startsWith('//')) return fallback;

  // Decode common URL entities to catch hidden "javascript:" (e.g. jav%09ascript, jav&#x09;ascript)
  const normalized = trimmed
    .replace(/&#[xX]0*[0-9a-fA-F]+;?/g, '')
    .replace(/&#[0-9]+;?/g, '')
    .replace(/&[a-zA-Z]+;?/g, '')
    .replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '')
    .toLowerCase();

  // If normalized contains javascript:, vbscript:, data:, file:, blob:, about:, etc. -> REJECT
  if (
    normalized.includes('javascript:') ||
    normalized.includes('vbscript:') ||
    normalized.includes('data:') ||
    normalized.includes('file:') ||
    normalized.includes('blob:') ||
    normalized.includes('about:') ||
    normalized.includes('chrome:')
  ) {
    return fallback;
  }

  // Safe relative paths (e.g. /assets/audio/...)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    // Prevent traversal or protocol injection tricks inside path
    if (trimmed.includes('//') || trimmed.includes('/..') || trimmed.includes('\\')) {
      return fallback;
    }
    return trimmed;
  }

  // Safe absolute protocols (https://, http://, mailto:, tel:)
  const hasSafeProtocol = SAFE_EXTERNAL_PROTOCOLS.some((p) =>
    trimmed.toLowerCase().startsWith(p)
  );
  if (!hasSafeProtocol) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol !== 'https:' &&
      parsed.protocol !== 'http:' &&
      parsed.protocol !== 'mailto:' &&
      parsed.protocol !== 'tel:'
    ) {
      return fallback;
    }
    return trimmed;
  } catch {
    return fallback;
  }
}

/**
 * Validates audio URLs (must be https, relative /assets, or safe data:audio)
 */
export function safeAudioUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.includes('\\')) return null;

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    if (trimmed.includes('//') || trimmed.includes('..')) return null;
    return trimmed;
  }

  if (trimmed.startsWith('data:audio/')) {
    if (trimmed.includes('base64,')) {
      return trimmed;
    }
    return null;
  }

  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    try {
      const u = new URL(trimmed);
      if (u.protocol === 'https:' || u.protocol === 'http:') {
        return trimmed;
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Sanitizes Next.js redirect targets (prevents open redirects and path traversal)
 */
export function sanitizeNextPath(raw: string | null | undefined, fallback = '/dashboard'): string {
  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();

  // Must strictly start with a single slash
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback;

  // Must not contain backslashes or traversal patterns
  if (
    trimmed.includes('\\') ||
    trimmed.includes('//') ||
    trimmed.includes('..') ||
    trimmed.includes('%2f') ||
    trimmed.includes('%2F') ||
    trimmed.includes('%5c') ||
    trimmed.includes('%5C') ||
    trimmed.includes(':')
  ) {
    return fallback;
  }

  return trimmed;
}

/**
 * Sanitizes plain text input: strips null bytes, control characters, clamps length
 */
export function sanitizeText(raw: unknown, maxLength = 500): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/\0/g, '') // Strip null bytes
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g, '') // Strip non-printable control characters
    .trim()
    .slice(0, maxLength);
}

/**
 * In-memory sliding window rate limiter for serverless endpoints
 */
interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

// Periodic cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((bucket, key) => {
      if (now > bucket.resetAt) {
        rateLimitMap.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export function checkRateLimit(
  identifier: string,
  action: string,
  maxRequests = 20,
  windowMs = 60 * 1000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const key = `${action}:${identifier}`;
  const bucket = rateLimitMap.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInMs: windowMs,
    };
  }

  bucket.count += 1;
  const remaining = Math.max(0, maxRequests - bucket.count);
  const resetInMs = Math.max(0, bucket.resetAt - now);

  if (bucket.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs,
    };
  }

  return {
    allowed: true,
    remaining,
    resetInMs,
  };
}

/**
 * Extracts client IP from standard proxy headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return '127.0.0.1';
}
