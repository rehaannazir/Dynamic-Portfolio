import { TriangleAlert, X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { ChunkingStrategiesDiagram } from "../components/ChunkingStrategiesDiagram";
import { ChunkingPlayground } from "../components/ChunkingPlayground";

/* ── CHAPTER 14 — CHUNKING ─────────────────────────────────
   Part III · Core RAG Pipeline · Beginner · 10 min · depends on Ch.13 */
export function ChunkingSection({ go }) {
  return (
    <>
      <ChapterHeader num="14" part="Part III — Core RAG Pipeline" difficulty="Beginner" time="10 min"
        depends={[{ id: "documents", label: "Documents" }]} go={go} color="#3b82f6" />
      <h2 id="chunking">Chunking</h2>

      <LearningGoalCard goals={[
        "Explain the chunk-size trade-off: too small loses context, too large dilutes relevance",
        "Compare fixed-size, recursive, and semantic chunking strategies",
        "Understand what overlap actually buys you, and what it costs",
      ]} />

      <p>
        Clean text from Chapter 13 is still one long document. Retrieval works over pieces of it — and how you cut those pieces is arguably the single most-tuned decision in a production RAG system. Get chunk size wrong and no algorithm downstream, however sophisticated, fully compensates.
      </p>

      <h3>The trade-off, stated plainly</h3>
      <p>
        Make chunks too small, and each one loses surrounding context — a sentence fragment about "the deductible" with no indication of which insurance plan it belongs to. Make chunks too large, and each one dilutes relevance — a ten-paragraph chunk that happens to contain the answer buried among nine paragraphs of unrelated material scores worse on similarity search than a tight, focused one would, and wastes context-window budget once retrieved. There's no universal right answer; the right chunk size depends on your content's natural structure and your queries' typical granularity.
      </p>

      <h3>Three strategies, in increasing sophistication</h3>
      <p>
        <strong>Fixed-size</strong> chunking cuts every N characters or tokens, with some overlap — simple and fast, but completely blind to sentence or paragraph boundaries; it will happily cut a sentence in half. <strong>Recursive</strong> chunking tries to respect structure by attempting paragraph breaks first, falling back to sentence breaks, then word breaks only if a piece is still too large — structure-aware without needing to understand meaning. <strong>Semantic</strong> chunking goes further still, using embedding similarity between adjacent sentences to detect where the topic actually shifts, splitting there instead of at an arbitrary size boundary.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <ChunkingStrategiesDiagram />
      </Reveal>

      <h3>Try it: chunk size and overlap, live</h3>
      <p>
        The playground below runs real fixed-size chunking on an actual paragraph as you drag the sliders — not a canned example. Push chunk size down and watch the chunk count climb; push overlap to zero and watch every chunk boundary lose whatever context used to carry over from its neighbor.
      </p>

      <ChunkingPlayground />

      <CodeBlock
        execution="runnable"
        filename="chunking.py"
        code={`def fixed_size_chunks(text, size=200, overlap=40):
    chunks = []
    start = 0
    step = size - overlap
    while start < len(text):
        end = min(start + size, len(text))
        chunks.append(text[start:end])
        if end >= len(text):
            break
        start += step
    return chunks

def recursive_chunks(text, size=500):
    # try paragraph breaks first, fall back to sentences, then words
    for separator in ["\\n\\n", ". ", " "]:
        pieces = text.split(separator)
        if all(len(p) <= size for p in pieces):
            return pieces
    return fixed_size_chunks(text, size)  # last resort`}
      />

      <Callout icon={TriangleAlert} color="#ef4444">
        Chunking mid-sentence or mid-table with no structural awareness is the single most common cause of confusingly bad retrieval results — the chunk that gets embedded and searched isn't the sentence a human would consider "the relevant part," it's an arbitrary character-count slice that happened to contain it, sometimes only partially.
      </Callout>

      <Callout icon={X} color="#f59e0b">
        Common mistake: picking a chunk size once, early in a project, and never revisiting it. Chunk size interacts with your embedding model, your typical query length, and your content's structure — a size that works well for FAQ articles can perform badly on long-form legal contracts in the same system.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"How would you choose a chunk size for a corpus of legal contracts versus a corpus of chat logs?"</strong> Legal contracts have long, structurally nested clauses where meaning depends on surrounding context — favoring larger chunks, often with recursive splitting that respects clause and section boundaries. Chat logs are short, self-contained turns — favoring small chunks, often one message or a short exchange, where stuffing multiple unrelated turns into one chunk would dilute relevance rather than help it.
      </p>

      <Quiz
        question="What problem does chunk overlap primarily solve?"
        options={[
          "It makes embeddings cheaper to compute",
          "It prevents losing context that's split across a chunk boundary",
          "It removes the need for a vector database",
        ]}
        correct={1}
        explain="Without overlap, a sentence or idea that happens to fall right at a chunk boundary gets split between two chunks, and neither one contains the complete thought. Overlap carries a little of the previous chunk's tail into the next chunk's head so boundary-straddling context survives."
      />

      <SummaryCard points={[
        "Chunk size is a real trade-off: too small loses context, too large dilutes relevance — there's no universal right answer.",
        "Fixed-size, recursive, and semantic chunking trade simplicity for increasing structural and semantic awareness.",
        "Overlap exists specifically to prevent losing context that straddles a chunk boundary, at the cost of some redundancy.",
      ]} />

      <p>
        Chunks are still just text until something turns them into the vectors Part II spent eight chapters explaining. Time to generate embeddings for real — not the toy trigram version from Chapter 6, but the actual model-selection decision a production pipeline has to make.
      </p>

      <ChapterPrevNext
        prev={{ id: "documents", title: "Documents" }}
        next={{ id: "generating-embeddings", title: "Generating Embeddings for Your Pipeline" }}
        go={go}
      />
    </>
  );
}
