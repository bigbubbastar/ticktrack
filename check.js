import { chromium } from 'playwright';

const URL = 'https://www.eventbrite.com/e/author-event-with-david-sedaris-tickets-1985098447895';
const SOLD_OUT_PHRASE = 'Sold out';

const browser = await chromium.launch();
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' });
const page = await ctx.newPage();

let allText = '';
try {
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(3000);

  const getTickets = page.getByRole('button', { name: /get tickets|tickets/i }).first();
  await getTickets.click({ timeout: 15_000 });
  await page.waitForTimeout(6000);

  allText = await page.evaluate(() => document.body.innerText);
  for (const f of page.frames()) {
    try { allText += '\n' + (await f.evaluate(() => document.body.innerText)); } catch {}
  }
} finally {
  await browser.close();
}

const stillSoldOut = allText.toLowerCase().includes(SOLD_OUT_PHRASE.toLowerCase());

if (stillSoldOut) {
  console.log(`[${new Date().toISOString()}] Still sold out.`);
  process.exit(0);
} else {
  console.log(`[${new Date().toISOString()}] "Sold out" NOT found — tickets may be available!`);
  console.log(`Check now: ${URL}`);
  process.exit(1);
}
