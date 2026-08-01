import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { PromptAnatomyDiagram } from "../components/PromptAnatomyDiagram";
import { PromptBuilder } from "../components/PromptBuilder";

/* ── CHAPTER 18 — PROMPT CONSTRUCTION ───────────────────────
   Part III · Core RAG Pipeline · Intermediate · 8 min · depends on Ch.17 */
export function PromptConstructionSection({ go }) {
  return (
    <>
      <ChapterHeader num="18" part="Part III — Core RAG Pipeline" difficulty="Intermediate" time="8 min"
        depends={[{ id: "retrieval", label: "Retrieval" }]} go={go} color="#3b82f6" />
      <h2 id="prompt-construction">Prompt Construction</h2>

      <LearningGoalCard goals={[
        "Build a grounded system prompt with clearly separated, labeled parts",
        "Write a refusal instruction, and understand exactly what it protects against",
        "Recognize prompt construction as the stage where good retrieval either gets preserved or wasted",
      ]} />

      <p>
        Retrieved chunks from Chapter 17 are just text fragments sitting in a list. This chapter is where they become something the model can actually use — and it's the stage most likely to quietly waste great retrieval on a badly structured prompt.
      </p>

      <h3>A grounded prompt has parts, not just words</h3>
      <p>
        A well-built RAG prompt separates four things clearly: <strong>system instructions</strong> that tell the model who it is and how strictly to stick to the provided context, the <strong>retrieved context</strong> itself, a <strong>refusal instruction</strong> covering what to do when the context doesn't actually contain the answer, and the <strong>user's question</strong>, verbatim. Treating these as one undifferentiated block of text — just concatenating everything together — is exactly the pattern that turns careful retrieval work into a wasted opportunity.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <PromptAnatomyDiagram />
      </Reveal>

      <h3>Try assembling one yourself</h3>
      <p>
        Toggle the blocks below on and off and watch the assembled prompt change. Pay attention to what happens to the refusal instruction specifically — it's the block most commonly skipped, and the one whose absence causes exactly the hallucination behavior Chapter 2 diagnosed.
      </p>

      <PromptBuilder />

      <CodeBlock
        execution="illustrative"
        filename="build_prompt.py"
        code={`def build_prompt(question: str, chunks: list[str]) -> str:
    context = "\\n\\n".join(f"[{i+1}] {c}" for i, c in enumerate(chunks))
    return f"""You are a helpful support assistant. Answer only using the context below.

Context:
{context}

If the answer isn't contained in the context, say you don't have that
information — do not guess.

Question: {question}"""`}
      />

      <Callout icon={X} color="#f59e0b">
        Common mistake: dumping retrieved chunks straight into the prompt with no labeling or structure, and never instructing the model on what to do when nothing relevant was actually retrieved. Both failures are invisible until a real user asks a question the retrieved context doesn't cover — at which point the model, with no other instruction, tends to fall back on Chapter 2's parametric guessing.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"What should a grounded system prompt explicitly instruct the model to do when the retrieved context doesn't contain the answer?"</strong> Say so directly — state that the information isn't available in the provided context, rather than attempting to answer from parametric memory. Without that explicit instruction, a model defaults to being helpful in the way it was trained to be, which usually means answering anyway, confidently, from whatever it half-remembers.
      </p>

      <Quiz
        question="What is the purpose of a refusal instruction in a grounded prompt?"
        options={[
          "It makes the model respond faster",
          "It prevents the model from guessing when the retrieved context doesn't contain the answer",
          "It reduces the number of tokens used",
        ]}
        correct={1}
        explain="Without an explicit instruction covering the insufficient-context case, a model tends to answer anyway from its parametric memory — exactly the hallucination risk Chapter 2 covered. The refusal instruction gives it explicit permission, and a clear expectation, to say 'I don't know' instead."
      />

      <SummaryCard points={[
        "A grounded prompt separates system instructions, retrieved context, a refusal instruction, and the user question — not one undifferentiated block.",
        "The refusal instruction is the single most commonly skipped part, and its absence directly reopens the hallucination risk from Chapter 2.",
        "Good retrieval can be entirely wasted by a poorly structured prompt — this stage is where quality is preserved or lost, not just information.",
      ]} />

      <p>
        With a well-structured prompt built, the last mechanical step is letting the model actually generate an answer — and there's more to that call than just sending the prompt and waiting.
      </p>

      <ChapterPrevNext
        prev={{ id: "retrieval", title: "Retrieval" }}
        next={{ id: "llm-response-generation", title: "LLM Response Generation" }}
        go={go}
      />
    </>
  );
}
