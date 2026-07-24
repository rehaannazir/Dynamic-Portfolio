import { Info, TriangleAlert, X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { EuclideanDiagram } from "../components/EuclideanDiagram";

/* ── CHAPTER 10 — EUCLIDEAN DISTANCE ──────────────────────
   Part II · Mathematical Foundations · Intermediate · 5 min
   Depends on Ch.8 (Cosine Similarity) and Ch.9 (Dot Product) — neither is published yet, since
   chapters are being written out of numeric order. The catch-up callout below exists so this
   chapter doesn't assume content that hasn't shipped; ChapterHeader's "depends on" links will
   light up automatically once Ch.8/9 are added to toc.js. */
export function EuclideanDistanceSection({ go }) {
  return (
    <>
      <ChapterHeader num="10" part="Part II — Mathematical Foundations" difficulty="Intermediate" time="5 min"
        depends={[
          { id: "cosine-similarity", label: "Cosine Similarity" },
          { id: "dot-product", label: "Dot Product" },
        ]} go={go} color="#818cf8" />
      <h2 id="euclidean-distance">Euclidean Distance</h2>

      <Callout icon={Info} color="#64748b">
        This chapter is being published ahead of Chapters 8 and 9. Quick catch-up: cosine similarity measures the <em>angle</em> between two vectors — how similar their direction is — while completely ignoring how long each vector is. Hold onto that one fact; it's the entire contrast this chapter is built on.
      </Callout>

      <LearningGoalCard goals={[
        "Compute Euclidean (straight-line) distance between two vectors by hand",
        "Explain why Euclidean distance is sensitive to vector magnitude, unlike cosine similarity",
        "Identify the situations where Euclidean distance is actually the right metric to reach for",
      ]} />

      <p>
        Picture two product reviews. The first is short: "Great phone, love the camera!" The second says almost the same thing, but at length — enthusiastic, and repeating itself across several sentences. Embed both, and the longer one can end up as a vector with a noticeably larger magnitude, purely from saying the same thing more times — not because it means something different. Under cosine similarity, the two reviews land almost identically: same direction, same sentiment. Under Euclidean distance, they can land surprisingly far apart. Neither answer is "wrong" — they're measuring different things, and which one you want depends entirely on what "similar" is supposed to mean for your use case.
      </p>

      <h3>Straight-line distance, formally</h3>
      <p>
        Euclidean distance — also called the L2 distance — is the Pythagorean theorem, generalized past two dimensions: subtract each pair of coordinates, square the differences, sum them, take the square root.
      </p>
      <p className="not-prose my-6 text-center">
        <code className="text-base">d(a, b) = √( Σ (aᵢ − bᵢ)² )</code>
      </p>
      <p>
        Worked example, with two small vectors: <code>a = [1, 2]</code> and <code>b = [4, 6]</code>. The differences are <code>[3, 4]</code>. Squared, that's <code>[9, 16]</code>, which sums to <code>25</code>. The square root of <code>25</code> is <code>5</code> — the classic 3-4-5 triangle, which is exactly why this example was chosen: you can check it by hand in your head.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <EuclideanDiagram />
      </Reveal>

      <h3>Why magnitude matters here — and didn't a few chapters ago</h3>
      <p>
        Two vectors pointing in exactly the same direction but of different lengths have a cosine similarity of <code>1</code> — identical, as far as that metric is concerned. Those same two vectors have a nonzero Euclidean distance — they are, in this different and equally valid sense, not the same point at all. Whether that's a feature or a bug depends on whether magnitude carries real signal for your data. For most text embeddings, length differences are noise you want cosine's magnitude-invariance to ignore. For some embeddings — image intensity, sensor readings, anything where "more" genuinely means something — magnitude is exactly the information you want to keep, and Euclidean distance is the more honest metric.
      </p>

      <CodeBlock
        execution="runnable"
        filename="euclidean_vs_cosine.py"
        code={`import numpy as np

def euclidean(a, b):
    return np.sqrt(np.sum((a - b) ** 2))

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

short_review = np.array([0.20, 0.40])   # "Great phone, love the camera!"
long_review  = np.array([0.62, 1.24])   # same sentiment, said three times over

print(euclidean(short_review, long_review))       # -> 1.44  (looks quite different)
print(cosine_similarity(short_review, long_review)) # -> 1.00  (identical direction)`}
      />

      <Callout icon={TriangleAlert} color="#ef4444">
        Running Euclidean distance over unnormalized text embeddings can silently rank results by how <em>long</em> a document is rather than what it means — a subtle bug that produces plausible-looking but wrong rankings, with no error thrown anywhere.
      </Callout>

      <Callout icon={X} color="#f59e0b">
        Common mistake: reaching for Euclidean distance by default, out of classroom habit — it's usually the first distance metric anyone learns, from k-means and k-nearest-neighbors examples — without checking whether the embedding model or vector database you're actually using expects cosine instead.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"Give an example where cosine similarity and Euclidean distance would rank the same two documents differently."</strong> The reviews example above is exactly this: two texts with identical sentiment (same direction) but different lengths (different magnitude). Cosine similarity scores them as near-identical; Euclidean distance scores them as far apart. A strong answer names <em>why</em> — magnitude sensitivity — not just that the two metrics can disagree.
      </p>

      <Quiz
        question="Which metric is more sensitive to vector magnitude: cosine similarity or Euclidean distance?"
        options={[
          "Cosine similarity",
          "Euclidean distance",
          "They're equally sensitive to magnitude",
        ]}
        correct={1}
        explain="Cosine similarity divides out magnitude entirely — it only measures angle. Euclidean distance is computed directly from the raw coordinate differences, so it's fully sensitive to how long each vector is."
      />

      <SummaryCard points={[
        "Euclidean distance is straight-line distance — the Pythagorean theorem generalized to n dimensions.",
        "Unlike cosine similarity, it's fully sensitive to vector magnitude, which is a feature for some embedding types and a trap for most text embeddings.",
        "Default to cosine for text unless you have a specific reason magnitude should matter — and check what your vector database actually assumes before mixing the two.",
      ]} />

      <p>
        Both metrics you've now seen assume you can reason about "distance" the way you would on a napkin sketch — two points, a ruler, an angle. That intuition quietly stops working once you leave two or three dimensions and enter the hundreds of dimensions a real embedding actually lives in. That collapse of intuition — and why it matters enormously for how retrieval is built at scale — is where the next chapter goes.
      </p>

      <ChapterPrevNext
        prev={{ title: "Dot Product", comingSoon: true }}
        next={{ title: "High-Dimensional Space", comingSoon: true }}
        go={go}
      />
    </>
  );
}
