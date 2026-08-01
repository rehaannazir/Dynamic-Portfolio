import { useMemo, useState } from "react";
import { Scissors, RotateCcw } from "lucide-react";

/* Chapter 14's interactive (and animation, per the pattern of combining requirements into one
   real asset): drag chunk size and overlap, watch a real sample paragraph re-chunk live using
   plain fixed-size character chunking. This is genuinely computed from the slider values on
   every change, not a canned before/after pair. */
const SAMPLE = "Retrieval-augmented generation pairs a search step with a generation step. First the system retrieves the passages most relevant to a query, then a language model reads those passages and composes an answer. This avoids relying purely on what the model memorized during training, which may be outdated or simply wrong.";

function chunkText(text, size, overlap) {
  const chunks = [];
  let start = 0;
  const step = Math.max(1, size - overlap);
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push({ start, end, text: text.slice(start, end) });
    if (end >= text.length) break;
    start += step;
  }
  return chunks;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#f472b6", "#10b981", "#f59e0b", "#38bdf8"];

export function ChunkingPlayground() {
  const [size, setSize] = useState(80);
  const [overlap, setOverlap] = useState(15);
  const chunks = useMemo(() => chunkText(SAMPLE, size, overlap), [size, overlap]);

  return (
    <div className="glass rounded-2xl p-5 my-8 not-prose">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-indigo-300" />
          <span className="mono text-xs text-slate-300">Chunking playground</span>
        </div>
        <button onClick={() => { setSize(80); setOverlap(15); }} className="flex items-center gap-1.5 mono text-xs text-slate-400 hover:text-white transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> reset
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div>
          <div className="flex justify-between mono text-[11px] text-slate-400 mb-1"><span>chunk size</span><span>{size} chars</span></div>
          <input type="range" min={30} max={200} step={5} value={size}
            onChange={(e) => { const v = Number(e.target.value); setSize(v); if (overlap >= v) setOverlap(Math.max(0, v - 5)); }}
            className="w-full accent-indigo-400" />
        </div>
        <div>
          <div className="flex justify-between mono text-[11px] text-slate-400 mb-1"><span>overlap</span><span>{overlap} chars</span></div>
          <input type="range" min={0} max={Math.max(0, size - 5)} step={5} value={overlap}
            onChange={(e) => setOverlap(Number(e.target.value))}
            className="w-full accent-indigo-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {chunks.map((c, i) => {
          const prevOverlapLen = i > 0 ? Math.max(0, chunks[i - 1].end - c.start) : 0;
          const shared = c.text.slice(0, prevOverlapLen);
          const rest = c.text.slice(prevOverlapLen);
          const col = COLORS[i % COLORS.length];
          return (
            <div key={i} className="rounded-lg px-3 py-2" style={{ background: `${col}12`, border: `1px solid ${col}38` }}>
              <div className="mono text-[10px] mb-1" style={{ color: col }}>chunk {i + 1} · {c.text.length} chars</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {shared && <span style={{ background: "rgba(245,158,11,0.28)", color: "#fbbf24", borderRadius: 3 }}>{shared}</span>}
                {rest}
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 mt-4">{chunks.length} chunks from one paragraph. Amber-highlighted text is the overlap carried over from the previous chunk. Drag overlap to 0 and watch context vanish at every boundary.</p>
    </div>
  );
}
