import { memo } from "react";
import { Database } from "lucide-react";

/* Chapter 16's required diagram + animation, combined: the write path (upsert) and read path
   (query) of a generic vector store, with a document pulsing into the database on the write
   side — the "Database Glow" animation from the design system's inventory. */
export const VectorStoreArchitectureDiagram = memo(function VectorStoreArchitectureDiagram() {
  return (
    <div className="glass rounded-2xl p-6 my-8 relative overflow-hidden not-prose"
      role="img" aria-label="Vector store architecture: write path takes a chunk, embeds it, and upserts it into the index; read path takes a query, embeds it, and searches the index for nearest neighbors, both sharing one underlying store.">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="relative grid sm:grid-cols-2 gap-6">
        <div>
          <div className="mono text-[11px] text-slate-400 mb-2">write path (upsert)</div>
          <div className="flex items-center gap-2 flex-wrap">
            {["chunk", "embed", "upsert"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className="mono text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(59,130,246,0.14)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.25)" }}>{s}</span>
                {i < 2 && <span className="text-slate-600">→</span>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mono text-[11px] text-slate-400 mb-2">read path (query)</div>
          <div className="flex items-center gap-2 flex-wrap">
            {["query", "embed", "search"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className="mono text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(139,92,246,0.14)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.25)" }}>{s}</span>
                {i < 2 && <span className="text-slate-600">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative flex flex-col items-center mt-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
          background: "linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.25))",
          border: "1px solid rgba(139,92,246,0.4)",
          animation: "vpulse 2s ease-in-out infinite",
        }}>
          <Database className="w-6 h-6 text-indigo-300" />
        </div>
        <div className="mono text-[11px] text-slate-400 mt-2">shared index — stores vector + metadata + a pointer back to the source chunk</div>
      </div>
    </div>
  );
});
