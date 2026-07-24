import { Sparkles, TriangleAlert, X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { TokenStreamAnimation } from "../components/TokenStreamAnimation";
import { ConfidenceMatrixDiagram } from "../components/ConfidenceMatrixDiagram";

/* ── CHAPTER 2 — WHY LLMS HALLUCINATE ─────────────────────
   Part I · Foundations · Beginner · 10 min · depends on Ch.1
   No math required per spec; code is illustrative, not runnable. */
export function WhyLlmsHallucinateSection({ go }) {
  return (
    <>
      <ChapterHeader num="02" part="Part I — Foundations" difficulty="Beginner" time="10 min"
        depends={[{ id: "history-of-ir", label: "History of Information Retrieval" }]} go={go} />
      <h2 id="why-llms-hallucinate">Why LLMs Hallucinate</h2>

      <LearningGoalCard goals={[
        "Explain, mechanically, why a language model can produce fluent text that is confidently wrong",
        "Distinguish parametric knowledge — facts baked into a model's weights — from knowledge it's handed at query time",
        "Recognize why a model's tone and fluency are not a signal of whether it's actually correct",
      ]} />

      <p>
        Ask a language model a specific, slightly obscure question — the exact refund window in a vendor's terms of service, the signature of a function in an older library version, the outcome of a case you half-remember — and it will very often answer. Not hedge, not say "I don't have that information." Answer, in the same confident, complete-sentence voice it uses for everything else. Sometimes it's right. Sometimes it isn't, and there is nothing in how the answer <em>sounds</em> that tells you which. That's hallucination. Chapter 1 already handed you half of why it happens: the model has no index to look anything up in. Here's the other half — what it does instead.
      </p>

      <h3>Next-token prediction, mechanically</h3>
      <p>
        A language model doesn't "look up" a fact as a discrete step, the way a database query would. It predicts one token at a time, each one chosen based on a probability distribution learned from patterns in its training data, conditioned on everything generated so far. There is no separate fact-checking module that runs afterward. The word that comes next is the word that statistically tends to come next in similar contexts — whether or not the resulting sentence happens to be true.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <TokenStreamAnimation />
      </Reveal>

      <h3>Parametric knowledge and its cutoff</h3>
      <p>
        Whatever a model "knows" is baked into its weights during training — statistical patterns, not stored facts. This is usually called <strong>parametric knowledge</strong>, and it comes with two hard limits. First, a cutoff: nothing that happened after training data was collected exists in the model's weights at all. Second, coverage: facts that appeared rarely in training data get encoded weakly, which means the model can produce something that sounds like a fact — same fluent tone, same sentence structure — while actually being a statistically plausible guess.
      </p>

      <h3>Confidence is not evidence</h3>
      <p>
        This is the part that trips people up, including engineers who should know better: a model's tone — hedging, certainty, the confident cadence of a complete sentence — is a stylistic pattern it learned from text, not a readout of some internal certainty meter. The same generation mechanism produces "I'm not entirely sure, but I believe..." and "The answer is definitely..." — and it produces both of those with equal ease whether the underlying claim is true or false. A newer, larger model is usually <em>more fluent</em>. That is not the same as more truthful about any specific fact it was weakly exposed to during training.
      </p>

      <CodeBlock
        execution="illustrative"
        filename="ungrounded_vs_grounded.py"
        note="conceptual — illustrates the difference, not a runnable app"
        code={`# Ungrounded — the model only has its training data to reason from
response = llm.generate(
    "What's the cancellation policy for Acme's Pro plan?"
)
# -> confident, fluent, complete sentence.
# -> also possibly entirely fabricated: nothing forced it to be right.

# Grounded — the model reads real, current text before answering
context = retrieve("Acme Pro plan cancellation policy")
response = llm.generate(
    f"Answer using only this context:\\n{context}\\n\\n"
    f"Question: What's the cancellation policy for Acme's Pro plan?"
)
# -> the answer is now traceable to an actual source document,
#    instead of resting entirely on parametric knowledge.`}
      />

      <Reveal variant="blur" duration={0.7}>
        <ConfidenceMatrixDiagram />
      </Reveal>

      <Callout icon={TriangleAlert} color="#ef4444">
        Fluency is not evidence of truth. A model's tone is generated by exactly the same mechanism whether the sentence it's building is correct or fabricated — there is no internal signal that leaks through into how confident it sounds.
      </Callout>

      <Callout icon={X} color="#f59e0b">
        Common mistake: believing hallucination is a problem that gets solved down to zero, or that a bigger/newer model simply hallucinates less as a rule. Neither is true in general — scale improves fluency and broad coverage, but on any specific rare, recent, or niche fact, a bigger model can be just as confidently wrong as a smaller one.
      </Callout>

      <Callout icon={Sparkles} color="#3b82f6">
        This is precisely the gap RAG is built to close — not by making the model smarter, but by giving it something real to read before it answers. That's the entire subject of the next chapter.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"Explain, mechanically, why an LLM hallucinates."</strong> A strong answer doesn't just say "it makes things up" — it names the mechanism: the model generates text one token at a time from a learned probability distribution, with no separate step that checks the result against ground truth. Confident-sounding output and fabricated output are produced by the identical process, which is why tone can't be used to tell them apart.
      </p>

      <Quiz
        question="True or false: RAG eliminates hallucination entirely."
        options={[
          "True — grounding a model in retrieved context guarantees a correct answer",
          "False — grounding reduces hallucination but doesn't guarantee correctness",
        ]}
        correct={1}
        explain="Retrieval can fail to find the right passage, and even with the right passage in hand, a model can still deviate from what the context actually says. Grounding lowers the hallucination rate substantially — it doesn't zero it out. You'll see exactly how to measure and reduce what's left in the evaluation chapters later in this book."
      />

      <SummaryCard points={[
        "LLMs generate text one token at a time from a learned probability distribution — there is no built-in fact-checking step.",
        "What a model \"knows\" is parametric knowledge: statistical patterns baked into its weights, bounded by a training cutoff and weak on rare facts.",
        "Tone and fluency are stylistic patterns, not a correctness signal — confident and wrong is generated exactly the same way as confident and right.",
      ]} />

      <p>
        You now have the full diagnosis: retrieval has a rich history (Chapter 1) and generation has a structural blind spot (this chapter). The next chapter puts those two facts together and states, precisely, why pairing them — rather than fixing either one in isolation — is what RAG actually is.
      </p>

      <ChapterPrevNext
        prev={{ id: "history-of-ir", title: "History of Information Retrieval" }}
        next={{ id: "why-rag-exists", title: "Why RAG Exists" }}
        go={go}
      />
    </>
  );
}
