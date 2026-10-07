const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000');
  
  console.log('Navigated to localhost:3000');
  
  // Wait for the "Student Portal" button (we can just find a button containing 'Student Portal')
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Student Portal'));
  });
  
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Student Portal')).click();
  });
  
  console.log('Clicked Student Portal');
  
  await page.waitForSelector('input[type="text"]', {timeout: 5000});
  await page.type('input[type="text"]', 'STU-2019');
  
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Login')).click();
  });
  
  console.log('Clicked Login, waiting for dashboard...');
  
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})().catch(console.error);
