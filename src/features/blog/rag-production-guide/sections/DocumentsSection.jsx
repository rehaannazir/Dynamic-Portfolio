import { X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { DocumentCleaningDiagram } from "../components/DocumentCleaningDiagram";

/* ── CHAPTER 13 — DOCUMENTS ─────────────────────────────────
   Part III · Core RAG Pipeline · Beginner · 8 min · opens Part III, depends on Ch.12 */
export function DocumentsSection({ go }) {
  return (
    <>
      <ChapterHeader num="13" part="Part III — Core RAG Pipeline" difficulty="Beginner" time="8 min"
        depends={[{ id: "ann-intuition", label: "ANN Intuition" }]} go={go} color="#3b82f6" />
      <h2 id="documents">Documents</h2>

      <LearningGoalCard goals={[
        "Recognize the main document formats a RAG pipeline has to ingest, and what makes each one messy",
        "Understand why cleaning happens before chunking, not after",
        "Know why document structure (headers, tables) is worth preserving through cleaning, not stripping blindly",
      ]} />

      <p>
        Part II gave you the math. Part III builds the actual pipeline, stage by stage, and it starts at the least glamorous place possible: what a "document" even is once it stops being a clean example sentence and becomes a real file someone handed you.
      </p>

      <h3>Every format is messy in its own way</h3>
      <p>
        <strong>PDFs</strong> are the hardest case in ordinary use — they encode visual layout, not structure, so extracting "the text" can scramble multi-column layouts, headers, footers, and page numbers into the middle of sentences. <strong>HTML</strong> carries navigation bars, ads, and markup that has nothing to do with the actual content. <strong>Markdown</strong> is usually the closest to clean already, since it was written to be read as-is. <strong>DOCX</strong> files carry styling and embedded tables that need to be handled deliberately rather than flattened. None of these differences are exotic edge cases — a real production corpus is almost always a mix of several.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <DocumentCleaningDiagram />
      </Reveal>

      <h3>Cleaning before chunking, on purpose</h3>
      <p>
        Cleaning happens first because chunking (next chapter) works on the assumption that it's dividing coherent text — a boilerplate footer or a stray page number sitting in the middle of a paragraph will get chunked right along with the real content, and that noise then rides through embedding, storage, and retrieval, degrading everything downstream. Garbage that gets past this stage doesn't announce itself later; it just quietly makes retrieval slightly worse in a way that's hard to trace back to its source.
      </p>
      <p>
        Structure is worth keeping deliberately, not stripping. A markdown header, an HTML table, or a DOCX heading level is signal — it tells you where one logical section ends and another begins, which chunking strategies in the next chapter can use directly. Cleaning should remove noise, not flatten every document into one undifferentiated wall of text.
      </p>

      <CodeBlock
        execution="illustrative"
        filename="load_and_clean.py"
        note="conceptual — actual library choice (unstructured, pymupdf, etc.) varies by format"
        code={`def load_and_clean(path):
    raw = load_raw_text(path)          # format-specific: PDF/HTML/DOCX/Markdown loader

    text = strip_boilerplate(raw)       # headers, footers, nav bars, page numbers
    text = normalize_whitespace(text)   # collapse repeated blank lines/spaces
    text = preserve_structure(text)     # keep headings/tables as markers, don't flatten them

    return text

# Downstream stages (chunking, embedding, storage) all assume this
# normalized shape — inconsistent cleaning here is invisible until
# retrieval quality quietly degrades, with no error to point at.`}
      />

      <Callout icon={X} color="#f59e0b">
        Common mistake: treating every source format as equally easy to extract clean text from, and applying one generic extraction step to all of them. A pipeline that works fine on Markdown can silently mangle a two-column PDF — test cleaning quality per format, not just once on your easiest example file.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"What preprocessing steps matter most before chunking a PDF corpus?"</strong> Stripping layout artifacts that don't belong in running text — headers, footers, page numbers, and multi-column reflow errors — while preserving real structural signal like section headings and tables, since chunking and later retrieval both depend on the input actually being coherent prose, not layout noise wearing the shape of text.
      </p>

      <Quiz
        question="Which is generally hardest to extract clean, structured text from?"
        options={["Markdown", "HTML", "A scanned PDF"]}
        correct={2}
        explain="A scanned PDF is an image of a page, not encoded text — it requires OCR before any of the usual cleaning steps even apply, and OCR introduces its own error rate. Markdown is closest to clean already; HTML is messy but at least structurally explicit."
      />

      <SummaryCard points={[
        "Real document corpora mix formats, each with different noise: PDFs encode layout not structure, HTML carries markup, DOCX carries styling.",
        "Cleaning happens before chunking specifically because chunking assumes it's dividing coherent text — noise left in rides through the entire pipeline.",
        "Structure (headings, tables) is signal worth preserving through cleaning, not flattening away.",
      ]} />

      <p>
        With clean, structure-aware text in hand, the next decision is how to cut it into pieces small enough to retrieve precisely, without cutting so small that each piece loses the context that made it meaningful. That's chunking — arguably the single most-tuned parameter in this entire book.
      </p>

      <ChapterPrevNext
        prev={{ id: "ann-intuition", title: "ANN Intuition" }}
        next={{ id: "chunking", title: "Chunking" }}
        go={go}
      />
    </>
  );
}
