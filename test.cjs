const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    errors.push(`Console: ${msg.type().toUpperCase()} - ${msg.text()}`);
  });

  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}`);
  });

  try {
    await page.goto('http://localhost:5174/react-admin-dashboard-builder/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Check if we are on login page or dashboard
    let bodyText = await page.innerText('body');
    if (bodyText.includes('Welcome back') || bodyText.includes('User ID')) {
      await page.fill('input[type="text"]', 'testuser');
      await page.fill('input[type="password"]', 'password');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    }
    
    // Now take a screenshot
    await page.screenshot({ path: 'dashboard.png' });
    
    // Get body HTML
    const html = await page.innerHTML('body');
    fs.writeFileSync('dashboard.html', html);
    
    // Try to drag and drop
    const dragSource = await page.$('text="Stats Card"');
    const dropTarget = await page.$('.layout');
    
    if (dragSource && dropTarget) {
      const srcBox = await dragSource.boundingBox();
      const dstBox = await dropTarget.boundingBox();
      
      await page.mouse.move(srcBox.x + srcBox.width / 2, srcBox.y + srcBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(dstBox.x + 100, dstBox.y + 100, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'after_drop.png' });
    }
    
  } catch (err) {
    errors.push(`Script Error: ${err.message}`);
  }

  fs.writeFileSync('errors.log', errors.join('\n'));
  await browser.close();
})();
