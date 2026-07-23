import { Reveal } from "@/lib/motion";
import { CodeBlock } from "../components/CodeBlock";

/* ── ASYNC ────────────────────────────── */
export function AsyncSection() {
  return (
    <>
      <h2 id="async-concurrency">Async & Concurrency</h2>
      <p>
        Sequential code is fine for a single task. But real automation often needs to do many things at once: fetch 50 API endpoints simultaneously, process files in parallel, or handle incoming webhook events without blocking. Python offers three concurrency models.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <div className="not-prose grid sm:grid-cols-3 gap-3 my-6">
          {[
            { title: "asyncio", sub: "I/O-bound tasks", desc: "Fetch 50 APIs in the time it would take to fetch one. Perfect for anything that waits on network or disk.", col: "#6366f1" },
            { title: "threading", sub: "Concurrent I/O", desc: "Multiple threads share one CPU. Good for I/O-bound work when asyncio isn't an option (e.g., blocking SDKs).", col: "#3b82f6" },
            { title: "multiprocessing", sub: "CPU-bound tasks", desc: "Parallel processes bypass Python's GIL. Use for image processing, data crunching, or heavy computation.", col: "#8b5cf6" },
          ].map(({ title, sub, desc, col }) => (
            <div key={title} className="glass rounded-xl p-4">
              <div className="font-semibold text-white text-sm mb-0.5">{title}</div>
              <div className="mono text-[10px] mb-2" style={{ color: col }}>{sub}</div>
              <p className="text-xs text-slate-400 leading-relaxed m-0">{desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <CodeBlock
        filename="async_fetch.py"
        note="Fetch 50 API endpoints simultaneously with asyncio + aiohttp"
        code={`import asyncio
import aiohttp
import time

async def fetch_user(session: aiohttp.ClientSession, uid: int) -> dict:
    url = f"https://jsonplaceholder.typicode.com/users/{uid}"
    async with session.get(url) as resp:
        return await resp.json()

async def fetch_all(uids: list[int]) -> list[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_user(session, uid) for uid in uids]
        return await asyncio.gather(*tasks)  # all at once

# Sequential would take ~15s (50 × 300ms each)
# Async takes ~300ms total — all requests in flight simultaneously
t0 = time.perf_counter()
users = asyncio.run(fetch_all(range(1, 51)))
elapsed = time.perf_counter() - t0

print(f"Fetched {len(users)} users in {elapsed:.2f}s")
for u in users[:3]:
    print(f"  {u['name']:25} | {u['email']}")`}
      />
    </>
  );
}
