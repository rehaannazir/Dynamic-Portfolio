import { CodeBlock } from "../components/CodeBlock";
import { BrowserDiagram } from "../components/BrowserDiagram";

/* ── BROWSER AUTOMATION ───────────────── */
export function BrowserAutomationSection() {
  return (
    <>
      <h2 id="browser-auto">Browser Automation</h2>
      <p>
        Not every website has an API. Some tasks — logging into a portal, filling a multi-step form, extracting data from a JavaScript-rendered page — require a real browser. Python has two leading solutions: the battle-tested Selenium and the modern, async Playwright.
      </p>

      <BrowserDiagram />

      <h3>Selenium — Classic Browser Automation</h3>
      <p>
        Selenium has been the browser automation standard since 2004. It controls Chrome, Firefox, Edge, and Safari through the WebDriver protocol. Its <code>WebDriverWait</code> + <code>expected_conditions</code> pattern elegantly handles dynamic pages that load content asynchronously.
      </p>
      <CodeBlock
        filename="selenium_login.py"
        note="Headless Chrome login + data extraction with Selenium"
        code={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument("--headless=new")   # invisible Chrome
opts.add_argument("--no-sandbox")
opts.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=opts)
wait   = WebDriverWait(driver, 15)

try:
    driver.get("https://example-portal.com/login")

    wait.until(EC.presence_of_element_located((By.ID, "email"))
               ).send_keys("user@company.com")
    driver.find_element(By.ID, "password").send_keys("securepass")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(EC.url_contains("/dashboard"))
    rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
    data = [r.text for r in rows]
    print(f"Extracted {len(data)} rows from dashboard")
finally:
    driver.quit()  # always close — even if an error occurs`}
      />

      <h3>Playwright — Modern Async Automation</h3>
      <p>
        Playwright (from Microsoft) was built with modern web apps in mind. It is async-first, which means you can run multiple browser sessions concurrently. Auto-waiting is built in — you do not need explicit waits for most actions. It supports Chromium, Firefox, and WebKit from a single API.
      </p>
      <CodeBlock
        filename="playwright_screenshots.py"
        note="Screenshot five sites simultaneously using async Playwright"
        code={`import asyncio
from playwright.async_api import async_playwright
from pathlib import Path

async def screenshot_sites(urls: list[str]):
    Path("screenshots").mkdir(exist_ok=True)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch()

        async def capture(url: str):
            page = await browser.new_page(
                viewport={"width": 1280, "height": 800}
            )
            await page.goto(url, wait_until="networkidle")
            name = url.split("//")[-1].split("/")[0]
            await page.screenshot(
                path=f"screenshots/{name}.png", full_page=True
            )
            await page.close()
            print(f"  ✓ {url}")

        # All 5 sites captured in parallel — far faster than sequential
        await asyncio.gather(*[capture(u) for u in urls])
        await browser.close()

asyncio.run(screenshot_sites([
    "https://github.com",
    "https://python.org",
    "https://fastapi.tiangolo.com",
    "https://docs.python.org",
    "https://pypi.org",
]))`}
      />
    </>
  );
}
