import { useMemo, useState } from "react";
import { Gauge, RotateCcw } from "lucide-react";

/* Chapter 6's interactive component (minimal version here; revisited in Chapter 8 alongside the
   formal cosine derivation). This is a REAL, client-side computation — not a lookup table — but
   it is honestly a toy: text is turned into a character-trigram frequency vector, not a real
   semantic embedding. The cosine similarity math applied to it is identical to what a genuine
   embedding model's output goes through, which is the actual teaching point: you can compute
   this yourself, right now, with nothing but the formula Chapter 8 derives. */
function trigramVector(text) {
  const t = text.toLowerCase().trim().replace(/\s+/g, " ");
  const grams = new Map();
  if (!t) return grams;
  const padded = `  ${t}  `;
  for (let i = 0; i < padded.length - 2; i++) {
    const g = padded.slice(i, i + 3);
    grams.set(g, (grams.get(g) || 0) + 1);
  }
  return grams;
}
function cosineSim(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (const v of a.values()) magA += v * v;
  for (const v of b.values()) magB += v * v;
  for (const [g, v] of a) if (b.has(g)) dot += v * b.get(g);
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

const PRESETS = [
  { a: "The cat sat on the mat", b: "A cat was sitting on a mat" },
  { a: "The cat sat on the mat", b: "Quarterly revenue exceeded forecasts" },
  { a: "cancellation policy", b: "how do I cancel my plan" },
];

export function EmbeddingPlayground() {
  const [textA, setTextA] = useState(PRESETS[0].a);
  const [textB, setTextB] = useState(PRESETS[0].b);
  const score = useMemo(() => cosineSim(trigramVector(textA), trigramVector(textB)), [textA, textB]);
  const pct = Math.max(0, Math.min(1, score));

  return (
    <div className="glass rounded-2xl p-5 my-8 not-prose">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-indigo-300" />
          <span className="mono text-xs text-slate-300">Embedding similarity playground</span>
        </div>
        <button onClick={() => { setTextA(PRESETS[0].a); setTextB(PRESETS[0].b); }}
          className="flex items-center gap-1.5 mono text-xs text-slate-400 hover:text-white transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> reset
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <input value={textA} onChange={(e) => setTextA(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm bg-black/40 text-slate-200 outline-none"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }} aria-label="First phrase" />
        <input value={textB} onChange={(e) => setTextB(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm bg-black/40 text-slate-200 outline-none"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Second phrase" />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => { setTextA(p.a); setTextB(p.b); }}
            className="mono text-[11px] px-2.5 py-1 rounded-full text-slate-400 hover:text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            example {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="mono text-[11px] text-slate-400">cosine similarity</span>
          <span className="mono text-sm font-semibold" style={{ color: "#a5b4fc" }}>{score.toFixed(3)}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", transition: "width 0.3s ease" }} />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 leading-relaxed">
        Honest disclosure: these aren't real semantic embeddings — they're built from overlapping 3-letter chunks of whatever you type, entirely in your browser. A real embedding model (Chapter 15, later in this book) would correctly score "cancellation policy" and "how do I cancel my plan" as close even though they share almost no substrings — this toy version can't do that. What <em>is</em> real: the cosine similarity formula being applied is exactly the one Chapter 8 derives, run on live data instead of a static example.
      </p>
    </div>
  );
}
