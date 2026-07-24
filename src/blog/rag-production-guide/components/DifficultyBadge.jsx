import { memo } from "react";

const LEVELS = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };

/* Reused in three places per the design system: the article hero, every ChapterHeader, and
   (later) the TOC entries — a 4-segment fill bar rather than a label alone, so difficulty is
   scannable at a glance across a book-length article. */
export const DifficultyBadge = memo(function DifficultyBadge({ level = "Beginner", color = "#818cf8" }) {
  const filled = LEVELS[level] || 1;
  return (
    <span className="inline-flex items-center gap-2" title={`Difficulty: ${level}`}>
      <span className="flex items-center gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="rounded-sm" style={{ width: 10, height: 4, background: i < filled ? color : `${color}26` }} />
        ))}
      </span>
      <span className="mono text-[11px]" style={{ color }}>{level}</span>
    </span>
  );
});
