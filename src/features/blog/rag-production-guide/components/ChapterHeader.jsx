import { DifficultyBadge } from "./DifficultyBadge";
import { TOC } from "../toc";

/* Sits directly under every chapter's <h2>. Carries the metadata that makes 87 chapters read
   as one navigable system rather than 87 separate posts: number, Part, difficulty, reading
   time, and — critically — links to whatever this chapter assumes you already know.
   Since chapters publish out of order (per toc.js), a dependency may not exist yet: this
   checks TOC itself, so a "depends on" link automatically lights up the moment that chapter
   is added — nothing here needs manual updating when an earlier chapter finally ships. */
export function ChapterHeader({ num, part, difficulty = "Beginner", time, depends = [], go, color = "#818cf8" }) {
  return (
    <div className="not-prose glass rounded-2xl px-5 py-4 mb-6 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ borderColor: `${color}30` }}>
      <span className="mono text-xs font-medium" style={{ color }}>Ch. {num}</span>
      <span className="mono text-xs text-slate-400">{part}</span>
      <DifficultyBadge level={difficulty} color={color} />
      <span className="mono text-xs text-slate-400">{time} read</span>
      {depends.length > 0 && (
        <span className="mono text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
          Depends on:
          {depends.map((d) => {
            const published = TOC.some((t) => t.id === d.id);
            return published ? (
              <button key={d.id} onClick={() => go(d.id)} className="text-indigo-300 hover:text-white transition-colors underline underline-offset-2">{d.label}</button>
            ) : (
              <span key={d.id} className="text-slate-500" title="Not yet published">{d.label} <span className="text-slate-600">(not yet published)</span></span>
            );
          })}
        </span>
      )}
    </div>
  );
}
