import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { BeforeAfterSplit } from "../components/BeforeAfterSplit";
import { KnowledgeMethodsDiagram } from "../components/KnowledgeMethodsDiagram";

/* ── CHAPTER 3 — WHY RAG EXISTS ────────────────────────────
   Part I · Foundations · Beginner · 9 min · depends on Ch.2
   No math, no code required per spec. */
export function WhyRagExistsSection({ go }) {
  return (
    <>
      <ChapterHeader num="03" part="Part I — Foundations" difficulty="Beginner" time="9 min"
        depends={[{ id: "why-llms-hallucinate", label: "Why LLMs Hallucinate" }]} go={go} />
      <h2 id="why-rag-exists">Why RAG Exists</h2>

      <LearningGoalCard goals={[
        "State, in one sentence, the specific problem RAG solves",
        "Compare RAG against the other two ways of getting knowledge into a model — prompt stuffing and fine-tuning",
        "Explain what grounding actually buys you, and what it doesn't fix on its own",
      ]} />

      <p>
        You now have both halves of the diagnosis. Chapter 1: retrieval has a hundred and fifty years of practice finding the right document out of many. Chapter 2: generation has a structural blind spot — a model produces fluent text whether or not it's true, with no internal signal telling you which. Put those two facts next to each other and the fix suggests itself: don't ask the model to remember everything, ask it to <em>read</em> the right thing first, and then generate from that. That's RAG. This chapter makes the case for why that specific fix, rather than the alternatives, is the one the industry converged on.
      </p>

      <h3>Three ways to get knowledge into a model</h3>
      <p>
        There are exactly three levers available if you want a language model to answer using information it doesn't already know from training: stuff it into the prompt, fine-tune it into the weights, or retrieve it at query time.
      </p>
      <p>
        <strong>Prompt stuffing</strong> — pasting your entire knowledge base into the context window — works until it doesn't. It's free and instant, but it's bounded by the context window's size, and even within that limit, more text isn't free: cost and latency both scale with how much you paste in. <strong>Fine-tuning</strong> adjusts the model's weights on new data. It's genuinely useful for teaching a model a style, a format, or domain vocabulary — but it's slow and expensive to redo every time your underlying facts change, and it doesn't fix Chapter 2's actual problem: a fine-tuned model still generates from learned patterns, one token at a time, with no more built-in fact-checking than before.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <KnowledgeMethodsDiagram />
      </Reveal>

      <p>
        <strong>Retrieval-augmented generation</strong> sidesteps both problems. Instead of trying to fit everything into the prompt or bake everything into the weights, you index your knowledge base once, and at query time you retrieve only the handful of passages relevant to the current question — cheap to update (re-index, don't retrain), current as of your last index run, and it scales to a document collection of any size because you're only ever handing the model a small, relevant slice of it.
      </p>

      <h3>What grounding actually buys you</h3>
      <p>
        The core benefit is simple to state and easy to underestimate: the model now has something real to read before it answers, instead of only its parametric memory from Chapter 2. That gets you freshness (the retrieved text can be as current as your last index update), and it gets you auditability — you can show the reader exactly which passage the answer came from, which is not something a purely parametric answer can ever offer.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <BeforeAfterSplit />
      </Reveal>

      <p>
        It is worth being precise about what this doesn't fix on its own. RAG doesn't guarantee correctness — it guarantees the model has a real source available. Whether the right source gets retrieved, and whether the model actually sticks to what that source says, are separate engineering problems this book spends Parts II through VII solving in detail. Chapter 2's underlying mechanism — next-token prediction with no built-in fact-checker — hasn't gone away. RAG changes what the model has to work with, not how it generates.
      </p>

      <Callout icon={X} color="#f59e0b">
        Common mistake: treating RAG and fine-tuning as an either/or decision. They solve different problems and combine well — fine-tune a model to adopt your team's tone, terminology, or output format, and use RAG to keep its factual answers current. Production systems frequently do both.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"In one sentence, what problem does RAG solve that a bigger model doesn't?"</strong> A bigger model is still bounded by a training cutoff and still generates from learned patterns with no fact-checking step — scale improves fluency and general capability, not access to information the model was never trained on. RAG solves that specific gap by giving the model real, current text to read at the moment it's asked a question.
      </p>

      <Quiz
        question="Which problem does RAG primarily solve?"
        options={[
          "Slow model inference speed",
          "Stale or missing knowledge in the model's training data",
          "Small context windows",
        ]}
        correct={1}
        explain="RAG's whole mechanism — retrieve relevant text, then generate from it — exists to compensate for a model's training cutoff and gaps in what it learned. It doesn't make inference faster, and it doesn't enlarge the context window; it just makes sure what fills that window is actually relevant and current."
      />

      <SummaryCard points={[
        "Of the three ways to add knowledge to a model — prompt stuffing, fine-tuning, RAG — only RAG is cheap to update, stays current, and scales to a large corpus.",
        "RAG's real benefit is giving the model something to read: freshness and auditability, not a guarantee of correctness.",
        "RAG and fine-tuning aren't competitors — they solve different problems and are often used together in production.",
      ]} />

      <p>
        You have the thesis. What you don't have yet is the history of how the field actually arrived at this specific architecture — the missing link between Chapter 1's inverted index and the RAG pipeline you'll start building in Part III. That link is next.
      </p>

      <ChapterPrevNext
        prev={{ id: "why-llms-hallucinate", title: "Why LLMs Hallucinate" }}
        next={{ title: "Evolution from Search Engines to RAG", comingSoon: true }}
        go={go}
      />
    </>
  );
}
