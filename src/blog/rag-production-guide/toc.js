// Each entry belongs to a Part (per the approved 87-chapter architecture). Only chapters that
// exist as written content go here — TocSidebar renders whatever this list currently contains,
// and ChapterHeader/ChapterPrevNext check membership here to decide whether a link is live or
// "not yet published". Chapters are added out of numeric order as they're written; the id must
// match the chapter's <h2 id="..."> anchor.
export const TOC = [
  { id: "history-of-ir", t: "History of Information Retrieval", part: "Part I — Foundations" },
  { id: "why-llms-hallucinate", t: "Why LLMs Hallucinate", part: "Part I — Foundations" },
  { id: "euclidean-distance", t: "Euclidean Distance", part: "Part II — Mathematical Foundations" },
];
