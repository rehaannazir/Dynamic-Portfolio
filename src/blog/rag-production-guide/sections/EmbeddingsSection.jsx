import { Lightbulb, X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { EmbeddingCloudAnimation } from "../components/EmbeddingCloudAnimation";
import { EmbeddingPlayground } from "../components/EmbeddingPlayground";

/* ── CHAPTER 6 — EMBEDDINGS ────────────────────────────────
   Part II · Mathematical Foundations · Beginner · 8 min · depends on Ch.5 */
export function EmbeddingsSection({ go }) {
  return (
    <>
      <ChapterHeader num="06" part="Part II — Mathematical Foundations" difficulty="Beginner" time="8 min"
        depends={[{ id: "vectors", label: "Vectors" }]} go={go} color="#8b5cf6" />
      <h2 id="embeddings">Embeddings</h2>

      <LearningGoalCard goals={[
        "Explain what makes an embedding different from an arbitrary vector",
        "Describe, in plain language, how contrastive training arranges an embedding space",
        "Recognize that embedding quality depends on training data, not just model size",
      ]} />

      <p>
        Chapter 5 ended on a deliberately unfinished note: a vector like <code>[4, 3]</code> doesn't mean anything on its own — it's just two numbers. An embedding is what you get when a vector's position is no longer arbitrary, but shaped, on purpose, so that distance in the space actually tracks distance in meaning. This is the single idea that makes semantic search — and everything RAG does with it — possible.
      </p>

      <h3>From arbitrary vectors to meaningful ones</h3>
      <p>
        An embedding is a function that takes a piece of text (or an image, or audio) and outputs a vector — formally, <code>f(text) → ℝⁿ</code>, a mapping into n-dimensional space. The part that makes it an <em>embedding</em>, rather than just "a vector," is that <code>f</code> isn't designed by hand. It's <strong>learned</strong>, from data, specifically so that <code>f("dog")</code> and <code>f("puppy")</code> land close together, and <code>f("dog")</code> and <code>f("quarterly earnings")</code> land far apart.
      </p>

      <h3>How training gets you there</h3>
      <p>
        The short version, without the full loss-function math: an embedding model is shown enormous numbers of pairs of text during training — some pairs meant to be similar (a question and its answer, two paraphrases of the same sentence), some meant to be dissimilar (two unrelated sentences). Each time, the model's output vectors for the "similar" pair are nudged slightly closer together, and vectors for the "dissimilar" pair are nudged slightly apart. Repeat this over billions of pairs, and the space gradually self-organizes: not because anyone told it where "animal" concepts belong versus "finance" concepts, but because that arrangement is what best satisfies millions of "these two are close, those two are far" constraints simultaneously. This general approach is called <strong>contrastive learning</strong>.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <EmbeddingCloudAnimation />
      </Reveal>

      <CodeBlock
        execution="illustrative"
        filename="embed.py"
        note="conceptual — the actual API call varies by provider, covered properly in Chapter 15"
        code={`# f(text) -> vector. The specific provider/model doesn't matter yet —
# what matters is the shape of the call: text in, a fixed-length vector out.
vector = embedding_model.embed("What's the cancellation policy?")

print(len(vector))   # -> 768   (a typical embedding dimensionality)
print(vector[:5])    # -> [0.0234, -0.1187, 0.0456, ...]  — meaningless to read by eye,
                      #    but its POSITION relative to other embedded text is the whole point.`}
      />

      <p>
        Try it yourself below — not with a real embedding model (that's Chapter 15, when this book gets to production pipelines), but with a genuine cosine similarity computation running live in your browser over a much cruder stand-in vector. The formula is real. The vectors are a toy. The disclosure box under it explains exactly where the toy version breaks down.
      </p>

      <EmbeddingPlayground />

      <Callout icon={Lightbulb} color="#8b5cf6">
        Expert tip: embedding models are trained on a specific data distribution, and that shows. A model trained mostly on general web text can be mediocre at legal or medical language — not because it's a worse model in general, but because "similar meaning" in a specialized domain isn't well represented in what it learned from. Domain fit matters as much as raw model quality.
      </Callout>

      <Callout icon={X} color="#f59e0b">
        Common mistake: assuming all embedding models are interchangeable, or that a higher-dimensional embedding is automatically a better one. Neither holds in general — dimensionality is a design trade-off (Chapter 15 covers it properly), and different models trained on different data will disagree, sometimes substantially, about what counts as "similar."
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"How does an embedding model learn to place semantically similar text close together?"</strong> Through contrastive training: the model sees many pairs of text labeled similar or dissimilar, and its output vectors are repeatedly nudged closer together for similar pairs and further apart for dissimilar ones. Over enough examples, the geometry of the resulting space ends up encoding meaning as distance — not because meaning was explicitly programmed in, but because that arrangement is what satisfies the training signal.
      </p>

      <Quiz
        question="Which property distinguishes a good embedding space from a bad one?"
        options={[
          "Similar meanings end up close together as vectors",
          "Similar text lengths end up close together as vectors",
          "All vectors end up exactly the same magnitude",
        ]}
        correct={0}
        explain="A good embedding space is one where geometric closeness reliably tracks semantic closeness — that's the entire property retrieval depends on. Text length and vector magnitude are incidental; a good embedding model shouldn't let sentence length alone determine similarity."
      />

      <SummaryCard points={[
        "An embedding is a learned function, text in, vector out — the learning is what separates it from an arbitrary vector.",
        "Contrastive training arranges the space by repeatedly pulling similar pairs together and pushing dissimilar pairs apart, at scale.",
        "Embedding quality is a function of training data and domain fit, not just model size or vector dimensionality.",
      ]} />

      <p>
        "Distance tracks meaning" has been stated three times now without being made precise. The next four chapters fix that — starting with a survey of what "distance" and "similarity" actually mean as computable quantities, before diving into any one formula.
      </p>

      <ChapterPrevNext
        prev={{ id: "vectors", title: "Vectors" }}
        next={{ id: "distance-metrics", title: "Distance Metrics" }}
        go={go}
      />
    </>
  );
}
