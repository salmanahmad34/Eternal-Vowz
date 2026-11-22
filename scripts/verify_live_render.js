const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testLive() {
  const dir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });

  console.log('Visiting live homepage...');
  await page.goto('https://eternal-vowz.onrender.com', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(dir, 'live_homepage_no_rating.png') });

  console.log('Visiting live login page...');
  await page.goto('https://eternal-vowz.onrender.com/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(dir, 'live_login_email_otp.png') });

  await browser.close();
  console.log('Live screenshots captured!');
}

testLive().catch(console.error);
