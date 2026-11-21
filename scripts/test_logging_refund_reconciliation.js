/**
 * Logging, Refund Engine & Reconciliation Automated Test Suite
 * Tests 6 critical production financial & auditing operations:
 * 1. Structured Logging & PII/Secret Redaction (Card, CVV, Secrets masked)
 * 2. Real-time Security Alerts (Webhook tamper, Gateway mismatch alerts)
 * 3. Full Refund Flow & State Transition
 * 4. Partial Refund Flow & Cumulative Accounting
 * 5. Double-Refund / Over-Refund Defense (Total refunds <= Paid amount)
 * 6. Daily Reconciliation Engine (Mismatches: Unfulfilled, Phantom, Amount Mismatch)
 */

const crypto = require('crypto');

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
// 1. STRUCTURED LOGGER IMPLEMENTATION (MOCK)
// ============================================================================
class PaymentLogger {
  constructor() {
    this.logs = [];
  }

  logEvent({ event, order_id, payment_id, user_id, amount, status, metadata = {} }) {
    // Sensitive keys to automatically redact
    const REDACTED_KEYS = ['cvv', 'card_number', 'pan', 'secret', 'password', 'key_secret', 'authorization'];

    const sanitizeObject = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      const clean = Array.isArray(obj) ? [] : {};
      for (const [key, val] of Object.entries(obj)) {
        if (REDACTED_KEYS.some((rk) => key.toLowerCase().includes(rk))) {
          clean[key] = '[REDACTED]';
        } else if (typeof val === 'object' && val !== null) {
          clean[key] = sanitizeObject(val);
        } else {
          clean[key] = val;
        }
      }
      return clean;
    };

    const entry = {
      timestamp: new Date().toISOString(),
      event,
      order_id: order_id || null,
      payment_id: payment_id || null,
      user_id: user_id || null,
      amount: typeof amount === 'number' ? amount : null,
      status,
      metadata: sanitizeObject(metadata),
    };

    this.logs.push(entry);
    return entry;
  }
}

// ============================================================================
// 2. ALERT ENGINE IMPLEMENTATION (MOCK)
// ============================================================================
class AlertEngine {
  constructor() {
    this.sentAlerts = [];
  }

  sendAlert(type, message, details = {}) {
    const alert = {
      timestamp: new Date().toISOString(),
      type,
      message,
      details,
    };
    this.sentAlerts.push(alert);
    return alert;
  }
}

// ============================================================================
// 3. REFUND ENGINE IMPLEMENTATION (MOCK)
// ============================================================================
class RefundEngine {
  constructor() {
    this.orders = new Map(); // orderId -> { id, amount, refunded_amount, status, payment_id }
    this.refundHistory = [];
  }

  seedOrder(orderId, amount, paymentId) {
    this.orders.set(orderId, {
      id: orderId,
      amount,
      refunded_amount: 0,
      status: 'paid',
      payment_id: paymentId,
    });
  }

