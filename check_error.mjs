import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text(), msg.location().url));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  await page.goto('https://abhiramjammu.github.io/react-admin-dashboard-builder/');
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
