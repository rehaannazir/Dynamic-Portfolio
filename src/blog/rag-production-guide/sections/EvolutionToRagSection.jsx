import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { IrToRagFullTimeline } from "../components/IrToRagFullTimeline";
import { References } from "../components/References";

/* ── CHAPTER 4 — EVOLUTION FROM SEARCH ENGINES TO RAG ─────
   Part I · Foundations · Beginner · 9 min · depends on Ch.1, Ch.3
   Closes Part I. No math, no code required per spec. */
export function EvolutionToRagSection({ go }) {
  return (
    <>
      <ChapterHeader num="04" part="Part I — Foundations" difficulty="Beginner" time="9 min"
        depends={[
          { id: "history-of-ir", label: "History of Information Retrieval" },
          { id: "why-rag-exists", label: "Why RAG Exists" },
        ]} go={go} />
      <h2 id="evolution-search-to-rag">Evolution from Search Engines to RAG</h2>

      <LearningGoalCard goals={[
        "Connect Chapter 1's lexical-search lineage to Chapter 3's RAG thesis through the actual intermediate steps",
        "Name the paper that formalized RAG, and the specific problem it was framed around",
        "Explain what semantic search and open-domain question answering each contributed on the way there",
      ]} />

      <p>
        Chapter 1 left off at the neural turn — embeddings, and search by meaning instead of word overlap. Chapter 3 stated the RAG thesis directly. What's missing is the middle: RAG wasn't a single invention that appeared out of nowhere in 2020. It's the point where two separate lines of research — better retrieval, and systems that try to answer questions instead of just returning ranked links — finally met.
      </p>

      <h3>From ranking to answering</h3>
      <p>
        Classic search engines return a ranked list of links. You, the human, still read several of them and synthesize an answer yourself. Through the 2010s, a separate research thread — <strong>question answering</strong> — tried to close that last step: given a question, return the answer directly, not a list of places to look for it. Early systems did this by retrieving a small set of candidate passages and then running an <em>extractive</em> model over them — one that could point at a span of text within a passage and say "the answer is right here," but couldn't generate a new sentence synthesizing across passages.
      </p>

      <h3>Semantic search enters the picture</h3>
      <p>
        Starting around 2013, word embeddings, and later full-sentence embeddings from transformer models, gave retrieval a second axis alongside Chapter 1's lexical matching: <strong>semantic</strong> similarity. This mattered enormously for question answering specifically, because a question and its answer frequently share almost no vocabulary — "What's the maximum weight this bridge can hold?" and "Load limit: 40 tons" have zero words in common, and BM25 alone would likely miss the connection entirely. Semantic search made retrieving the right passage for a natural-language question dramatically more reliable. It was necessary. On its own, it still wasn't sufficient — extractive QA could point at a fact, but couldn't compose a fluent answer that synthesized several retrieved facts into one coherent response.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <IrToRagFullTimeline />
      </Reveal>

      <h3>2020: the paper that named it</h3>
      <p>
        In 2020, researchers at Facebook AI Research published <em>"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"</em> — the paper this book's title borrows its name from. Its contribution wasn't inventing retrieval, and it wasn't inventing generative language models; both already existed. The contribution was pairing them properly: instead of an extractive step that could only point at existing text, RAG used a <em>generative</em> model that could read multiple retrieved passages and compose a genuinely new, fluent answer synthesizing across them — with the retriever and generator designed to work as one system rather than two independently-built stages bolted together.
      </p>

      <References items={[
        { label: "Lewis et al., \"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks\"", detail: "arXiv:2005.11401, 2020 — the paper that formalized the architecture this book is about", href: "https://arxiv.org/abs/2005.11401" },
      ]} />

      <Callout icon={X} color="#f59e0b">
        Common mistake: attributing RAG's invention to a specific product or company — "LangChain invented RAG" or "OpenAI invented RAG" are both wrong. RAG is academic research from 2020 that the tooling ecosystem later built convenient frameworks around. The frameworks made it easy to use; they didn't invent the idea.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"What year was the original RAG paper published, and what problem was it originally framed around?"</strong> 2020, framed around knowledge-intensive NLP tasks — specifically open-domain question answering, where the answer requires pulling in external information the model wasn't guaranteed to have memorized. The paper's framing was narrower than how the industry uses "RAG" today, which now covers everything from customer support bots to code search.
      </p>

      <Quiz
        question="RAG was originally proposed for which task type?"
        options={[
          "Image classification",
          "Open-domain question answering",
          "Real-time translation",
        ]}
        correct={1}
        explain="The 2020 paper targeted knowledge-intensive NLP tasks, primarily open-domain QA — answering questions using external knowledge the model wasn't guaranteed to have memorized during training. The much broader set of RAG applications you'll see in Part X of this book came later, as the industry generalized the original idea."
      />

      <SummaryCard points={[
        "RAG is the meeting point of two separate research threads: better retrieval (lexical → semantic) and systems that answer questions directly rather than returning links.",
        "Semantic search was necessary but not sufficient — extractive QA could point at a fact but not compose a fluent, synthesized answer.",
        "The 2020 Lewis et al. paper's real contribution was pairing a retriever with a generative model as one system, not inventing retrieval or generation individually.",
      ]} />

      <p>
        That closes Part I. You now have the full foundation: retrieval's history, generation's structural blind spot, the case for RAG, and where the architecture actually came from. Part II shifts from history to mechanism — starting with the mathematical object every embedding, every similarity score, and every index in the rest of this book is built out of: the vector.
      </p>

      <ChapterPrevNext
        prev={{ id: "why-rag-exists", title: "Why RAG Exists" }}
        next={{ id: "vectors", title: "Vectors" }}
        go={go}
      />
    </>
  );
}
