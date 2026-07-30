import { chromium } from "playwright";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? ".";

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function scrollThrough(page, vpHeight) {
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < scrollHeight; y += vpHeight / 2) {
    await page.evaluate((yPos) => window.scrollTo(0, yPos), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

async function addFirstItemToCart(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Thêm vào giỏ" }).first().click();
  await page.waitForTimeout(200);
}

async function shot(name, url, width, height, fn) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(200);
  if (fn) await fn(page);
  else await scrollThrough(page, height);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  console.log(`Saved ${name}.png`);
  await page.close();
}

await shot("home-desktop", base, 1440, 900);
await shot("home-mobile", base, 390, 844);

await shot("cart-drawer", base, 1440, 900, async (page) => {
  await addFirstItemToCart(page);
  await page.waitForTimeout(400);
});

await shot("search-overlay", base, 1440, 900, async (page) => {
  await page.getByLabel("Tìm kiếm").click();
  await page.waitForTimeout(300);
  await page.keyboard.type("áo");
  await page.waitForTimeout(300);
});

await shot("login", `${base}/login`, 1440, 900, async (page) => page.waitForTimeout(300));
await shot("register", `${base}/register`, 1440, 900, async (page) => page.waitForTimeout(300));

await shot("products-all", `${base}/products`, 1440, 900);
await shot("products-nam", `${base}/products?gender=nam`, 1440, 900);
await shot("products-nu", `${base}/products?gender=nu`, 1440, 900);
await shot("products-mobile", `${base}/products`, 390, 844);

await shot("cart-page", `${base}/cart`, 1440, 900, async (page) => {
  await page.goto(base, { waitUntil: "networkidle" });
  await addFirstItemToCart(page);
  await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
});

await shot("checkout-cod", `${base}/checkout`, 1440, 900, async (page) => {
  await page.goto(base, { waitUntil: "networkidle" });
  await addFirstItemToCart(page);
  await page.goto(`${base}/checkout`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
});

await shot("checkout-bank", `${base}/checkout`, 1440, 900, async (page) => {
  await page.goto(base, { waitUntil: "networkidle" });
  await addFirstItemToCart(page);
  await page.goto(`${base}/checkout`, { waitUntil: "networkidle" });
  await page.getByText("Chuyển khoản ngân hàng").click();
  await page.waitForTimeout(400);
});

await shot("checkout-card", `${base}/checkout`, 1440, 900, async (page) => {
  await page.goto(base, { waitUntil: "networkidle" });
  await addFirstItemToCart(page);
  await page.goto(`${base}/checkout`, { waitUntil: "networkidle" });
  await page.getByText("Thẻ tín dụng / ghi nợ").click();
  await page.waitForTimeout(400);
});

await shot("header-mobile", base, 390, 200, async () => {});

await browser.close();
