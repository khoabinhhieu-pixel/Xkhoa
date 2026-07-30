import { chromium } from "playwright";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? ".";

async function scrollThrough(page) {
  const vpHeight = page.viewportSize()?.height ?? 900;
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < scrollHeight; y += vpHeight / 2) {
    await page.evaluate((yPos) => window.scrollTo(0, yPos), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

async function shoot(page, name) {
  await scrollThrough(page);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  console.log(`Saved ${name}.png`);
}

async function loginAs(page, email, password) {
  await page.goto(`${base}/login`, { waitUntil: "networkidle" });
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mật khẩu").fill(password);
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 10000,
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const uniqueEmail = `qa-${Date.now()}@fashionshop.vn`;
    await page.goto(`${base}/register`, { waitUntil: "networkidle" });
    await page.getByLabel("Họ và tên").fill("Người Dùng QA");
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("QaPass123");
    await page.getByLabel("Nhập lại mật khẩu").fill("QaPass123");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await page.waitForURL((url) => !url.pathname.startsWith("/register"), {
      timeout: 10000,
    });
    await shoot(page, "register-success-redirect");
    console.log(`Registered ${uniqueEmail}`);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${base}/login`, { waitUntil: "networkidle" });
    await shoot(page, "login-page");
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await loginAs(page, "demo@fashionshop.vn", "Demo123456");

    await page.goto(base, { waitUntil: "networkidle" });
    await shoot(page, "header-logged-in");

    await page.goto(`${base}/products/wool-overcoat`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await shoot(page, "pdp-desktop");

    await page.getByRole("button", { name: "5 sao", exact: true }).click();
    await page.getByLabel("Nhận xét").fill(
      "Chất liệu rất tốt, form áo chuẩn, sẽ ủng hộ thêm sản phẩm khác của shop.",
    );
    await page.getByRole("button", { name: "Gửi đánh giá" }).click();
    await page.waitForTimeout(600);
    await shoot(page, "pdp-review-submitted");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/products/wool-overcoat`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await shoot(page, "pdp-mobile");
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto(`${base}/account/wallet`, { waitUntil: "networkidle" });
    await shoot(page, "wallet-before-topup");
    await page.getByLabel("Số tiền nạp (VNĐ)").fill("5000000");
    await page.getByRole("button", { name: "Nạp tiền" }).click();
    await page.waitForTimeout(600);
    await shoot(page, "wallet-after-topup");

    await page.goto(`${base}/products/wool-overcoat`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
    await page.waitForTimeout(300);
    await page.goto(`${base}/checkout`, { waitUntil: "networkidle" });
    await page.getByLabel("Họ và tên").fill("Khách Demo");
    await page.getByLabel("Số điện thoại").fill("0901234567");
    await page.getByLabel("Email", { exact: true }).fill("demo@fashionshop.vn");
    await page.getByLabel("Địa chỉ").fill("123 Đường ABC");
    await page.getByLabel("Tỉnh / Thành phố").fill("TP. Hồ Chí Minh");
    await page.getByText("Ví Fashion Shop").click();
    await page.waitForTimeout(300);
    await shoot(page, "checkout-wallet-panel");
    await page.getByRole("button", { name: "Đặt hàng" }).click();
    await page.waitForTimeout(800);
    await shoot(page, "checkout-wallet-success");

    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await loginAs(page, "admin@fashionshop.vn", "Admin123456");

    await page.goto(`${base}/admin/products`, { waitUntil: "networkidle" });
    await shoot(page, "admin-products-list");

    const qaProductId = `qa-test-product-${Date.now()}`;
    await page.goto(`${base}/admin/products/new`, { waitUntil: "networkidle" });
    await page.getByLabel("Mã sản phẩm (slug)").fill(qaProductId);
    await page.getByLabel("Tên sản phẩm").fill("Áo test QA");
    await page.getByLabel("Giá (VNĐ)").fill("199000");
    await page.getByLabel("Danh mục").fill("Áo thun");
    await page.getByLabel("Tone ảnh (0-5)").fill("2");
    await page.getByLabel("Màu sắc (mã hex, cách nhau bởi dấu phẩy)").fill("#1a1a1a, #c9c2b3");
    await page.getByLabel("Mô tả").fill("Sản phẩm được tạo bởi script kiểm thử tự động.");
    await page.getByRole("button", { name: "Tạo sản phẩm" }).click();
    await page.waitForURL((url) => url.pathname === "/admin/products", { timeout: 10000 });
    await shoot(page, "admin-products-after-create");

    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await loginAs(page, "demo@fashionshop.vn", "Demo123456");
    await page.goto(`${base}/admin/products`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    console.log(`Customer visiting /admin/products landed on: ${page.url()}`);
    await shoot(page, "admin-blocked-for-customer");
    await context.close();
  }
} finally {
  await browser.close();
}
