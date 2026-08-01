import { memo } from "react";

/* Chapter 15's required diagram: a comparison matrix of embedding model trade-offs — the
   practical decision this chapter is actually about. Illustrative figures, clearly labeled as
   such — real numbers change constantly and this book isn't the place to chase them. */
const MODELS = [
  { name: "Small general model", dim: "384", cost: "$", domain: "Broad, mediocre on jargon" },
  { name: "Large general model", dim: "1536", cost: "$$$", domain: "Broad, strong across domains" },
  { name: "Domain-specific model", dim: "768", cost: "$$", domain: "Excellent in-domain, weak outside it" },
];

export const EmbeddingModelMatrix = memo(function EmbeddingModelMatrix() {
  return (
    <div className="glass rounded-2xl p-5 my-8 overflow-x-auto not-prose"
      role="img" aria-label="Comparison of embedding model archetypes across dimensionality, relative cost, and domain fit — illustrative figures for the trade-off, not a live pricing table.">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <th className="text-left text-slate-400 mono text-xs font-normal pb-2">Model type</th>
            <th className="text-left text-slate-400 mono text-xs font-normal pb-2">Dimensions</th>
            <th className="text-left text-slate-400 mono text-xs font-normal pb-2">Relative cost</th>
            <th className="text-left text-slate-400 mono text-xs font-normal pb-2">Domain fit</th>
          </tr>
        </thead>
        <tbody>
          {MODELS.map((m) => (
            <tr key={m.name} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <td className="py-2.5 text-white text-sm">{m.name}</td>
              <td className="py-2.5 mono text-xs text-indigo-300">{m.dim}</td>
              <td className="py-2.5 mono text-xs text-amber-300">{m.cost}</td>
              <td className="py-2.5 text-xs text-slate-400">{m.domain}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-500 mt-3">Illustrative archetypes, not specific product benchmarks — actual pricing and quality shift too often to print reliably. The trade-off shape is what matters.</p>
    </div>
  );
});
