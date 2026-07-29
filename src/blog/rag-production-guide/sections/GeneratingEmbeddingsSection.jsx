import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { EmbeddingModelMatrix } from "../components/EmbeddingModelMatrix";

/* ── CHAPTER 15 — GENERATING EMBEDDINGS FOR YOUR PIPELINE ──
   Part III · Core RAG Pipeline · Intermediate · 9 min · depends on Ch.6, Ch.14
   Practical companion to Ch.6 — model selection, not the math. */
export function GeneratingEmbeddingsSection({ go }) {
  return (
    <>
      <ChapterHeader num="15" part="Part III — Core RAG Pipeline" difficulty="Intermediate" time="9 min"
        depends={[
          { id: "embeddings", label: "Embeddings" },
          { id: "chunking", label: "Chunking" },
        ]} go={go} color="#3b82f6" />
      <h2 id="generating-embeddings">Generating Embeddings for Your Pipeline</h2>

      <LearningGoalCard goals={[
        "Choose an embedding model based on dimensionality, cost, and domain fit — not just benchmark rank",
        "Batch-embed a set of chunks with basic rate-limit and retry handling",
        "Understand the real, recurring cost of re-embedding an entire corpus",
      ]} />

      <p>
        Chapter 6 explained what an embedding <em>is</em> — a learned mapping from text to a vector, shaped so distance tracks meaning. This chapter is the practical follow-up: with a pile of real chunks from Chapter 14, which model do you actually call, and what does that decision cost you?
      </p>

      <h3>The trade-off is real, not academic</h3>
      <p>
        Every embedding model choice trades off three things: <strong>dimensionality</strong> (higher generally captures more nuance, at higher storage and compute cost), <strong>price</strong> (per-token or per-request, and it adds up fast at real corpus scale), and <strong>domain fit</strong> (a model trained mostly on general web text can be mediocre on legal or medical language, regardless of how good it looks on general benchmarks). There's no single best model — only the best model for your corpus, your budget, and your latency requirements.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <EmbeddingModelMatrix />
      </Reveal>

      <h3>Batch embedding, with the failure modes that actually happen</h3>
      <p>
        Embedding a real corpus means calling a model thousands or millions of times, which means rate limits, transient failures, and cost tracking all become real engineering concerns, not edge cases. A production embedding step batches requests, retries transient failures with backoff, and tracks progress so a failure partway through a large corpus doesn't mean starting over from chunk zero.
      </p>

      <CodeBlock
        execution="illustrative"
        filename="batch_embed.py"
        note="conceptual — provider SDK specifics vary, the retry/batch shape is what matters"
        code={`import time

def embed_batch(chunks, model, batch_size=100, max_retries=3):
    vectors = []
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        for attempt in range(max_retries):
            try:
                vectors.extend(model.embed_many(batch))
                break
            except RateLimitError:
                time.sleep(2 ** attempt)   # exponential backoff
        else:
            raise RuntimeError(f"Failed to embed batch starting at chunk {i}")
    return vectors`}
      />

      <Callout icon={X} color="#f59e0b">
        Common mistake: re-embedding an entire corpus on every embedding-model upgrade with no migration plan, or silently mixing vectors from two different model versions in the same index. Embeddings from different models — or even different versions of the same model — live in incompatible spaces; comparing them produces meaningless similarity scores with no error thrown.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"What factors would make you choose a smaller, cheaper embedding model over the highest-quality one available?"</strong> Cost and latency at scale — embedding and storing millions of chunks with a large model can be meaningfully more expensive and slower than a smaller one, and if retrieval quality on your specific corpus doesn't measurably improve with the larger model, that cost buys nothing. Domain fit also matters more than raw benchmark rank: a smaller model trained closer to your actual domain can outperform a larger general one.
      </p>

      <Quiz
        question="True or false: a higher-dimensional embedding is always higher quality."
        options={["True", "False"]}
        correct={1}
        explain="Dimensionality is a design trade-off, not a quality guarantee. A higher-dimensional embedding costs more to store and search and isn't automatically better at capturing meaning — quality depends on training data and objective, not vector length alone."
      />

      <SummaryCard points={[
        "Embedding model choice is a real trade-off between dimensionality, cost, and domain fit — not a single 'best' answer.",
        "Batch embedding a real corpus needs retry and backoff logic; rate limits and transient failures are the normal case at scale, not an edge case.",
        "Embeddings from different models or model versions are incompatible — mixing them in one index produces meaningless similarity scores silently.",
      ]} />

      <p>
        Chunks now have real vectors. They need somewhere to live that supports fast similarity search at whatever scale your corpus actually is — the storage layer, next.
      </p>

      <ChapterPrevNext
        prev={{ id: "chunking", title: "Chunking" }}
        next={{ id: "vector-storage", title: "Vector Databases: The Storage Layer" }}
        go={go}
      />
    </>
  );
}
