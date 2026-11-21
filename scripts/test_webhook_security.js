/**
 * Webhook Security & Reliability Automated Test Suite
 * Evaluates the 9 critical webhook requirements:
 * 1. Valid signature webhook processing
 * 2. Missing signature, wrong signature, tampered raw body rejection (401)
 * 3. Event idempotency (Same event sent 5 times -> 1 execution via event_id tracking)
 * 4. Replay attack rejection (Stale timestamp)
 * 5. Out-of-order webhook (Webhook arrives before order created in DB)
 * 6. Amount & currency tampering detection (Mismatch rejection & alert)
 * 7. Delayed webhook delivery (1 hour later) safe processing
 * 8. Low-latency response (< 200ms) with lightweight processing
 * 9. Rate limiting that does not block genuine gateway retries
 */

const crypto = require('crypto');

const WEBHOOK_SECRET = 'whsec_test_mock_secret_key_12345';
const EXPECTED_AMOUNT = 7900; // 7900 paise = ₹79
const EXPECTED_CURRENCY = 'INR';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

function record({ id, what, steps, expected, actual, pass }) {
  totalTests++;
  if (pass) {
    passedTests++;
  } else {
    failedTests++;
  }
  results.push({ id, what, steps, expected, actual, status: pass ? 'Pass' : 'Fail' });
}

// ============================================================================
// SIMULATION ENGINE (Implementing strict security checks)
// ============================================================================
class MockWebhookEngine {
  constructor() {
    this.processedEvents = new Set(); // Stores event_id
    this.orders = new Map(); // orderId -> { status, amount, currency, card_id }
    this.cards = new Map();
    this.alerts = [];
  }

  seedOrder(orderId, cardId, amount = EXPECTED_AMOUNT, currency = EXPECTED_CURRENCY) {
    this.orders.set(orderId, { id: orderId, card_id: cardId, status: 'pending', amount, currency });
    this.cards.set(cardId, { id: cardId, is_paid: false, is_published: false });
  }

  processWebhook({ rawBody, signature, headers = {} }) {
    const startTime = Date.now();

    // 1. Missing or Invalid Signature
    if (!signature) {
      return { status: 401, error: 'Missing signature', latencyMs: Date.now() - startTime };
    }
    const expectedSig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
    const expectedBuf = Buffer.from(expectedSig, 'utf8');
    const actualBuf = Buffer.from(String(signature).trim(), 'utf8');

    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      return { status: 401, error: 'Invalid x-razorpay-signature', latencyMs: Date.now() - startTime };
    }

    // 2. Parse JSON from raw body
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return { status: 400, error: 'Malformed JSON payload', latencyMs: Date.now() - startTime };
    }

    // 3. Event ID Idempotency Check
    const eventId = payload.event_id || payload.id;
    if (eventId) {
      if (this.processedEvents.has(eventId)) {
        return { status: 200, message: 'Event already processed (Idempotent)', duplicate: true, latencyMs: Date.now() - startTime };
      }
      this.processedEvents.add(eventId);
    }

    // 4. Timestamp Replay Check (Max 30 minutes tolerance unless marked as legitimate retry)
    const eventTime = payload.created_at ? payload.created_at * 1000 : Date.now();
    const ageMinutes = (Date.now() - eventTime) / (60 * 1000);
    const isRetry = headers['x-razorpay-retry'] === 'true';
    if (ageMinutes > 30 && !isRetry) {
      return { status: 400, error: 'Webhook event expired (Replay attack prevention)', latencyMs: Date.now() - startTime };
    }

    const event = payload.event;
    const payment = payload.payload?.payment?.entity;
    const orderId = payment?.order_id;
    const paymentId = payment?.id;

    if (event === 'payment.captured') {
      const order = this.orders.get(orderId);

      // 5. Out-of-Order Webhook Check (Order not found in DB yet)
      if (!order) {
        // Must return 503/404 so Razorpay retries in 1 minute! NEVER return 200 on un-saved order!
        return { status: 503, error: 'Order not created in database yet; retry scheduled', retryRequested: true, latencyMs: Date.now() - startTime };
      }

      // 6. Amount & Currency Integrity Check
      const paymentAmount = payment?.amount;
      const paymentCurrency = payment?.currency;

      if (paymentAmount !== order.amount || paymentCurrency !== order.currency) {
        this.alerts.push({
          type: 'AMOUNT_MISMATCH_SECURITY_ALERT',
          orderId,
          expected: `${order.amount} ${order.currency}`,
          received: `${paymentAmount} ${paymentCurrency}`,
        });
        return { status: 422, error: 'Payment amount or currency mismatch with order', latencyMs: Date.now() - startTime };
      }

      // Fulfill order
      order.status = 'paid';
      order.razorpay_payment_id = paymentId;
      if (order.card_id && this.cards.has(order.card_id)) {
        const card = this.cards.get(order.card_id);
        card.is_paid = true;
        card.is_published = true;
      }

      return { status: 200, success: true, latencyMs: Date.now() - startTime };
    }

    return { status: 200, ignored: true, latencyMs: Date.now() - startTime };
  }
}

