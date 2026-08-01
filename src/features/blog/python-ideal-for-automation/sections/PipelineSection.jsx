import { CircleCheck, Quote } from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import { Callout } from "../components/Callout";

/* ── COMPLETE PIPELINE ────────────────── */
export function PipelineSection() {
  return (
    <>
      <h2 id="complete-pipeline">Complete Pipeline</h2>
      <p>
        Everything above comes together in a production-grade automation pipeline. This example runs every six hours: it fetches the top articles from two RSS feeds concurrently, summarises each one with GPT-4o-mini, stores the results in SQLite, and posts a digest to Slack — in under 90 lines.
      </p>

      <blockquote>
        <Quote className="w-5 h-5 text-indigo-400 mb-2" />
        This is the architecture that separates a script from a system. Every component is independently testable, every failure is logged, and the whole thing runs on a timer without anyone touching it.
      </blockquote>

      <CodeBlock
        filename="pipeline.py"
        note="Full automation: RSS → AI summary → SQLite → Slack digest (runs every 6 hours)"
        code={`"""
Full automation pipeline:
  RSS feeds → AI summaries → SQLite DB → Slack digest
"""
import asyncio, sqlite3, schedule, time, json
import aiohttp
from openai import OpenAI
from bs4 import BeautifulSoup
from datetime import datetime
import requests as req

client = OpenAI()
DB = sqlite3.connect("digest.db", check_same_thread=False)
DB.execute("""CREATE TABLE IF NOT EXISTS articles
    (id INTEGER PRIMARY KEY, title TEXT, summary TEXT, url TEXT, ts TEXT)""")

FEEDS        = ["https://hnrss.org/frontpage", "https://feeds.feedburner.com/PythonInsider"]
SLACK_HOOK   = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Step 1 — Fetch articles from multiple feeds concurrently
async def fetch_feed(session, url):
    async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as r:
        soup = BeautifulSoup(await r.text(), "xml")
    return [{"title": i.title.text.strip(), "url": i.link.text.strip()}
            for i in soup.find_all("item")[:8]]

async def fetch_all():
    async with aiohttp.ClientSession() as s:
        results = await asyncio.gather(*[fetch_feed(s, u) for u in FEEDS])
    return [item for feed in results for item in feed]

# Step 2 — Summarise with AI
def summarise(title: str) -> str:
    r = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Summarise in one sentence: {title}"}],
    )
    return r.choices[0].message.content.strip()

# Step 3 — Persist to SQLite
def save(title: str, summary: str, url: str):
    DB.execute("INSERT INTO articles (title,summary,url,ts) VALUES (?,?,?,?)",
               (title, summary, url, datetime.now().isoformat()))
    DB.commit()

# Step 4 — Post Slack digest
def send_digest():
    rows = DB.execute(
        "SELECT title,summary,url FROM articles ORDER BY id DESC LIMIT 5"
    ).fetchall()
    text = "*Python Automation Digest*\\n\\n"
    for title, summary, url in rows:
        text += f"*{title}*\\n{summary}\\n<{url}|Read more>\\n\\n"
    req.post(SLACK_HOOK, json={"text": text}, timeout=5)

# Orchestrate all steps
async def run_pipeline():
    print(f"[{datetime.now():%H:%M}] Pipeline running...")
    articles = await fetch_all()
    for art in articles:
        summary = summarise(art["title"])
        save(art["title"], summary, art["url"])
        print(f"  ✓ {art['title'][:55]}...")
    send_digest()
    print(f"  Digest sent — {len(articles)} articles processed.")

schedule.every(6).hours.do(lambda: asyncio.run(run_pipeline()))
asyncio.run(run_pipeline())   # run immediately on start

while True:
    schedule.run_pending()
    time.sleep(60)`}
      />

      <Callout color="#10b981" icon={CircleCheck}>
        This pipeline uses <strong>6 libraries</strong> from this guide together: aiohttp (async HTTP), BeautifulSoup (HTML parsing), OpenAI (AI summaries), sqlite3 (persistence), requests (Slack webhook), and schedule (recurring timer). Real automation is composition.
      </Callout>
    </>
  );
}
