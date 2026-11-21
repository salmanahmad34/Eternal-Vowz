const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  const screenshotDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('🚀 Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 mobile viewport
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  console.log('🌐 Navigating to http://localhost:3000/invite/sophia-alexander ...');
  await page.goto('http://localhost:3000/invite/sophia-alexander', { waitUntil: 'networkidle' });

  // Clear localStorage for a fresh test run
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch {}
  });

  // 1. Open Envelope
  console.log('✉️ Looking for wax seal to open envelope...');
  const seal = page.locator('button:has-text("Open"), [aria-label*="seal" i], div:has-text("OPEN"), button').first();
  if (await seal.count() > 0) {
    await seal.click({ force: true });
  } else {
    await page.mouse.click(195, 420);
  }

  // Wait for envelope animation to finish opening
  await page.waitForTimeout(1600);

  // 2. Scroll to Countdown Section
  console.log('⏳ Scrolling to Countdown section...');
  const countdownSection = page.locator('#card-section-countdown');
  await countdownSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Capture Screenshot 1: Covered Scratch Boxes
  const shot1 = path.join(screenshotDir, 'scratch_countdown_before.png');
  await page.screenshot({ path: shot1 });
  console.log('📸 Saved before scratch screenshot to:', shot1);

  // 3. Scratch each box sequentially (using .first() as scratched boxes unmount their canvas)
  console.log('✨ Starting sequential scratching...');
  let iteration = 0;
  while (iteration < 5) {
    const canvasCount = await page.locator('#card-section-countdown canvas').count();
    console.log(`Remaining scratch canvases: ${canvasCount}`);
    if (canvasCount === 0) break;

    const canvas = page.locator('#card-section-countdown canvas').first();
    const box = await canvas.boundingBox();
    if (!box) break;

    console.log(`Scratching canvas #${iteration + 1}...`);
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
    await page.mouse.down();
    for (let s = 0; s <= 10; s++) {
      const curX = box.x + (s % 2 === 0 ? box.width * 0.8 : box.width * 0.2);
      const curY = box.y + box.height * (0.2 + (s / 10) * 0.6);
      await page.mouse.move(curX, curY, { steps: 3 });
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(350);
    iteration++;
  }

  // 4. Wait for Party Popper Modal
  console.log('🎉 Waiting for Party Popper Celebration Modal...');
  await page.waitForSelector('text=Countdown Unlocked!', { timeout: 6000 });
  console.log('✅ Party Popper Modal appeared successfully!');

  await page.waitForTimeout(1000);

  // Capture Screenshot 2: Party Popper Modal
  const shot2 = path.join(screenshotDir, 'scratch_countdown_party_popup.png');
  await page.screenshot({ path: shot2 });
  console.log('📸 Saved Party Popper popup screenshot to:', shot2);

  // 5. Click "Close" on the Party Modal
  const closeBtn = page.locator('button:has-text("Close")').first();
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
    await page.waitForTimeout(600);
  }

  // Capture Screenshot 3: All 3 Unlocked Boxes
  const shot3 = path.join(screenshotDir, 'scratch_countdown_unlocked.png');
  await page.screenshot({ path: shot3 });
  console.log('📸 Saved Unlocked Boxes screenshot to:', shot3);

  console.log('🎯 All tests and visual screenshots completed successfully!');
  await browser.close();
}

run().catch((err) => {
  console.error('❌ Error executing verification script:', err);
  process.exit(1);
});
