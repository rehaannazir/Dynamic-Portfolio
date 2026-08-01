import { CodeBlock } from "../components/CodeBlock";

/* ── DATABASES ────────────────────────── */
export function DatabasesSection() {
  return (
    <>
      <h2 id="databases">Databases</h2>
      <p>
        Automation often needs to persist state between runs — track which items have been processed, accumulate results over time, or look up reference data. Python&apos;s database libraries span from the built-in SQLite to enterprise ORMs.
      </p>

      <h3>sqlite3 — Zero-Config Persistent Storage</h3>
      <p>
        <code>sqlite3</code> is in Python&apos;s standard library and requires no server. The entire database is a single file. For automation jobs that run on a single machine and need to track state, SQLite is the simplest possible persistent layer.
      </p>
      <CodeBlock
        filename="sqlite_tracker.py"
        note="Use SQLite to track which items have already been processed"
        code={`import sqlite3
from datetime import datetime

conn = sqlite3.connect("automation.db")
conn.execute("""
    CREATE TABLE IF NOT EXISTS processed_items (
        id      INTEGER PRIMARY KEY,
        item_id TEXT UNIQUE,
        status  TEXT,
        ts      TEXT
    )
""")
conn.commit()

def mark_done(item_id: str, status: str = "ok"):
    conn.execute(
        "INSERT OR REPLACE INTO processed_items (item_id, status, ts) VALUES (?,?,?)",
        (item_id, status, datetime.now().isoformat()),
    )
    conn.commit()

def already_done(item_id: str) -> bool:
    row = conn.execute(
        "SELECT 1 FROM processed_items WHERE item_id=? AND status='ok'", (item_id,)
    ).fetchone()
    return row is not None

# In your automation loop:
items = ["article_001", "article_002", "article_003"]
for item in items:
    if already_done(item):
        print(f"  Skip: {item} already processed")
        continue
    # ... do work ...
    mark_done(item)
    print(f"  Done: {item}")`}
      />
    </>
  );
}
