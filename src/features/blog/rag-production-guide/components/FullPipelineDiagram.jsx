import { memo } from "react";

/* Chapter 20's capstone diagram — the complete pipeline map referenced throughout Part III,
   shown in full for the first time: an offline row (build the index) and an online row
   (answer a query), sharing the vector store in the middle. */
const OFFLINE = [
  { label: "Documents", ch: "13", col: "#3b82f6" },
  { label: "Chunk", ch: "14", col: "#3b82f6" },
  { label: "Embed", ch: "15", col: "#3b82f6" },
  { label: "Store", ch: "16", col: "#3b82f6" },
];
const ONLINE = [
  { label: "Query", ch: "17", col: "#8b5cf6" },
  { label: "Retrieve", ch: "17", col: "#8b5cf6" },
  { label: "Prompt", ch: "18", col: "#8b5cf6" },
  { label: "Generate", ch: "19", col: "#8b5cf6" },
];

function Row({ steps, tag }) {
  return (
    <div>
      <div className="mono text-[11px] text-slate-400 mb-2">{tag}</div>
      <div className="flex items-center gap-2 flex-wrap">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="rounded-lg px-3 py-2" style={{ background: `${s.col}18`, border: `1px solid ${s.col}38` }}>
              <div className="text-white font-medium text-xs">{s.label}</div>
              <div className="mono text-[10px]" style={{ color: s.col + "cc" }}>Ch. {s.ch}</div>
            </div>
            {i < steps.length - 1 && <span className="text-slate-600">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export const FullPipelineDiagram = memo(function FullPipelineDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 relative overflow-hidden not-prose"
      role="img" aria-label="The complete RAG pipeline: an offline path building the index from documents through chunking, embedding, and storage, and an online path answering a query through retrieval, prompt construction, and generation — sharing the same vector store.">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="relative flex flex-col gap-5">
        <Row steps={OFFLINE} tag="offline — build the index, once per document" />
        <div className="flex justify-center" aria-hidden="true">
          <div className="w-px h-4" style={{ background: "linear-gradient(180deg,#3b82f6,#8b5cf6)" }} />
        </div>
        <Row steps={ONLINE} tag="online — answer a query, every request" />
      </div>
    </div>
  );
});
