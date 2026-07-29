import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { KeyTakeaways } from "../components/KeyTakeaways";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { FullPipelineDiagram } from "../components/FullPipelineDiagram";
import { RagPipelineSimulator } from "../components/RagPipelineSimulator";

/* ── CHAPTER 20 — GROUNDING ─────────────────────────────────
   Part III · Core RAG Pipeline · Intermediate · 10 min · depends on Ch.13-19 (all of Part III)
   Capstone chapter: closes Part III, first KeyTakeaways + Part-boundary Quiz checkpoint. */
export function GroundingSection({ go }) {
  return (
    <>
      <ChapterHeader num="20" part="Part III — Core RAG Pipeline" difficulty="Intermediate" time="10 min"
        depends={[{ id: "llm-response-generation", label: "LLM Response Generation" }]} go={go} color="#3b82f6" />
      <h2 id="grounding">Grounding</h2>

      <LearningGoalCard goals={[
        "Assemble every stage from Chapters 13-19 into one complete, working RAG pipeline",
        "Define precisely what \"grounded\" means: citation, faithfulness, verifiability",
        "Draw the full pipeline from memory — this Part's checkpoint",
      ]} />

      <p>
        Seven chapters, seven pieces: documents, chunking, embeddings, storage, retrieval, prompting, generation. None of them alone is what people mean when they call a system "grounded." This chapter assembles all seven into one working pipeline and makes that word precise.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <FullPipelineDiagram />
      </Reveal>

      <h3>What "grounded" actually means</h3>
      <p>
        A grounded system has three properties, not one. <strong>Citation</strong> — the answer can point back to the specific passage it came from, not just assert something. <strong>Faithfulness</strong> — the answer actually reflects what that passage says, rather than drifting into the model's own parametric embellishment mid-generation. <strong>Verifiability</strong> — a human (or, much later in this book, an automated evaluator) can check the citation against the source and confirm the answer holds up. A system that retrieves context but never checks whether the final answer stayed faithful to it is not fully grounded — it's grounded-shaped.
      </p>

      <h3>Try the whole thing, end to end</h3>
      <p>
        Toggle retrieval off and the pipeline collapses back to Chapter 2's problem — a fluent answer with nothing behind it. Toggle it on, and every stage from this Part is doing its job at once.
      </p>

      <RagPipelineSimulator />

      <CodeBlock
        execution="illustrative"
        filename="rag_pipeline.py"
        note="the complete pipeline, assembled from every prior chapter in this Part"
        code={`def rag_answer(question: str, top_k: int = 5) -> str:
    # Ch.17 — retrieve
    query_vector = embedding_model.embed(question)
    chunks = vector_store.query(query_vector, top_k=top_k)

    # Ch.18 — construct a grounded prompt
    prompt = build_prompt(question, [c.text for c in chunks])

    # Ch.19 — generate, low temperature, streamed
    answer = "".join(llm.generate(prompt, temperature=0.2, stream=True))

    return answer

# Everything upstream of this call — Ch.13 cleaning, Ch.14 chunking,
# Ch.15 embedding, Ch.16 storage — already happened once, offline,
# to build the index this function queries.`}
      />

      <Callout icon={X} color="#f59e0b">
        Common mistake: calling a system "grounded" simply because it retrieves context, without ever verifying the generated answer actually reflects what was retrieved. Retrieval quality and generation faithfulness are separate failures that can happen independently — a system can retrieve the perfect passage and still generate an answer that drifts from it.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"How would you verify, programmatically, that a RAG response is actually grounded in its retrieved context?"</strong> Extract the specific claims made in the answer, and check each one against the retrieved chunks — either with simple overlap heuristics or, more reliably, by asking a second model call to judge whether each claim is supported by the provided context. This is exactly the faithfulness-checking problem this book returns to formally in its evaluation chapters, much later on.
      </p>

      <Quiz
        question="What are the three properties of a fully grounded RAG system?"
        options={[
          "Speed, cost, and scalability",
          "Citation, faithfulness, and verifiability",
          "Chunk size, top-k, and temperature",
        ]}
        correct={1}
        explain={`Citation (pointing back to a source), faithfulness (the answer actually reflects that source), and verifiability (a human or evaluator can check it) are what "grounded" means precisely — retrieving context alone only guarantees the raw material for grounding exists, not that the final answer used it faithfully.`}
      />

      <KeyTakeaways go={go} items={[
        { id: "documents", text: "Documents (Ch.13): clean, structure-aware text is the foundation everything downstream assumes." },
        { id: "chunking", text: "Chunking (Ch.14): the size/overlap trade-off is the single most-tuned parameter in the whole pipeline." },
        { id: "generating-embeddings", text: "Generating Embeddings (Ch.15): model choice is a real trade-off between dimensionality, cost, and domain fit." },
        { id: "vector-storage", text: "Vector Storage (Ch.16): a vector database earns its place through ANN indexing, filtering, and update semantics together." },
        { id: "retrieval", text: "Retrieval (Ch.17): query and chunks must share one embedding model; top_k is a real tuning parameter." },
        { id: "prompt-construction", text: "Prompt Construction (Ch.18): structure and a refusal instruction are what preserve retrieval quality into the final answer." },
        { id: "llm-response-generation", text: "LLM Response Generation (Ch.19): streaming and low temperature both serve faithfulness, not just UX polish." },
      ]} />

      <SummaryCard points={[
        "The complete pipeline is two paths sharing one store: offline (documents → chunk → embed → store) and online (query → retrieve → prompt → generate).",
        "Grounded means three things together — citation, faithfulness, verifiability — not just \"retrieval happened somewhere upstream.\"",
        "You can now draw this entire pipeline from memory — that's Part III's actual checkpoint, more than any single quiz question.",
      ]} />

      <p>
        That closes Part III. You have a complete, working RAG pipeline and a precise definition of what makes it trustworthy. But it's still naive in one specific way: every query gets exactly one retrieval pass, with no re-ranking, no query rewriting, no second look. Part IV opens the box on how real production systems make that one search significantly smarter — starting with the indexing algorithms running underneath every vector database this book has mentioned so far.
      </p>

      <ChapterPrevNext
        prev={{ id: "llm-response-generation", title: "LLM Response Generation" }}
        next={{ title: "Flat Search", comingSoon: true }}
        go={go}
      />
    </>
  );
}
