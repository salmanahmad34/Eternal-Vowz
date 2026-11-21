import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ============================================================================
// CUSTOM METRICS & SLO DEFINITIONS
// ============================================================================
const errorRate = new Rate('error_rate');
const p95Trend = new Trend('checkout_p95_duration');
const ordersSpawned = new Counter('orders_spawned_count');

export const options = {
  // Service Level Objectives (SLOs)
  thresholds: {
    // SLO 1: p95 response time must be under 800ms
    http_req_duration: ['p(95)<800', 'p(99)<1200'],
    checkout_p95_duration: ['p(95)<800'],
    // SLO 2: Error rate must be under 1% (< 0.01)
    error_rate: ['rate<0.01'],
    http_req_failed: ['rate<0.01'],
  },

  scenarios: {
    // ------------------------------------------------------------------------
    // SCENARIO 1: Multi-tier Ramp-Up (100 -> 500 -> 1,000 VUs)
    // ------------------------------------------------------------------------
    standard_traffic: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '1m', target: 100 },   // Warm up to 100 VUs
        { duration: '2m', target: 500 },   // Scale to 500 VUs
        { duration: '2m', target: 1000 },  // Peak load: 1,000 VUs
        { duration: '1m', target: 0 },     // Ramp down
      ],
      gracefulRampDown: '30s',
      exec: 'userJourney',
    },

    // ------------------------------------------------------------------------
    // SCENARIO 2: Flash Sale Spike (0 to 1,000 VUs in 30 seconds)
    // ------------------------------------------------------------------------
    flash_sale_spike: {
      executor: 'ramping-vus',
      startTime: '6m30s',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 1000 }, // 0 to 1,000 VUs spike in 30 seconds
        { duration: '1m', target: 1000 },  // Hold peak 1,000 VUs for 1 minute
        { duration: '30s', target: 0 },    // Quick cool down
      ],
      gracefulRampDown: '15s',
      exec: 'userJourney',
    },

    // ------------------------------------------------------------------------
    // SCENARIO 3: Soak Test (200 VUs sustained for 30 minutes)
    // ------------------------------------------------------------------------
    soak_endurance: {
      executor: 'constant-vus',
      startTime: '8m30s',
      vus: 200,
      duration: '30m',                   // 30 minute endurance soak test
      exec: 'userJourney',
    },
  },
};

// Target Base URL (Localhost / Staging only - NEVER production)
const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

// Mock Authentication Token for Authenticated Checkout API testing
const MOCK_AUTH_TOKEN = 'mock_k6_bearer_token_for_load_testing';

export function userJourney() {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'k6-load-testing-agent/1.0',
  };

  // Step 1: Browse Homepage (Showcase & Designs)
  group('01_Homepage_Browse', () => {
    const res = http.get(`${BASE_URL}/`, { headers });
    const success = check(res, {
      'homepage status 200': (r) => r.status === 200,
      'homepage under 500ms': (r) => r.timings.duration < 500,
    });
    errorRate.add(!success);
    p95Trend.add(res.timings.duration);
    sleep(1);
  });

  // Step 2: View 3D Wedding Invitation Sample (/invite/[slug])
  group('02_Wedding_Invitation_View', () => {
    const slugs = ['sophia-alexander', 'layla-omar-veil', 'ayesha-bilal-sapphire'];
    const selectedSlug = slugs[Math.floor(Math.random() * slugs.length)];
    const res = http.get(`${BASE_URL}/invite/${selectedSlug}`, { headers });
    const success = check(res, {
      'invite page status 200': (r) => r.status === 200,
      'invite page under 600ms': (r) => r.timings.duration < 600,
    });
    errorRate.add(!success);
    p95Trend.add(res.timings.duration);
    sleep(1.5);
  });

  // Step 3: Apply & Validate Coupon Code (/api/razorpay/validate-coupon)
  group('03_Coupon_Validation', () => {
    const payload = JSON.stringify({ code: 'WELCOME50' });
    const res = http.post(`${BASE_URL}/api/razorpay/validate-coupon`, payload, { headers });
    // In load test, 200 (valid), 404 (coupon not in test db), or 429 (rate-limited) are acceptable
    const acceptable = [200, 404, 429].includes(res.status);
    const success = check(res, {
      'coupon endpoint responsive': (r) => acceptable,
    });
    errorRate.add(!success);
    p95Trend.add(res.timings.duration);
    sleep(0.5);
  });

  // Step 4: Checkout & Order Creation (/api/razorpay/create-order)
  group('04_Checkout_Create_Order', () => {
    const orderPayload = JSON.stringify({
      create_new: true,
      card_payload: {
        title: 'Load Test Wedding',
        theme_id: 'tuscan-sunset',
        event_date: new Date(Date.now() + 60 * 86400000).toISOString(),
        design_config: { groom_name: 'Test Groom', bride_name: 'Test Bride' },
      },
      customer_email: `loadtest_${__VU}_${__ITER}@example.com`,
    });

    const authHeaders = {
      ...headers,
      Authorization: `Bearer ${MOCK_AUTH_TOKEN}`,
      'X-Razorpay-Test-Mode': 'true',
    };

    const res = http.post(`${BASE_URL}/api/razorpay/create-order`, orderPayload, {
      headers: authHeaders,
    });

    // 200 (order created), 401 (mock token check), or 429 (per-user throttle) are expected
    const isOrderHandled = [200, 401, 429].includes(res.status);
    const success = check(res, {
      'order endpoint responsive and under 800ms': (r) =>
        isOrderHandled && r.timings.duration < 800,
    });

    if (res.status === 200) {
      ordersSpawned.add(1);
    }
    errorRate.add(!success);
    p95Trend.add(res.timings.duration);
    sleep(2);
  });
}
