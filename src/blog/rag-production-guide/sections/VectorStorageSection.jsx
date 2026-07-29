import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { VectorStoreArchitectureDiagram } from "../components/VectorStoreArchitectureDiagram";

/* ── CHAPTER 16 — VECTOR DATABASES: THE STORAGE LAYER ──────
   Part III · Core RAG Pipeline · Intermediate · 9 min · depends on Ch.12, Ch.15
   Generic/product-agnostic — named products arrive in Part V. */
export function VectorStorageSection({ go }) {
  return (
    <>
      <ChapterHeader num="16" part="Part III — Core RAG Pipeline" difficulty="Intermediate" time="9 min"
        depends={[
          { id: "ann-intuition", label: "ANN Intuition" },
          { id: "generating-embeddings", label: "Generating Embeddings for Your Pipeline" },
        ]} go={go} color="#3b82f6" />
      <h2 id="vector-storage">Vector Databases: The Storage Layer</h2>

      <LearningGoalCard goals={[
        "Understand what a vector database provides beyond \"a list with a for-loop\"",
        "Name the core operations a production vector store needs beyond similarity search",
        "Distinguish this generic storage-layer concept from the named products covered later in this book",
      ]} />

      <p>
        Embedded chunks from Chapter 15 need somewhere to live that can actually run Chapter 12's approximate search at scale. This chapter is deliberately generic — the "what and why" of a vector store, before this book tours specific named products (Chroma, Pinecone, Milvus, and others) much later on. What matters here is the shape of the contract every one of those products fulfills.
      </p>

      <h3>More than a list of vectors</h3>
      <p>
        You could, in principle, keep every embedding in a plain array and brute-force search it — and for a small corpus, Chapter 12 already told you that's a perfectly reasonable choice. A vector database earns its place once you need more than that: an ANN index built and maintained automatically, metadata stored alongside each vector so you can filter by date or source, and update semantics — insert, update, delete — that keep the index consistent as your underlying documents change.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <VectorStoreArchitectureDiagram />
      </Reveal>

      <CodeBlock
        execution="illustrative"
        filename="vector_store.py"
        note="generic — real syntax varies per product, covered in Part V"
        code={`store.upsert(
    id="doc42-chunk3",
    vector=embedding,
    metadata={"source": "policy.pdf", "section": "cancellations"},
)

results = store.query(
    vector=query_embedding,
    top_k=5,
    filter={"source": "policy.pdf"},   # metadata filtering, covered later in depth
)

store.delete(id="doc42-chunk3")   # the document changed — old chunk shouldn't linger`}
      />

      <Callout icon={X} color="#f59e0b">
        Common mistake: treating "a vector database" as synonymous with "any database that happens to store vectors." What actually defines the category is the combination — ANN indexing, metadata filtering, and update semantics working together — not just the ability to persist an array of floats somewhere.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"What does a vector database provide that a flat file of embeddings does not?"</strong> Automatic ANN indexing so search stays fast as the corpus grows, metadata storage and filtering alongside each vector, and real update semantics — insert, update, delete — so the index stays consistent as underlying documents change. A flat file gives you none of that for free.
      </p>

      <Quiz
        question="Beyond similarity search, name an operation a production vector store needs to support."
        options={["Metadata filtering and deletion", "Automatic text summarization", "Real-time video encoding"]}
        correct={0}
        explain="Metadata filtering (searching only within a subset of documents) and deletion (removing stale or changed content) are core operations any real vector store needs — similarity search alone isn't enough for a system whose underlying documents change over time."
      />

      <SummaryCard points={[
        "A vector database is defined by the combination of ANN indexing, metadata filtering, and real update semantics — not just vector storage.",
        "This chapter's contract is product-agnostic; specific named products and their trade-offs come later in this book.",
        "Insert, update, and delete matter as much as query — a store that only supports search can't stay consistent as source documents change.",
      ]} />

      <p>
        With chunks stored and indexed, the pipeline can finally answer its actual question: given a query, what should come back? That's retrieval — the "R" in RAG, made concrete.
      </p>

      <ChapterPrevNext
        prev={{ id: "generating-embeddings", title: "Generating Embeddings for Your Pipeline" }}
        next={{ id: "retrieval", title: "Retrieval" }}
        go={go}
      />
    </>
  );
}
