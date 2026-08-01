import { Lightbulb, X } from "lucide-react";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { AnnSearchSimulator } from "../components/AnnSearchSimulator";

/* ── CHAPTER 12 — ANN INTUITION ─────────────────────────────
   Part II · Mathematical Foundations · Intermediate · 9 min · depends on Ch.11
   Closes Part II. Conceptual chapter — no code (algorithms arrive per-implementation in Part IV). */
export function AnnIntuitionSection({ go }) {
  return (
    <>
      <ChapterHeader num="12" part="Part II — Mathematical Foundations" difficulty="Intermediate" time="9 min"
        depends={[{ id: "high-dimensional-space", label: "High-Dimensional Space" }]} go={go} color="#8b5cf6" />
      <h2 id="ann-intuition">ANN Intuition</h2>

      <LearningGoalCard goals={[
        "Understand approximate nearest neighbor search as a deliberate, controlled trade of perfect recall for large speed gains",
        "Explain why exact, brute-force search stops being viable well before you'd expect",
        "Recognize that 'approximate' does not mean 'unreliable' in a well-tuned production system",
      ]} />

      <p>
        Chapter 11 left you with a genuine problem: distances stop being cleanly informative at real embedding dimensionality, and checking every single vector in a large index against a query is expensive regardless. The field's answer to both problems at once is to stop searching exhaustively — on purpose, with a controlled and measurable trade-off. That answer is <strong>approximate nearest neighbor</strong> (ANN) search, and it is the single idea every algorithm in the indexing chapters ahead specializes.
      </p>

      <h3>Exact search, and why it doesn't scale</h3>
      <p>
        The obvious way to find a query's nearest neighbors is to compute its distance to every vector in the index and keep the closest ones — <strong>flat</strong>, or brute-force, search. This is exact: it always finds the true nearest neighbors, with no approximation error. It's also linear in the size of the index — search a million vectors, and every single query touches all one million. At a few thousand vectors this is instant. At tens of millions, run across many queries per second, it becomes the dominant cost in the entire system.
      </p>

      <h3>The trade ANN makes</h3>
      <p>
        Approximate methods give up the guarantee of finding the <em>exact</em> nearest neighbors, in exchange for only checking a small, cleverly chosen fraction of the index. A well-tuned ANN index typically finds 95–99% of the same results a brute-force search would, while touching a tiny percentage of the vectors — sublinear in index size rather than linear. Try it below: the same 120 points, the same query, searched two ways.
      </p>

      <AnnSearchSimulator />

      <p>
        Every specific algorithm in the next Part — HNSW's graph traversal, IVF's clustering, and the others — is a different, structurally clever way of deciding <em>which small fraction to check</em>. This chapter is the one idea; those chapters are its implementations.
      </p>

      <Callout icon={Lightbulb} color="#8b5cf6">
        Expert tip: "approximate" doesn't mean "unreliable." Production ANN indexes are tuned to a target recall — often 95% or higher — and that number is a knob you control, not a fixed cost you're stuck with. The trade is real, but it's a measured one, not a shrug.
      </Callout>

      <Callout icon={X} color="#f59e0b">
        Common mistake: assuming "approximate" implies an unacceptable quality hit, and reaching for brute-force search out of caution on a corpus that's already well past the size where it's the faster, more reliable choice. For most production RAG systems past a few hundred thousand chunks, a well-tuned ANN index outperforms flat search on both speed and, counterintuitively, overall system reliability — a slow query path is its own kind of failure.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"Why is approximate nearest neighbor search acceptable for most production RAG systems?"</strong> Because retrieval doesn't need to be perfect to be useful — missing the 7th-most-relevant chunk out of a million rarely changes the final answer, while checking every vector at query time does not scale to production latency or throughput requirements. ANN search converts an unaffordable exact guarantee into an affordable, tunable, near-exact one.
      </p>

      <Quiz
        question="ANN search trades some retrieval ___ for large gains in ___."
        options={["accuracy (recall) / speed", "cost / accuracy", "speed / cost"]}
        correct={0}
        explain="Approximate nearest neighbor search deliberately accepts a small, controllable loss in recall — the chance of missing a true nearest neighbor — in exchange for a large, often multiple-orders-of-magnitude gain in query speed at scale."
      />

      <SummaryCard points={[
        "Flat (brute-force) search is exact but linear in index size — it stops being practical well before most people expect.",
        "ANN search deliberately checks only a small, structured fraction of the index, trading a small recall loss for a large speed gain.",
        "Every algorithm in the next Part is a different strategy for choosing which small fraction to check — this chapter is the shared idea underneath all of them.",
      ]} />

      <p>
        That closes Part II. You now have the full mathematical vocabulary — vectors, embeddings, three distance metrics, the reason high dimensionality breaks naive intuition, and the reason approximate search exists at all. Part III stops talking about math in the abstract and builds the thing: a complete, working RAG pipeline, starting at the very first input — a raw document.
      </p>

      <ChapterPrevNext
        prev={{ id: "high-dimensional-space", title: "High-Dimensional Space" }}
        next={{ id: "documents", title: "Documents" }}
        go={go}
      />
    </>
  );
}
