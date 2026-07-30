import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

const outDir = "C:/Users/User/AppData/Local/Temp/claude/c--Users-User-Desktop-rehan-portfolio/a92ca595-760c-444a-b4e0-cd0450be37cc/scratchpad";

await page.goto("http://localhost:5174", { waitUntil: "networkidle" });
await page.screenshot({ path: `${outDir}/home-top.png` });

await page.evaluate(() => document.getElementById("about")?.scrollIntoView());
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/home-about.png` });

await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/home-contact.png` });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
