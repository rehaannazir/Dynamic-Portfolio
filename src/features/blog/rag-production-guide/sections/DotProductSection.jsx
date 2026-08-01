import { Sparkles, X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { DotProductDiagram } from "../components/DotProductDiagram";

/* ── CHAPTER 9 — DOT PRODUCT ───────────────────────────────
   Part II · Mathematical Foundations · Intermediate · 5 min · depends on Ch.8
   No new animation per spec — extends Ch.8's Similarity Lines conceptually. */
export function DotProductSection({ go }) {
  return (
    <>
      <ChapterHeader num="09" part="Part II — Mathematical Foundations" difficulty="Intermediate" time="5 min"
        depends={[{ id: "cosine-similarity", label: "Cosine Similarity" }]} go={go} color="#8b5cf6" />
      <h2 id="dot-product">Dot Product</h2>

      <LearningGoalCard goals={[
        "Compute the dot product of two vectors by hand",
        "Prove, with a worked example, that dot product and cosine similarity agree once vectors are normalized",
        "Know why some production vector databases score by raw dot product instead of cosine",
      ]} />

      <p>
        Chapter 8 introduced cosine similarity as "dot product, divided by the magnitudes." That phrasing undersells the dot product — it isn't just an ingredient in someone else's formula, it's a real, useful similarity measure in its own right, and it's what a surprising number of production systems actually compute instead of full cosine similarity, for a very practical reason.
      </p>

      <h3>The computation inside the computation</h3>
      <p>
        The dot product of two vectors multiplies their components pairwise and sums the results:
      </p>
      <p className="not-prose my-6 text-center">
        <code className="text-base">a · b = Σ (aᵢ × bᵢ)</code>
      </p>
      <p>
        Using Chapter 8's exact vectors — <code>a = [1, 2]</code> and <code>b = [2, 4]</code> — the dot product is <code>(1×2) + (2×4) = 2 + 8 = 10</code>. On its own, that <code>10</code> doesn't tell you the angle between the vectors the way cosine similarity's <code>1</code> did — it's tangled up with both direction <em>and</em> magnitude. Scale <code>b</code> up further and the dot product grows, even though the direction hasn't changed at all.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <DotProductDiagram />
      </Reveal>

      <h3>When dot product alone is enough</h3>
      <p>
        If every vector in your index is <strong>pre-normalized</strong> to unit length (magnitude exactly 1) before being stored — a one-time preprocessing step — then dividing by magnitudes in the cosine formula becomes dividing by 1, which does nothing. Dot product and cosine similarity become mathematically identical, and computing the plain dot product is cheaper: one multiplication-and-sum, instead of that plus two square roots and a division, repeated over potentially millions of comparisons. This is exactly why many vector databases default to dot product internally, or expose it as the faster option — not because dot product is a different notion of similarity, but because it's the same notion, computed more cheaply, once the normalization work has already been done up front at index time.
      </p>

      <CodeBlock
        execution="runnable"
        filename="dot_product.py"
        code={`import numpy as np

def dot_product(a, b):
    return np.dot(a, b)

def normalize(v):
    return v / np.linalg.norm(v)

a = np.array([1, 2])
b = np.array([2, 4])

print(dot_product(a, b))                          # -> 10   (raw, magnitude-sensitive)
print(dot_product(normalize(a), normalize(b)))     # -> 1.0  (now identical to cosine similarity)`}
      />

      <Callout icon={Sparkles} color="#3b82f6">
        Many production vector databases default to dot product purely for compute-speed reasons at index scale — not because it reflects a different idea of "similar." Once you know vectors are normalized, dot product and cosine similarity are the same measurement, one of them just costs less to compute.
      </Callout>

      <Callout icon={X} color="#f59e0b">
        Common mistake: computing raw dot product on vectors that were <em>not</em> normalized, and expecting cosine-equivalent rankings. Without normalization, dot product folds magnitude back in — exactly the sensitivity the next chapter is entirely about, in a metric that makes no attempt to hide it.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"When are dot product and cosine similarity mathematically equivalent?"</strong> Exactly when both vectors are normalized to unit length. Cosine similarity is dot product divided by the product of the two magnitudes — once both magnitudes equal 1, that division has no effect, and the two formulas produce identical numbers.
      </p>

      <Quiz
        question="If two vectors are unit-normalized, dot product and cosine similarity produce the same what?"
        options={["The same ranking, but different raw numbers", "The exact same number", "Unrelated results"]}
        correct={1}
        explain="Normalization sets both magnitudes to 1, so cosine similarity's division step (dot product ÷ magnitude × magnitude) becomes division by 1 — the two formulas collapse into literally the same computation, not just the same ordering."
      />

      <SummaryCard points={[
        "Dot product multiplies vectors component-wise and sums the results — magnitude-sensitive on its own.",
        "It becomes mathematically identical to cosine similarity once both vectors are normalized to unit length.",
        "Vector databases often default to dot product for speed, relying on normalization having already happened at index time.",
      ]} />

      <p>
        Cosine similarity and dot product both measure angle, one with magnitude divided out and one without. Neither one asks how far apart two points actually are in space. That's a genuinely different question — and it's the subject of a chapter you've already read: Euclidean Distance, next.
      </p>

      <ChapterPrevNext
        prev={{ id: "cosine-similarity", title: "Cosine Similarity" }}
        next={{ id: "euclidean-distance", title: "Euclidean Distance" }}
        go={go}
      />
    </>
  );
}
