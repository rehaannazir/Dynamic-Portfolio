import { CodeBlock } from "../components/CodeBlock";

/* ── WEB & HTTP ───────────────────────── */
export function WebHttpSection() {
  return (
    <>
      <h2 id="web-http">Web & HTTP</h2>
      <p>
        Most real-world automation talks to the internet — fetching prices, calling APIs, checking uptime, posting to Slack, reading news feeds. Python's web libraries make this clean and reliable.
      </p>

      <h3>requests — Human-Friendly HTTP</h3>
      <p>
        <code>requests</code> is the most downloaded Python package of all time for a reason: it makes HTTP requests as readable as possible. <code>requests.get(url)</code> is literally the entire API for a basic fetch. Add <code>.raise_for_status()</code> to turn HTTP errors into exceptions, and wrap in a retry loop for production resilience.
      </p>
      <CodeBlock
        filename="requests_example.py"
        note="Resilient API fetch with exponential backoff retry"
        code={`import requests
from time import sleep

def get_with_retry(url: str, retries: int = 3) -> dict:
    for attempt in range(retries):
        try:
            r = requests.get(
                url, timeout=10,
                headers={"User-Agent": "AutoBot/1.0"}
            )
            r.raise_for_status()          # raise on 4xx / 5xx
            return r.json()
        except requests.RequestException as e:
            if attempt == retries - 1:
                raise                     # give up after last retry
            wait = 2 ** attempt           # 1s → 2s → 4s
            print(f"Attempt {attempt+1} failed ({e}), retrying in {wait}s")
            sleep(wait)

repo = get_with_retry("https://api.github.com/repos/python/cpython")
print(f"CPython stars: {repo['stargazers_count']:,}")`}
      />

      <h3>BeautifulSoup4 — HTML Parsing</h3>
      <p>
        Once you have the raw HTML from a page, <code>BeautifulSoup4</code> (imported as <code>bs4</code>) turns it into a navigable tree. You can find elements by tag, class, ID, or CSS selector, then extract text, attributes, or child nodes. Combined with <code>requests</code>, it is a complete lightweight scraper.
      </p>
      <CodeBlock
        filename="scraper.py"
        note="Scrape Hacker News headlines with requests + BeautifulSoup4"
        code={`import requests
from bs4 import BeautifulSoup

r = requests.get("https://news.ycombinator.com", timeout=10)
r.raise_for_status()

soup = BeautifulSoup(r.text, "html.parser")
headlines = soup.select(".titleline > a")

print(f"Top {len(headlines[:10])} Hacker News stories:\\n")
for i, tag in enumerate(headlines[:10], 1):
    title = tag.get_text(strip=True)
    href  = tag.get("href", "")
    print(f"  {i:2}. {title[:65]}")
    print(f"      → {href[:60]}")`}
      />
    </>
  );
}
