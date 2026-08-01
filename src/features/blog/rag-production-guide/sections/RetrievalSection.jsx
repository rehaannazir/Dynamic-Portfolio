import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { RetrievalFlowDiagram } from "../components/RetrievalFlowDiagram";

/* ── CHAPTER 17 — RETRIEVAL ─────────────────────────────────
   Part III · Core RAG Pipeline · Intermediate · 9 min · depends on Ch.16
   The "R" in RAG, made mechanically concrete. */
export function RetrievalSection({ go }) {
  return (
    <>
      <ChapterHeader num="17" part="Part III — Core RAG Pipeline" difficulty="Intermediate" time="9 min"
        depends={[{ id: "vector-storage", label: "Vector Databases: The Storage Layer" }]} go={go} color="#3b82f6" />
      <h2 id="retrieval">Retrieval</h2>

      <LearningGoalCard goals={[
        "Walk through the full mechanics of a top-k retrieval query, end to end",
        "Understand why the query must be embedded with the exact same model used for the chunks",
        "Recognize top-k as a real, testable tuning parameter rather than an arbitrary default",
      ]} />

      <p>
        Everything so far — cleaning, chunking, embedding, storing — was preparation. This is the moment the pipeline actually answers a question: given a query, what comes back? Mechanically, it's simple. Getting it right in production is most of what the rest of this book is about.
      </p>

      <h3>The mechanics, in order</h3>
      <p>
        A retrieval call does exactly four things: take the user's query text, embed it using the <em>same</em> embedding model used to embed every chunk in the index, search the index for the vectors closest to that query embedding, and return the top-k closest matches, ranked. That's the entire "R" in RAG, in four steps.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <RetrievalFlowDiagram />
      </Reveal>

      <CodeBlock
        execution="illustrative"
        filename="retrieve.py"
        code={`def retrieve(query: str, top_k: int = 5):
    query_vector = embedding_model.embed(query)   # same model as the chunks — non-negotiable
    results = vector_store.query(
        vector=query_vector,
        top_k=top_k,
    )
    return [r.chunk_text for r in results]

chunks = retrieve("What's the cancellation policy for the Pro plan?")
# -> a ranked list of the top_k chunks most similar to the query,
#    ready to hand to the prompt construction step next.`}
      />

      <p>
        The one detail that's easy to overlook and expensive to get wrong: the query embedding <em>must</em> come from the same model that produced the stored chunk embeddings. Two different embedding models place text in two unrelated vector spaces — comparing a query vector from one model against chunk vectors from another doesn't produce a meaningful similarity score, it produces noise that happens to look like a ranking.
      </p>
      <p>
        <code>top_k</code> is a real, testable parameter, not a value to set once and forget. Too small, and a relevant chunk that ranked 6th never reaches the model at all. Too large, and irrelevant chunks dilute the context the model receives in the next chapter, and cost/latency climb for no retrieval benefit. Production systems tune this against a real evaluation set — covered properly much later in this book — rather than guessing.
      </p>

      <Callout icon={X} color="#f59e0b">
        Common mistake: hardcoding <code>top_k</code> to a value that felt reasonable during a demo and never revisiting it once real, more varied queries start hitting the system. The right value depends on chunk size, query complexity, and how much context-window budget the generation step can actually use.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"Walk through what happens, step by step, when a RAG system receives a user query."</strong> The query text is embedded with the same model used for the indexed chunks, that query vector is searched against the vector store's index for its nearest neighbors, the top-k results come back ranked by similarity, and those chunks are handed to the next stage — prompt construction — to be turned into context the model can actually read.
      </p>

      <Quiz
        question="Why must the query and the stored documents be embedded with the same model?"
        options={[
          "It's a licensing requirement from most embedding providers",
          "Different models produce incompatible vector spaces, making similarity scores meaningless",
          "It reduces the number of dimensions needed",
        ]}
        correct={1}
        explain="Each embedding model learns its own arrangement of vector space during training. A query vector from one model and chunk vectors from another aren't comparable — their notion of 'close' and 'far' isn't shared, so any similarity score computed across them is meaningless, even though the math will still happily produce a number."
      />

      <SummaryCard points={[
        "Retrieval is four mechanical steps: embed the query, search the index, rank by similarity, return the top-k.",
        "The query must be embedded with the exact same model used for the stored chunks — mixing models silently breaks similarity scoring.",
        "top_k is a real tuning parameter with a genuine cost/completeness trade-off, not a value to set once and ignore.",
      ]} />

      <p>
        Retrieved chunks are just raw text fragments until they're assembled into something the model can actually use to answer. That assembly step — deciding exactly how retrieved context gets handed to the model — is prompt construction, next.
      </p>

      <ChapterPrevNext
        prev={{ id: "vector-storage", title: "Vector Databases: The Storage Layer" }}
        next={{ id: "prompt-construction", title: "Prompt Construction" }}
        go={go}
      />
    </>
  );
}
