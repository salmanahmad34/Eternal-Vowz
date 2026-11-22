const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testOtpScreen() {
  const dir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });

  console.log('Navigating to live login page...');
  await page.goto('https://eternal-vowz.onrender.com/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  console.log('Typing test email...');
  await page.fill('input[type="email"]', 'mrsalman7307@gmail.com');

  console.log('Clicking Send Login Code...');
  await page.click('button:has-text("Send Login Code")');

  console.log('Waiting for OTP step screen...');
  await page.waitForSelector('input[inputmode="numeric"]', { timeout: 10000 });
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(dir, 'live_login_step2_otp_boxes.png') });
  console.log('Captured Step 2 OTP boxes screenshot!');

  await browser.close();
}

testOtpScreen().catch(console.error);