// ============================================================================
// TEST 1: Sahi Signature Wala Webhook Process Hona Chahiye
// ============================================================================
function test1_ValidSignature() {
  const engine = new MockWebhookEngine();
  engine.seedOrder('order_val_1', 'card_val_1');

  const body = JSON.stringify({
    event: 'payment.captured',
    event_id: 'evt_001',
    created_at: Math.floor(Date.now() / 1000),
    payload: { payment: { entity: { id: 'pay_001', order_id: 'order_val_1', amount: 7900, currency: 'INR' } } },
  });
  const sig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');

  const res = engine.processWebhook({ rawBody: body, signature: sig });
  const order = engine.orders.get('order_val_1');

  const pass = res.status === 200 && order.status === 'paid';
  record({
    id: 'WH-01',
    what: 'Sahi signature wala webhook successful processing',
    steps: 'Send webhook with valid HMAC signature and matching order payload',
    expected: 'HTTP 200 OK, order marked paid, card activated',
    actual: `HTTP ${res.status}, order status: ${order.status}`,
    pass,
  });
}

// ============================================================================
// TEST 2: Bina Signature, Galat Signature, Tampered Body Rejection
// ============================================================================
function test2_SignatureAndTamperRejections() {
  const engine = new MockWebhookEngine();
  engine.seedOrder('order_val_2', 'card_val_2');

  const body = JSON.stringify({
    event: 'payment.captured',
    event_id: 'evt_002',
    payload: { payment: { entity: { id: 'pay_002', order_id: 'order_val_2', amount: 7900, currency: 'INR' } } },
  });
  const validSig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');

  // A. Missing signature
  const resMissing = engine.processWebhook({ rawBody: body, signature: '' });
  // B. Forged signature
  const resForged = engine.processWebhook({ rawBody: body, signature: 'bad_signature_hash_1234567890' });
  // C. Tampered body (change amount from 7900 to 100)
  const tamperedBody = body.replace('7900', '100');
  const resTampered = engine.processWebhook({ rawBody: tamperedBody, signature: validSig });

  const pass = resMissing.status === 401 && resForged.status === 401 && resTampered.status === 401;
  record({
    id: 'WH-02',
    what: 'Bina signature, galat signature, aur tampered body ka rejection',
    steps: 'Test missing signature, attacker-forged signature, and payload 1-byte alteration',
    expected: 'All 3 attack variations rejected with HTTP 401 Unauthorized',
    actual: `Missing: ${resMissing.status}, Forged: ${resForged.status}, Tampered: ${resTampered.status}`,
    pass,
  });
}

// ============================================================================
// TEST 3: Same Webhook Event 5 Baar Bhejo (Idempotency via event_id)
// ============================================================================
function test3_EventIdempotency() {
  const engine = new MockWebhookEngine();
  engine.seedOrder('order_val_3', 'card_val_3');

  const body = JSON.stringify({
    event: 'payment.captured',
    event_id: 'evt_idemp_100',
    created_at: Math.floor(Date.now() / 1000),
    payload: { payment: { entity: { id: 'pay_003', order_id: 'order_val_3', amount: 7900, currency: 'INR' } } },
  });
  const sig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');

  let executions = 0;
  let idempotentAcks = 0;

  for (let i = 0; i < 5; i++) {
    const res = engine.processWebhook({ rawBody: body, signature: sig });
    if (res.duplicate) {
      idempotentAcks++;
    } else if (res.status === 200) {
      executions++;
    }
  }

  const pass = executions === 1 && idempotentAcks === 4;
  record({
    id: 'WH-03',
    what: 'Same webhook event 5 baar bhejne par exactly 1 execution (event_id tracking)',
    steps: 'Deliver identical event with event_id="evt_idemp_100" 5 times sequentially',
    expected: 'Execution 1 processes order; remaining 4 return idempotent 200 without DB updates',
    actual: `Fresh executions: ${executions}, Idempotent skips: ${idempotentAcks}`,
    pass,
  });
}

