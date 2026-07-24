import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { MetricsTaxonomyDiagram } from "../components/MetricsTaxonomyDiagram";

/* ── CHAPTER 7 — DISTANCE METRICS ──────────────────────────
   Part II · Mathematical Foundations · Intermediate · 6 min · depends on Ch.6
   Survey chapter: no math derivation, no code, no interactive — those arrive per-metric in
   Ch.8-10. This chapter's job is taxonomy, not mechanism. */
export function DistanceMetricsSection({ go }) {
  return (
    <>
      <ChapterHeader num="07" part="Part II — Mathematical Foundations" difficulty="Intermediate" time="6 min"
        depends={[{ id: "embeddings", label: "Embeddings" }]} go={go} color="#8b5cf6" />
      <h2 id="distance-metrics">Distance Metrics</h2>

      <LearningGoalCard goals={[
        "Understand similarity and distance as inverse ways of asking the same question",
        "Build a taxonomy of \"closeness\" before learning any one formula",
        "Know why the choice of metric is a real production decision, not an implementation detail",
      ]} />

      <p>
        Chapter 6 made a claim three times without ever making it precise: a good embedding space places similar meanings close together. Close, how? "Distance" and "similarity" aren't one idea — they're a small family of related but genuinely different computations, each with different sensitivities, and conflating them is one of the most common sources of confusing, silently-wrong retrieval results. This chapter is the map before the next three chapters cover the territory in detail.
      </p>

      <h3>Similarity and distance are inverses</h3>
      <p>
        The two words point in opposite directions: high similarity means low distance, and vice versa. Some metrics are naturally phrased as similarity (cosine similarity, ranging from -1 to 1, higher is closer), others as distance (Euclidean distance, zero means identical, larger means farther apart). Vector databases and libraries mix both conventions, so knowing which direction a given number moves in is the first thing to check, not assume.
      </p>

      <h3>Not every "closeness" is the same kind of closeness</h3>
      <p>
        Three metrics dominate vector search, and each one asks a genuinely different geometric question about the same two vectors. <strong>Cosine similarity</strong> asks only about the <em>angle</em> between them — do they point the same direction, regardless of length? <strong>Dot product</strong> combines angle and magnitude into one raw number — the same idea as cosine, but without dividing out length. <strong>Euclidean distance</strong> asks how far apart the two points actually are in space — fully sensitive to both direction and magnitude. Applied to the same pair of vectors, these three can and do disagree, sometimes sharply — you'll see that disagreement made completely concrete in the Euclidean Distance chapter.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <MetricsTaxonomyDiagram />
      </Reveal>

      <p>
        This isn't academic. Every production vector database asks you, explicitly, which metric to index against — and it's usually a one-time, hard-to-change configuration choice made when the index is built, not something you can casually swap per query. Picking wrong doesn't throw an error. It just quietly returns results ranked by the wrong notion of "similar," which is a much harder bug to notice than a crash.
      </p>

      <Callout icon={X} color="#f59e0b">
        Common mistake: treating metric choice as a minor implementation detail to accept the library default on. It isn't — it's a decision about what "similar" is even going to mean for your entire retrieval system, and getting it wrong produces plausible-looking, silently-wrong rankings rather than an obvious failure.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"Name three distance metrics used in vector search and one situation where the choice matters."</strong> Cosine similarity, dot product, and Euclidean distance. A concrete situation: comparing two text embeddings of very different lengths — cosine similarity ignores the length difference (measuring direction only), while Euclidean distance is fully sensitive to it and can rank the same two documents as much less similar purely because one is longer.
      </p>

      <Quiz
        question="Similarity and distance move in which relationship to each other?"
        options={["The same direction — both increase together", "Inverse — higher similarity means lower distance", "They're unrelated concepts"]}
        correct={1}
        explain="Similarity and distance are two ways of describing the same underlying geometric relationship, just pointed in opposite directions: as two vectors get closer together (distance shrinks), they typically get more similar (similarity grows)."
      />

      <SummaryCard points={[
        "Similarity and distance are inverse framings of the same underlying geometric relationship.",
        "Cosine similarity, dot product, and Euclidean distance ask three genuinely different questions about the same two vectors, and can disagree.",
        "Metric choice is a real, often hard-to-change production configuration decision — not a detail to default past.",
      ]} />

      <p>
        With the taxonomy in place, it's time to make the first and most common of these three precise — starting with the one that ignores length entirely and asks only about direction: cosine similarity.
      </p>

      <ChapterPrevNext
        prev={{ id: "embeddings", title: "Embeddings" }}
        next={{ id: "cosine-similarity", title: "Cosine Similarity" }}
        go={go}
      />
    </>
  );
}
