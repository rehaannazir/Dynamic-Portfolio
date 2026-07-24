import { Lightbulb, X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { SimilarityLinesDiagram } from "../components/SimilarityLinesDiagram";
import { EmbeddingPlayground } from "../components/EmbeddingPlayground";

/* ── CHAPTER 8 — COSINE SIMILARITY ─────────────────────────
   Part II · Mathematical Foundations · Intermediate · 7 min · depends on Ch.7 */
export function CosineSimilaritySection({ go }) {
  return (
    <>
      <ChapterHeader num="08" part="Part II — Mathematical Foundations" difficulty="Intermediate" time="7 min"
        depends={[{ id: "distance-metrics", label: "Distance Metrics" }]} go={go} color="#8b5cf6" />
      <h2 id="cosine-similarity">Cosine Similarity</h2>

      <LearningGoalCard goals={[
        "Derive cosine similarity from the geometric idea of the angle between two vectors",
        "Compute cosine similarity by hand on a small worked example",
        "Explain why magnitude-invariance is a feature for text embeddings specifically",
      ]} />

      <p>
        Of the three metrics Chapter 7 previewed, this is the one you'll see most — the default similarity measure for nearly every text embedding model and vector database in this book. It answers exactly one question about two vectors: how far apart do they <em>point</em>, ignoring entirely how long each one is.
      </p>

      <h3>The angle, not the distance</h3>
      <p>
        Picture two arrows from the same starting point. If they point in exactly the same direction, the angle between them is 0°, and cosine similarity is defined to be <code>1</code>. If they point in completely opposite directions, the angle is 180°, and cosine similarity is <code>-1</code>. If they're perpendicular — completely unrelated directions — the angle is 90°, and cosine similarity is <code>0</code>. Everything else falls somewhere between, and the formula that produces that number is the cosine of the angle between the two vectors — which is where the name comes from.
      </p>

      <h3>Deriving it</h3>
      <p>
        Cosine similarity is the dot product of two vectors, divided by the product of their magnitudes:
      </p>
      <p className="not-prose my-6 text-center">
        <code className="text-base">cos(θ) = (a · b) / (‖a‖ × ‖b‖)</code>
      </p>
      <p>
        The dot product on top — full mechanics in the next chapter — captures both direction and magnitude combined. Dividing by the two magnitudes cancels magnitude back out, leaving pure direction. Worked example: <code>a = [1, 2]</code> and <code>b = [2, 4]</code> — note that <code>b</code> is just <code>a</code> scaled by 2, same direction, different length. Dot product: <code>(1×2) + (2×4) = 10</code>. Magnitude of <code>a</code>: <code>√(1²+2²) = √5</code>. Magnitude of <code>b</code>: <code>√(2²+4²) = √20</code>. Cosine similarity: <code>10 / (√5 × √20) = 10 / √100 = 10 / 10 = 1</code>. Exactly <code>1</code> — because despite being different lengths, the two vectors point in identical directions.
      </p>

      <CodeBlock
        execution="runnable"
        filename="cosine_similarity.py"
        code={`import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

a = np.array([1, 2])
b = np.array([2, 4])   # same direction as a, twice the length

print(cosine_similarity(a, b))   # -> 1.0  (identical direction, magnitude ignored)

# In practice you'd rarely hand-roll this — most libraries expose it directly:
from numpy.linalg import norm
# or: from sklearn.metrics.pairwise import cosine_similarity`}
      />

      <Reveal variant="blur" duration={0.7}>
        <SimilarityLinesDiagram />
      </Reveal>

      <p>
        You already used this exact formula back in Chapter 6, on a toy character-based vector instead of a real embedding. Worth revisiting now that you know precisely what number it was computing:
      </p>

      <EmbeddingPlayground />

      <Callout icon={Lightbulb} color="#8b5cf6">
        Expert tip: cosine similarity's magnitude-invariance is a feature for text specifically, because text length shouldn't determine "similarity" — a one-sentence summary and a five-paragraph article on the same topic should be able to score as similar. That same property becomes a liability for embeddings where magnitude carries real signal — you'll see exactly where in the Euclidean Distance chapter.
      </Callout>

      <Callout icon={X} color="#f59e0b">
        Common mistake: assuming cosine similarity and dot product always produce the same ranking. They only agree when vectors are normalized to unit length first — the next chapter proves exactly why, and exactly when that assumption quietly breaks.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"Why is cosine similarity magnitude-invariant, and why does that matter for text embeddings?"</strong> It's magnitude-invariant because the formula explicitly divides out both vectors' lengths, leaving only the angle between them. That matters for text because sentence length shouldn't by itself determine how similar two pieces of text are — a short and a long passage about the same topic should be able to score as close, which a magnitude-sensitive metric wouldn't reliably give you.
      </p>

      <Quiz
        question="Two identical vectors (a = b) have a cosine similarity of what value?"
        options={["0", "1", "It depends on their magnitude"]}
        correct={1}
        explain="Identical vectors point in exactly the same direction — zero angle between them — which is always cosine similarity 1, regardless of how long the vectors are. Magnitude is fully divided out of the formula."
      />

      <SummaryCard points={[
        "Cosine similarity measures the angle between two vectors: dot product divided by the product of their magnitudes.",
        "It ranges from -1 (opposite directions) to 1 (identical direction), completely ignoring vector length.",
        "That magnitude-invariance is exactly right for most text embeddings, and exactly wrong for embeddings where length carries real signal.",
      ]} />

      <p>
        Cosine similarity secretly is a dot product — just with a normalization step wrapped around it. Time to look at the dot product on its own, and see precisely when that wrapper stops being necessary.
      </p>

      <ChapterPrevNext
        prev={{ id: "distance-metrics", title: "Distance Metrics" }}
        next={{ id: "dot-product", title: "Dot Product" }}
        go={go}
      />
    </>
  );
}
