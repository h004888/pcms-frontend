// E2E test for all dashboard screens
const puppeteer = require('puppeteer');

const DASHBOARD_URLS = [
  '/home',
  '/users',
  '/branches',
  '/medicines',
  '/categories',
  '/suppliers',
  '/inventory',
  '/customers',
  '/orders',
  '/prescriptions',
  '/notifications',
  '/payments',
  '/reports',
  '/search?q=test',
];

async function login(page) {
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', 'admin@pcms.vn');
  await page.type('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 });
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  let pass = 0, fail = 0;
  const failed = [];
  
  // Track API failures
  const apiCalls = new Map();
  page.on('response', (res) => {
    if (res.url().includes('localhost:8080')) {
      apiCalls.set(`${res.request().method()} ${res.url()}`, res.status());
    }
  });
  
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
  
  try {
    console.log('=== Logging in ===');
    await login(page);
    console.log('Logged in');
    
    for (const url of DASHBOARD_URLS) {
      apiCalls.clear();
      try {
        await page.goto(`http://localhost:3000${url}`, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(r => setTimeout(r, 1500)); // wait for late API calls
        
        const consoleErrors = await page.evaluate(() => {
          return window.__lastErrors || [];
        });
        
        // Check if page loaded (has main content)
        const hasContent = await page.evaluate(() => {
          return document.body.innerText.length > 100;
        });
        
        // Check API calls
        const apiResults = Array.from(apiCalls.entries()).map(([k, v]) => `${v} ${k}`);
        const apiErrors = apiResults.filter(r => r.startsWith('4') || r.startsWith('5'));
        
        if (hasContent && apiErrors.length === 0) {
          pass++;
          console.log(`✓ ${url} - ${apiCalls.size} API calls OK`);
        } else {
          fail++;
          failed.push(url);
          console.log(`✗ ${url} - errors: ${apiErrors.join(', ') || 'content too small'}`);
        }
      } catch (e) {
        fail++;
        failed.push(`${url}: ${e.message}`);
        console.log(`✗ ${url} - ${e.message.substring(0, 80)}`);
      }
    }
    
    console.log(`\n=== RESULTS ===`);
    console.log(`PASS: ${pass}/${DASHBOARD_URLS.length}`);
    console.log(`FAIL: ${fail}`);
    if (failed.length > 0) {
      console.log(`Failed: ${failed.join(', ')}`);
    }
  } finally {
    await browser.close();
  }
})();
