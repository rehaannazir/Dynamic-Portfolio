/* ─────────────────────────────────────────────────────────
   FLOATING CODE DECORATION
───────────────────────────────────────────────────────── */
export function FloatingCode() {
  const snippets = [
    { code: "import requests", top: "12%", left: "3%", delay: 0 },
    { code: "df.groupby('cat')", top: "22%", right: "4%", delay: 0.6 },
    { code: "await asyncio.gather(*tasks)", top: "72%", left: "2%", delay: 1.0 },
    { code: "schedule.every(1).hours.do(job)", top: "78%", right: "3%", delay: 0.3 },
    { code: "driver.find_element(By.ID,'btn')", top: "45%", left: "1%", delay: 0.8 },
    { code: "client.chat.completions.create()", top: "55%", right: "2%", delay: 0.4 },
  ];
  return (
    <>
      {snippets.map((s, i) => (
        <div key={i} className="absolute hidden lg:block pointer-events-none mono text-[11px] text-indigo-300/35 whitespace-nowrap rounded-lg px-3 py-1.5"
          style={{
            top: s.top, left: s.left, right: s.right,
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.12)",
            animation: `cardFloat ${4 + i * 0.5}s ease-in-out ${s.delay}s infinite`,
          }}>
          {s.code}
        </div>
      ))}
    </>
  );
}
