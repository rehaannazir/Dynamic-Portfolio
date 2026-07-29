import { Sparkles, X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { DistanceConcentrationDiagram } from "../components/DistanceConcentrationDiagram";

/* ── CHAPTER 11 — HIGH-DIMENSIONAL SPACE ───────────────────
   Part II · Mathematical Foundations · Intermediate · 8 min · depends on Ch.10
   No code required per spec — conceptual chapter. */
export function HighDimensionalSpaceSection({ go }) {
  return (
    <>
      <ChapterHeader num="11" part="Part II — Mathematical Foundations" difficulty="Intermediate" time="8 min"
        depends={[{ id: "euclidean-distance", label: "Euclidean Distance" }]} go={go} color="#8b5cf6" />
      <h2 id="high-dimensional-space">High-Dimensional Space</h2>

      <LearningGoalCard goals={[
        "Explain the curse of dimensionality in plain language",
        "Understand why 2D and 3D intuition about distance quietly breaks down at real embedding dimensionality",
        "Recognize why this specific problem is what motivates approximate search, covered next",
      ]} />

      <p>
        Every diagram in the last three chapters showed you two numbers and an arrow. That was a deliberate simplification, and it's time to be explicit about where it stops holding. A real text embedding isn't 2-dimensional — it's commonly 384, 768, or 1536 dimensions. The formulas from Chapters 8 through 10 work identically at that scale. Your intuition about what "distance" and "closeness" mean does not.
      </p>

      <h3>The curse of dimensionality</h3>
      <p>
        Here's the effect, stated plainly: as the number of dimensions grows, the distance between randomly chosen points stops varying much. In two or three dimensions, some pairs of random points are close and some are far — a wide, informative spread, exactly like the histograms below. Push the same random points into a few hundred dimensions, and nearly every pair ends up roughly the same distance apart. The spread collapses. This is called <strong>distance concentration</strong>, and it's the mathematical content behind the phrase "curse of dimensionality."
      </p>

      <Reveal variant="blur" duration={0.7}>
        <DistanceConcentrationDiagram />
      </Reveal>

      <p>
        Why does this matter for retrieval specifically? Nearest-neighbor search depends entirely on distances being <em>informative</em> — on the nearest point actually being meaningfully closer than a random point. If every pairwise distance is converging toward the same value, "nearest" becomes a much noisier signal to search on than the clean 2D examples in earlier chapters suggested. In practice, well-trained embedding models are shaped specifically to preserve useful distance structure even at high dimensionality — this isn't a reason embeddings don't work, it's a reason naive search over them gets expensive and needs cleverer algorithms, which is exactly where this book goes next.
      </p>

      <Callout icon={Sparkles} color="#3b82f6">
        Most real embedding spaces run 384 to 1536 dimensions — genuinely impossible to picture, and only tractable statistically, not geometrically. Nobody working with embeddings professionally visualizes the actual space; they reason about it through exactly the kind of properties this chapter describes.
      </Callout>

      <Callout icon={X} color="#f59e0b">
        Common mistake: carrying the clean 2D arrow-and-angle pictures from Chapters 5 through 10 forward as if they literally describe what's happening at 768 dimensions. They were deliberately simplified teaching aids — faithful to the math, not to the geometry. Real embedding space doesn't look like anything; it only behaves according to formulas.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"What is the curse of dimensionality, and why does it matter for vector search at scale?"</strong> As dimensionality grows, distances between random points concentrate — the gap between "near" and "far" shrinks, making nearest-neighbor search a noisier signal and brute-force comparison increasingly expensive. It matters for vector search because it's the underlying reason exact, exhaustive search doesn't scale, and why every real vector database relies on approximate algorithms instead.
      </p>

      <Quiz
        question="As dimensionality increases, distances between random points tend to become:"
        options={["More spread out and distinct", "More similar to each other (they concentrate)", "Completely unrelated to dimensionality"]}
        correct={1}
        explain="This is distance concentration — the mathematical core of the curse of dimensionality. In very high dimensions, nearly all pairwise distances converge toward a similar value, which is precisely why naive distance-based search becomes both less informative and more expensive as dimensionality grows."
      />

      <SummaryCard points={[
        "The curse of dimensionality: as dimensions grow, distances between random points concentrate — the spread that makes 'nearest' meaningful shrinks.",
        "The clean 2D/3D pictures used earlier in this Part are faithful to the math but not to real embedding geometry, which can't be visualized at all.",
        "This is the actual mathematical reason exact search doesn't scale — setting up everything the next chapter covers.",
      ]} />

      <p>
        If exact, check-everything search becomes both statistically noisier and computationally expensive at real embedding scale, the field's answer is to stop checking everything — on purpose, with a controlled trade-off. That's approximate nearest neighbor search, and it closes out this Part.
      </p>

      <ChapterPrevNext
        prev={{ id: "euclidean-distance", title: "Euclidean Distance" }}
        next={{ title: "ANN Intuition", comingSoon: true }}
        go={go}
      />
    </>
  );
}