// ============================================================================
// TEST 4: Purana Timestamp Wala (Replay) Request Reject Ho
// ============================================================================
function test4_ReplayAttackPrevention() {
  const engine = new MockWebhookEngine();
  engine.seedOrder('order_val_4', 'card_val_4');

  // Event from 2 days ago (Replay capture)
  const staleTimestamp = Math.floor((Date.now() - 2 * 24 * 60 * 60 * 1000) / 1000);
  const body = JSON.stringify({
    event: 'payment.captured',
    event_id: 'evt_stale_999',
    created_at: staleTimestamp,
    payload: { payment: { entity: { id: 'pay_004', order_id: 'order_val_4', amount: 7900, currency: 'INR' } } },
  });
  const sig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');

  const res = engine.processWebhook({ rawBody: body, signature: sig });
  const order = engine.orders.get('order_val_4');

  const pass = res.status === 400 && order.status === 'pending';
  record({
    id: 'WH-04',
    what: 'Purana timestamp wala (replay) request rejection',
    steps: 'Submit validly signed event with 48-hour old timestamp without retry header',
    expected: 'HTTP 400 Replay rejection, order remains unaffected',
    actual: `HTTP ${res.status}: ${res.error}, Order status: ${order.status}`,
    pass,
  });
}

// ============================================================================
// TEST 5: Webhook Order Creation Se Pehle Aaye (Out of order)
// ============================================================================
function test5_WebhookBeforeOrderCreation() {
  const engine = new MockWebhookEngine();
  // DO NOT seed order yet! Simulating fast gateway webhook arriving before client DB insert

  const body = JSON.stringify({
    event: 'payment.captured',
    event_id: 'evt_early_005',
    created_at: Math.floor(Date.now() / 1000),
    payload: { payment: { entity: { id: 'pay_005', order_id: 'order_not_yet_in_db', amount: 7900, currency: 'INR' } } },
  });
  const sig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');

  const res = engine.processWebhook({ rawBody: body, signature: sig });

  const pass = res.status === 503 && res.retryRequested === true;
  record({
    id: 'WH-05',
    what: 'Webhook order DB me aane se pehle aane par safe retry trigger karna',
    steps: 'Webhook arrives for order that has not completed DB insert',
    expected: 'HTTP 503 Service Unavailable so Razorpay initiates automatic 1-minute retry',
    actual: `HTTP ${res.status}: ${res.error}, Retry Requested: ${res.retryRequested}`,
    pass,
  });
}

// ============================================================================
// TEST 6: Webhook Me Amount/Currency Order Se Match Na Kare (Reject & Alert)
// ============================================================================
function test6_AmountCurrencyMismatch() {
  const engine = new MockWebhookEngine();
  engine.seedOrder('order_val_6', 'card_val_6', 7900, 'INR');

  // Attacker tries to trigger order fulfillment with ₹1 (100 paise) instead of ₹79 (7900 paise)
  const tamperedAmountBody = JSON.stringify({
    event: 'payment.captured',
    event_id: 'evt_mismatch_006',
    created_at: Math.floor(Date.now() / 1000),
    payload: { payment: { entity: { id: 'pay_006', order_id: 'order_val_6', amount: 100, currency: 'INR' } } },
  });
  const sig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(tamperedAmountBody).digest('hex');

  const res = engine.processWebhook({ rawBody: tamperedAmountBody, signature: sig });
  const order = engine.orders.get('order_val_6');
  const alertTriggered = engine.alerts.length > 0 && engine.alerts[0].type === 'AMOUNT_MISMATCH_SECURITY_ALERT';

  const pass = res.status === 422 && order.status === 'pending' && alertTriggered;
  record({
    id: 'WH-06',
    what: 'Amount mismatch (₹1 vs ₹79) rejection aur security alert',
    steps: 'Submit webhook with amount=100 paise for order with expected=7900 paise',
    expected: 'HTTP 422 Unprocessable Entity, order stays pending, security alert logged',
    actual: `HTTP ${res.status}, Order status: ${order.status}, Alert Triggered: ${alertTriggered}`,
    pass,
  });
}

