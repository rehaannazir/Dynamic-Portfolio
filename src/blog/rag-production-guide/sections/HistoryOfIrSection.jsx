import { Sparkles, X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { IrTimelineDiagram } from "../components/IrTimelineDiagram";

/* ── CHAPTER 1 — HISTORY OF INFORMATION RETRIEVAL ─────────
   Part I · Foundations · Beginner · 8 min · no prerequisites
   Diagram+animation requirement satisfied by IrTimelineDiagram; no code required per spec. */
export function HistoryOfIrSection({ go }) {
  return (
    <>
      <ChapterHeader num="01" part="Part I — Foundations" difficulty="Beginner" time="8 min" depends={[]} go={go} />
      <h2 id="history-of-ir">History of Information Retrieval</h2>

      <LearningGoalCard goals={[
        "Trace the line from card catalogs to RAG, so today's architecture reads as a lineage, not an invention out of nowhere",
        "Explain what an inverted index is and why it made keyword search possible at scale",
        "Understand why BM25 — a decades-old scoring formula — is still sitting inside modern production RAG systems",
      ]} />

      <p>
        Before you can appreciate what retrieval-augmented generation actually does, it helps to sit with a much older problem: you have more documents than any person could read, and someone needs to find the right one in seconds. That problem is a hundred and fifty years old. RAG is just the newest answer to it — and understanding the older answers is what makes the newest one make sense, instead of feeling like it fell out of the sky in 2020.
      </p>

      <h3>The card catalog: search before computers</h3>
      <p>
        In 1876, Melvil Dewey published a classification system that let a library index every book it owned onto small paper cards, filed alphabetically and by subject, in wooden drawers. That's an information retrieval system. It has an index (the drawers), a query language (walk to the drawer, flip to the right letter), and a ranking function (none — you got everything that matched, in catalog order, and did the ranking yourself). For about a century, this was the state of the art. It scaled to the size of a library. It did not scale to the size of the internet.
      </p>

      <h3>Boolean search: the first machine-readable query language</h3>
      <p>
        Early computerized retrieval systems in the 1950s and 60s replaced "walk to the drawer" with Boolean queries: <code>contract AND liability NOT arbitration</code>. This was a real leap — a machine could now scan a document collection and return exactly the set that matched your logical expression. But Boolean search has no concept of <em>how well</em> a document matches, only <em>whether</em> it does. Every result is equally "correct," which means a query that matches ten thousand documents is just as useless as a query that matches zero.
      </p>

      <h3>Statistical relevance: TF-IDF and BM25</h3>
      <p>
        The next real advance was teaching the machine to rank, not just filter. Term Frequency–Inverse Document Frequency (TF-IDF), developed through the 1970s, scores a document higher when it uses your query terms often (term frequency) — but discounts terms that appear in almost every document anyway, like "the" or "system" (inverse document frequency). BM25, published in the late 1970s and refined through the 1990s and 2000s, is TF-IDF's more careful descendant: it adds saturation (using a word 50 times isn't 50 times more relevant than using it once) and length normalization (a long document isn't automatically more relevant just because it contains more words).
      </p>
      <p>
        Underneath both is the same data structure that makes any of this fast enough to run: the <strong>inverted index</strong>. Instead of storing "document 1 contains these words," it stores the reverse — "the word <em>liability</em> appears in documents 4, 19, and 302." A query becomes a lookup, not a scan. This single idea is why keyword search engines could answer in milliseconds long before anyone was talking about vectors.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <IrTimelineDiagram />
      </Reveal>

      <Callout icon={Sparkles} color="#3b82f6">
        BM25 predates deep learning by decades — and it's still sitting inside most production hybrid-search stacks today. On queries with exact terms (product codes, names, error messages), it routinely outperforms pure vector search. You'll see it again, working alongside embeddings rather than replaced by them, in the hybrid search chapter later in this book.
      </Callout>

      <h3>The neural turn — and where RAG actually fits</h3>
      <p>
        Everything above ranks documents by matching <em>words</em>. It has no way to know that "car" and "automobile" mean roughly the same thing, or that a question and its answer can share almost no vocabulary at all. Neural retrieval — representing text as embeddings and searching by semantic closeness rather than word overlap — is the subject of the next several chapters, and it's a genuinely different kind of tool, not just a faster version of BM25.
      </p>
      <p>
        RAG sits at the end of this lineage, not outside it. It's what you get when semantic retrieval — the ability to find the right passage even when the words don't match — is paired with a language model that can read what was found and answer in fluent, natural language. The retrieval half of that pairing is a direct descendant of the inverted index and BM25. The generation half is new. The combination, formalized in a 2020 research paper, is what the rest of this book is about.
      </p>

      <Callout icon={X} color="#f59e0b">
        Common mistake: treating keyword search as a legacy technology RAG has made obsolete. It hasn't. Modern production systems almost always run lexical search (BM25) and semantic search (embeddings) side by side, because they fail on different queries — a lesson this book returns to directly in the hybrid search chapter.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"Why does BM25 still matter in a 2026 RAG system, when embedding models exist?"</strong> A strong answer names the specific failure mode: embeddings are trained to capture meaning, which can actually work against you on queries where the literal string matters — an order ID, a part number, a person's name. BM25 has no trouble with those, because it isn't trying to understand them, only to match them.
      </p>

      <Quiz
        question="What does TF-IDF stand for, and what core problem does it solve?"
        options={[
          "Text Frequency Index Document Format — it formats documents for search",
          "Term Frequency–Inverse Document Frequency — it scores a term higher when it's frequent in a document but rare across the collection",
          "Total File Index Data Format — it indexes files for a database",
        ]}
        correct={1}
        explain="TF-IDF downweights words that are common across the whole collection (like 'the') and rewards terms that are both frequent in a specific document and rare elsewhere — which is what makes them distinctive of that document."
      />

      <SummaryCard points={[
        "Retrieval didn't start with embeddings — it started with card catalogs, then Boolean logic, then statistical ranking (TF-IDF/BM25) built on the inverted index.",
        "BM25 is still in production today, usually paired with vector search rather than replaced by it — the two fail on different query types.",
        "RAG is the newest link in this chain: semantic retrieval, descended from this same lineage, paired with a language model that can read what it finds.",
      ]} />

      <p>
        Retrieval has a history. Generation, on the other hand, has a very specific and very current problem — one you've almost certainly seen firsthand if you've used an LLM for more than five minutes. That problem is what the next chapter takes apart.
      </p>

      <ChapterPrevNext prev={null} next={{ id: "why-llms-hallucinate", title: "Why LLMs Hallucinate" }} go={go} />
    </>
  );
}