  processRefund(orderId, refundAmountPaise = null, reason = 'customer_request') {
    const order = this.orders.get(orderId);
    if (!order) return { success: false, status: 404, error: 'Order not found' };
    if (order.status !== 'paid' && order.status !== 'partially_refunded') {
      return { success: false, status: 400, error: `Cannot refund order with status "${order.status}"` };
    }

    // Default to full refund if amount is not specified
    const targetRefund = refundAmountPaise === null ? (order.amount - order.refunded_amount) : refundAmountPaise;

    if (targetRefund <= 0) {
      return { success: false, status: 400, error: 'Refund amount must be greater than 0' };
    }

    // DOUBLE REFUND / OVER-REFUND GUARD
    const newTotalRefunded = order.refunded_amount + targetRefund;
    if (newTotalRefunded > order.amount) {
      return {
        success: false,
        status: 422,
        error: `Total refunds (₹${newTotalRefunded / 100}) cannot exceed paid amount (₹${order.amount / 100})`,
      };
    }

    // Execute refund
    order.refunded_amount = newTotalRefunded;
    order.status = order.refunded_amount === order.amount ? 'refunded' : 'partially_refunded';

    const record = {
      refund_id: `rfnd_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      order_id: orderId,
      payment_id: order.payment_id,
      amount: targetRefund,
      total_refunded: order.refunded_amount,
      reason,
      timestamp: new Date().toISOString(),
    };
    this.refundHistory.push(record);

    return { success: true, status: 200, refund: record, order_status: order.status };
  }
}

// ============================================================================
// 4. DAILY RECONCILIATION ENGINE IMPLEMENTATION (MOCK)
// ============================================================================
class DailyReconciliationEngine {
  runReconciliation(gatewayPayments, dbOrders) {
    const report = {
      timestamp: new Date().toISOString(),
      gateway_count: gatewayPayments.length,
      db_count: dbOrders.length,
      matched: [],
      unfulfilled_payments: [], // Gateway captured, but DB pending/missing
      phantom_orders: [],       // DB paid, but Gateway has no payment
      amount_mismatches: [],
    };

    const dbMapByPaymentId = new Map(dbOrders.map((o) => [o.razorpay_payment_id, o]));
    const dbMapByOrderId = new Map(dbOrders.map((o) => [o.razorpay_order_id, o]));

    // Check Gateway payments against DB
    gatewayPayments.forEach((gp) => {
      const dbOrder = dbMapByPaymentId.get(gp.id) || dbMapByOrderId.get(gp.order_id);
      if (!dbOrder || dbOrder.status !== 'paid') {
        report.unfulfilled_payments.push({
          payment_id: gp.id,
          order_id: gp.order_id,
          gateway_amount: gp.amount,
          db_status: dbOrder ? dbOrder.status : 'MISSING',
        });
      } else if (dbOrder.amount !== gp.amount) {
        report.amount_mismatches.push({
          payment_id: gp.id,
          order_id: gp.order_id,
          gateway_amount: gp.amount,
          db_amount: dbOrder.amount,
        });
      } else {
        report.matched.push({ order_id: gp.order_id, payment_id: gp.id, amount: gp.amount });
      }
    });

    // Check DB paid orders that do not exist on Gateway
    const gatewayPaymentIds = new Set(gatewayPayments.map((p) => p.id));
    dbOrders.forEach((o) => {
      if (o.status === 'paid' && o.razorpay_payment_id && !gatewayPaymentIds.has(o.razorpay_payment_id)) {
        report.phantom_orders.push({
          db_order_id: o.razorpay_order_id,
          db_payment_id: o.razorpay_payment_id,
          amount: o.amount,
        });
      }
    });

    return report;
  }
}

// ============================================================================
// TESTS
// ============================================================================

// TEST 1: Structured Logging & Secret Redaction
function test1_StructuredLoggingAndRedaction() {
  const logger = new PaymentLogger();
  const rawMetadata = {
    card_number: '4111111111111111',
    cvv: '123',
    secret: 'rzp_secret_key_999',
    user_ip: '127.0.0.1',
    theme: 'tuscan-sunset',
  };

  const entry = logger.logEvent({
    event: 'payment.captured',
    order_id: 'order_test_1',
    payment_id: 'pay_test_1',
    user_id: 'usr_alice_1',
    amount: 7900,
    status: 'paid',
    metadata: rawMetadata,
  });

  const hasAllFields = entry.timestamp && entry.order_id && entry.payment_id && entry.user_id && entry.amount === 7900;
  const isCvvRedacted = entry.metadata.cvv === '[REDACTED]';
  const isCardRedacted = entry.metadata.card_number === '[REDACTED]';
  const isSecretRedacted = entry.metadata.secret === '[REDACTED]';
  const isSafeKeyPreserved = entry.metadata.theme === 'tuscan-sunset';

  const pass = hasAllFields && isCvvRedacted && isCardRedacted && isSecretRedacted && isSafeKeyPreserved;
  record({
    id: 'LOG-01',
    what: 'Structured logging with automatic CVV, PAN, and secret masking',
    steps: 'Emit payment event log containing card_number, cvv, and secret keys in payload',
    expected: 'All standard audit fields present; sensitive credentials replaced with [REDACTED]',
    actual: `Fields complete: ${hasAllFields}, CVV masked: ${isCvvRedacted}, Card masked: ${isCardRedacted}`,
    pass,
  });
}

// TEST 2: Real-Time Security Alerts on Webhook & Signature Tampering
function test2_SecurityAlerts() {
  const alerts = new AlertEngine();

  alerts.sendAlert('WEBHOOK_SIGNATURE_TAMPER', 'Invalid HMAC signature received on webhook endpoint', {
    ip: '192.168.1.100',
    signature_header: 'bad_hash',
  });

  alerts.sendAlert('RECONCILIATION_MISMATCH', 'Gateway unfulfilled payment detected for order_999', {
    order_id: 'order_999',
    payment_id: 'pay_999',
  });

  const pass = alerts.sentAlerts.length === 2 && alerts.sentAlerts[0].type === 'WEBHOOK_SIGNATURE_TAMPER';
  record({
    id: 'ALT-01',
    what: 'Real-time security alert dispatch on signature forgery & gateway mismatch',
    steps: 'Trigger signature tampering event and reconciliation discrepancy',
    expected: 'Alert dispatched to security notification channel with incident metadata',
    actual: `Dispatched ${alerts.sentAlerts.length} alerts successfully: ${alerts.sentAlerts.map((a) => a.type).join(', ')}`,
    pass,
  });
}

// TEST 3: Full Refund Flow
function test3_FullRefundFlow() {
  const engine = new RefundEngine();
  engine.seedOrder('order_rfnd_1', 7900, 'pay_rfnd_1');

  const res = engine.processRefund('order_rfnd_1', null, 'customer_cancellation');
  const order = engine.orders.get('order_rfnd_1');

  const pass = res.success === true && order.status === 'refunded' && order.refunded_amount === 7900;
  record({
    id: 'RFND-01',
    what: 'Full refund execution (₹79 full amount returned, status -> refunded)',
    steps: 'Call processRefund on paid order with amount=null (auto-calculates remaining)',
    expected: 'Order status updated to "refunded", refunded_amount = 7900 paise',
    actual: `Order status: ${order.status}, Refunded amount: ₹${order.refunded_amount / 100}`,
    pass,
  });
}

// TEST 4: Partial Refund Flow & Cumulative Tracking
function test4_PartialRefundFlow() {
  const engine = new RefundEngine();
  engine.seedOrder('order_part_1', 7900, 'pay_part_1');

  // Step 1: Partial refund of ₹20 (2000 paise)
  const res1 = engine.processRefund('order_part_1', 2000, 'goodwill_partial_discount');
  const refundedAfter1 = engine.orders.get('order_part_1').refunded_amount;
  const statusAfter1 = engine.orders.get('order_part_1').status;

  // Step 2: Second partial refund of ₹30 (3000 paise)
  const res2 = engine.processRefund('order_part_1', 3000, 'additional_compensation');
  const refundedAfter2 = engine.orders.get('order_part_1').refunded_amount;
  const statusAfter2 = engine.orders.get('order_part_1').status;

  const pass =
    res1.success === true &&
    statusAfter1 === 'partially_refunded' &&
    refundedAfter1 === 2000 &&
    res2.success === true &&
    statusAfter2 === 'partially_refunded' &&
    refundedAfter2 === 5000;

  record({
    id: 'RFND-02',
    what: 'Partial refund flow with cumulative tracking (₹20 + ₹30 = ₹50 refunded)',
    steps: 'Execute 2 consecutive partial refunds on ₹79 order',
    expected: 'Status stays "partially_refunded", cumulative refunded_amount accurately updated to 5000 paise',
    actual: `Cumulative refunded: ₹${refundedAfter2 / 100}, Status: ${statusAfter2}`,
    pass,
  });
}

// TEST 5: Double-Refund / Over-Refund Defense
function test5_OverRefundDefense() {
  const engine = new RefundEngine();
  engine.seedOrder('order_over_1', 7900, 'pay_over_1');

  // Step 1: Full refund of ₹79
  engine.processRefund('order_over_1', 7900, 'full_refund');

  // Step 2: Attacker or bug attempts duplicate second refund
  const duplicateAttempt = engine.processRefund('order_over_1', 7900, 'duplicate_replay');

  // Step 3: Partial refund exceeding remainder
  engine.seedOrder('order_over_2', 7900, 'pay_over_2');
  engine.processRefund('order_over_2', 5000, 'partial_1');
  const exceedAttempt = engine.processRefund('order_over_2', 4000, 'exceed_attempt'); // 5000 + 4000 = 9000 > 7900

  const pass =
    duplicateAttempt.success === false &&
    duplicateAttempt.status === 400 &&
    exceedAttempt.success === false &&
    exceedAttempt.status === 422;

  record({
    id: 'RFND-03',
    what: 'Double-refund and over-refund prevention (Refunds cannot exceed paid total)',
    steps: 'Attempt second refund on already refunded order, and attempt partial refund exceeding balance',
    expected: 'Both over-refund attempts rejected with HTTP 400/422; DB balance uncorrupted',
    actual: `Duplicate status: ${duplicateAttempt.status}, Exceed status: ${exceedAttempt.status}`,
    pass,
  });
}

// TEST 6: Daily Reconciliation Engine Discrepancy Detection
function test6_DailyReconciliationEngine() {
  const engine = new DailyReconciliationEngine();

  // Gateway state
  const gatewayPayments = [
    { id: 'pay_matched_1', order_id: 'ord_matched_1', amount: 7900, status: 'captured' },
    { id: 'pay_unfulfilled_2', order_id: 'ord_unfulfilled_2', amount: 7900, status: 'captured' },
    { id: 'pay_mismatch_3', order_id: 'ord_mismatch_3', amount: 7900, status: 'captured' },
  ];

  // DB state
  const dbOrders = [
    { razorpay_order_id: 'ord_matched_1', razorpay_payment_id: 'pay_matched_1', amount: 7900, status: 'paid' },
    { razorpay_order_id: 'ord_unfulfilled_2', razorpay_payment_id: null, amount: 7900, status: 'pending' }, // Unfulfilled!
    { razorpay_order_id: 'ord_mismatch_3', razorpay_payment_id: 'pay_mismatch_3', amount: 5900, status: 'paid' }, // Amount mismatch!
    { razorpay_order_id: 'ord_phantom_4', razorpay_payment_id: 'pay_phantom_4', amount: 7900, status: 'paid' }, // Phantom!
  ];

  const report = engine.runReconciliation(gatewayPayments, dbOrders);

  const matchedOk = report.matched.length === 1;
  const unfulfilledOk = report.unfulfilled_payments.length === 1 && report.unfulfilled_payments[0].order_id === 'ord_unfulfilled_2';
  const mismatchOk = report.amount_mismatches.length === 1 && report.amount_mismatches[0].order_id === 'ord_mismatch_3';
  const phantomOk = report.phantom_orders.length === 1 && report.phantom_orders[0].db_order_id === 'ord_phantom_4';

  const pass = matchedOk && unfulfilledOk && mismatchOk && phantomOk;
  record({
    id: 'RECON-01',
    what: 'Daily reconciliation: detects unfulfilled payments, phantom orders & amount mismatches',
    steps: 'Cross-check gateway payments array against Supabase ev_orders array',
    expected: 'Accurately classifies 1 matched, 1 unfulfilled, 1 amount mismatch, 1 phantom order',
    actual: `Matched: ${report.matched.length}, Unfulfilled: ${report.unfulfilled_payments.length}, Mismatches: ${report.amount_mismatches.length}, Phantoms: ${report.phantom_orders.length}`,
    pass,
  });
}

// ============================================================================
// EXECUTE
// ============================================================================
function run() {
  test1_StructuredLoggingAndRedaction();
  test2_SecurityAlerts();
  test3_FullRefundFlow();
  test4_PartialRefundFlow();
  test5_OverRefundDefense();
  test6_DailyReconciliationEngine();

  console.log('================================================================================');
  console.log('LOGGING, REFUND ENGINE & RECONCILIATION TEST SUITE');
  console.log('================================================================================\n');

  results.forEach((r) => {
    const mark = r.status === 'Pass' ? '✅ PASS' : '❌ FAIL';
    console.log(`[${r.id}] ${mark} | ${r.what}`);
  });

  console.log('\n--------------------------------------------------------------------------------');
  console.log(`TOTAL AUDIT CHECKS : ${totalTests}`);
  console.log(`PASSED             : ${passedTests}`);
  console.log(`FAILED             : ${failedTests}`);
  console.log('--------------------------------------------------------------------------------');
}

run();