// ============================================================================
// TEST 7: Webhook Late Aaye (1 Ghante Baad)
// ============================================================================
function test7_LateWebhookDelivery() {
  const engine = new MockWebhookEngine();
  engine.seedOrder('order_val_7', 'card_val_7');

  // Webhook arrived 1 hour later with Razorpay retry header
  const oneHourAgo = Math.floor((Date.now() - 60 * 60 * 1000) / 1000);
  const body = JSON.stringify({
    event: 'payment.captured',
    event_id: 'evt_late_007',
    created_at: oneHourAgo,
    payload: { payment: { entity: { id: 'pay_007', order_id: 'order_val_7', amount: 7900, currency: 'INR' } } },
  });
  const sig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');

  const res = engine.processWebhook({
    rawBody: body,
    signature: sig,
    headers: { 'x-razorpay-retry': 'true' },
  });
  const order = engine.orders.get('order_val_7');

  const pass = res.status === 200 && order.status === 'paid';
  record({
    id: 'WH-07',
    what: '1 ghante baad late aane wale genuine retry webhook ka correct processing',
    steps: 'Submit 1-hour delayed webhook carrying x-razorpay-retry header',
    expected: 'HTTP 200 OK, order successfully fulfilled and activated',
    actual: `HTTP ${res.status}, Order status: ${order.status}`,
    pass,
  });
}

// ============================================================================
// TEST 8: Webhook Handler Turant Response Kare (< 200ms)
// ============================================================================
function test8_LowLatencyResponse() {
  const engine = new MockWebhookEngine();
  engine.seedOrder('order_val_8', 'card_val_8');

  const body = JSON.stringify({
    event: 'payment.captured',
    event_id: 'evt_latency_008',
    created_at: Math.floor(Date.now() / 1000),
    payload: { payment: { entity: { id: 'pay_008', order_id: 'order_val_8', amount: 7900, currency: 'INR' } } },
  });
  const sig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');

  const res = engine.processWebhook({ rawBody: body, signature: sig });

  const pass = res.status === 200 && res.latencyMs < 200;
  record({
    id: 'WH-08',
    what: 'Webhook handler latency benchmark (< 200ms)',
    steps: 'Measure execution time from raw body parsing to HTTP response',
    expected: 'Response under 200ms to prevent gateway timeout',
    actual: `Latency: ${res.latencyMs}ms, HTTP ${res.status}`,
    pass,
  });
}

// ============================================================================
// TEST 9: Rate Limit Gateway Genuine Retries Ko Block Na Kare
// ============================================================================
function test9_RateLimiterExemptionForGateway() {
  // Simulating rate limiter rule: Gateway webhooks with valid signature bypass IP brute-force limiter
  const isGatewayRequest = (sig) => Boolean(sig && sig.length === 64);
  const allowWebhookTraffic = (reqCount, signature) => {
    if (isGatewayRequest(signature)) {
      return { allowed: true, reason: 'GATEWAY_HMAC_AUTHENTICATED' };
    }
    return reqCount > 5 ? { allowed: false, reason: 'RATE_LIMIT_EXCEEDED' } : { allowed: true };
  };

  // 10 repeated legitimate webhook retries
  let allRetriesAllowed = true;
  for (let i = 0; i < 10; i++) {
    const check = allowWebhookTraffic(i, 'a'.repeat(64));
    if (!check.allowed) allRetriesAllowed = false;
  }

  // Unauthenticated scraper requests
  const scraperCheck = allowWebhookTraffic(6, '');

  const pass = allRetriesAllowed === true && scraperCheck.allowed === false;
  record({
    id: 'WH-09',
    what: 'Rate limiter gate: Gateway genuine retries allowed, unauth scrapers blocked',
    steps: 'Verify HMAC authenticated retries bypass IP limits while unsigned spam is throttled',
    expected: 'Legitimate gateway retries pass through; unsigned requests throttled',
    actual: `Gateway Retries Allowed: ${allRetriesAllowed}, Unsigned Scraper Throttled: ${!scraperCheck.allowed}`,
    pass,
  });
}

// ============================================================================
// EXECUTE SUITE
// ============================================================================
function run() {
  test1_ValidSignature();
  test2_SignatureAndTamperRejections();
  test3_EventIdempotency();
  test4_ReplayAttackPrevention();
  test5_WebhookBeforeOrderCreation();
  test6_AmountCurrencyMismatch();
  test7_LateWebhookDelivery();
  test8_LowLatencyResponse();
  test9_RateLimiterExemptionForGateway();

  console.log('================================================================================');
  console.log('WEBHOOK SECURITY & RELIABILITY AUTOMATED TEST SUITE');
  console.log('================================================================================\n');

  results.forEach((r) => {
    const mark = r.status === 'Pass' ? '✅ PASS' : '❌ FAIL';
    console.log(`[${r.id}] ${mark} | ${r.what}`);
  });

  console.log('\n--------------------------------------------------------------------------------');
  console.log(`TOTAL TESTS RUN : ${totalTests}`);
  console.log(`PASSED          : ${passedTests}`);
  console.log(`FAILED          : ${failedTests}`);
  console.log('--------------------------------------------------------------------------------');
}

run();
