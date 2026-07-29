import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { StreamingResponseAnimation } from "../components/StreamingResponseAnimation";

/* ── CHAPTER 19 — LLM RESPONSE GENERATION ──────────────────
   Part III · Core RAG Pipeline · Intermediate · 8 min · depends on Ch.18
   No diagram required per spec — animation only. */
export function LlmResponseSection({ go }) {
  return (
    <>
      <ChapterHeader num="19" part="Part III — Core RAG Pipeline" difficulty="Intermediate" time="8 min"
        depends={[{ id: "prompt-construction", label: "Prompt Construction" }]} go={go} color="#3b82f6" />
      <h2 id="llm-response-generation">LLM Response Generation</h2>

      <LearningGoalCard goals={[
        "Understand what streaming actually means at the API level, and why it matters for UX",
        "Choose generation parameters — especially temperature — appropriately for a grounded task",
        "Recognize this stage as where retrieval and prompting either visibly pay off or visibly fail",
      ]} />

      <p>
        The prompt is built. This chapter is the shortest mechanical step in the whole pipeline — send the prompt, get an answer back — and also the payoff moment: everything from Chapter 13 onward exists to make this one generation call produce something trustworthy.
      </p>

      <h3>Streaming, and why it's not just a UX nicety</h3>
      <p>
        A non-streaming call waits for the entire response to finish generating before returning anything — for a long answer, that can be several seconds of a blank screen. <strong>Streaming</strong> returns tokens incrementally, as they're generated, so a UI can display the answer as it's written. For a RAG system specifically, streaming also lets you attach citation markers to the exact token they support as it streams past, rather than bolting a source list onto the end after the fact.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <StreamingResponseAnimation />
      </Reveal>

      <h3>Temperature, for a grounded task specifically</h3>
      <p>
        Temperature controls how much randomness enters token selection — higher values produce more varied, creative output; lower values produce more deterministic, focused output. For a grounded RAG answer, lower temperature is usually the right call: you want the model sticking closely to what the retrieved context actually says, not creatively varying its phrasing in ways that can drift away from the source. Creative-writing tasks want the opposite. This isn't a universal rule — it's a parameter to set deliberately based on what the task actually needs.
      </p>

      <CodeBlock
        execution="illustrative"
        filename="generate.py"
        code={`def generate_answer(prompt: str):
    stream = llm.generate(
        prompt=prompt,
        temperature=0.2,     # low — favor sticking to retrieved context over creative variation
        stream=True,
    )
    for token in stream:
        yield token          # UI renders incrementally as tokens arrive

# A caller consuming this can render partial output immediately,
# and attach citation markers inline as the relevant tokens stream past.`}
      />

      <Callout icon={X} color="#f59e0b">
        Common mistake: leaving temperature at a library's default — often tuned for general chat, not grounded retrieval tasks — and not handling stream interruptions gracefully. A dropped connection mid-stream should leave the UI in a recoverable state, not a silently truncated answer that looks complete.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"Why would you use a lower temperature for a grounded RAG response than for a creative-writing task?"</strong> A grounded answer's job is to accurately reflect the retrieved context, not to vary or embellish it — lower temperature keeps the model's token choices closer to the most probable, context-supported continuation. Creative writing benefits from the opposite: higher temperature intentionally introduces variation and novelty, which is exactly what you don't want when faithfulness to a source document is the goal.
      </p>

      <Quiz
        question="What does 'streaming' mean in the context of an LLM API response?"
        options={[
          "The response is compressed before sending",
          "Tokens are returned incrementally as they're generated, not all at once",
          "Multiple models generate the response in parallel",
        ]}
        correct={1}
        explain="Streaming means the API returns generated tokens one at a time (or in small batches) as soon as they're produced, instead of waiting for the entire response to complete — which is what lets a UI show text appearing progressively rather than after a long pause."
      />

      <SummaryCard points={[
        "Streaming returns tokens incrementally, improving perceived latency and letting citations attach inline as they're generated.",
        "Temperature should be set deliberately and low for grounded tasks — you want fidelity to retrieved context, not creative variation.",
        "This stage is where retrieval and prompt construction's quality either visibly pays off or visibly fails — the model's fluency looks the same either way.",
      ]} />

      <p>
        You now have every individual piece: documents, chunks, embeddings, storage, retrieval, prompting, and generation. None of them, alone, is what "grounded" means. The next chapter assembles all seven into one working system and makes that word precise.
      </p>

      <ChapterPrevNext
        prev={{ id: "prompt-construction", title: "Prompt Construction" }}
        next={{ id: "grounding", title: "Grounding" }}
        go={go}
      />
    </>
  );
}
