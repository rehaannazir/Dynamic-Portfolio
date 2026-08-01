import { Sparkles, X } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { Callout } from "../components/Callout";
import { ChapterHeader } from "../components/ChapterHeader";
import { LearningGoalCard } from "../components/LearningGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { Quiz } from "../components/Quiz";
import { ChapterPrevNext } from "../components/ChapterPrevNext";
import { CodeBlock } from "../components/CodeBlock";
import { VectorPlotDiagram } from "../components/VectorPlotDiagram";

/* ── CHAPTER 5 — VECTORS ───────────────────────────────────
   Part II · Mathematical Foundations · Beginner · 6 min · opens Part II, depends on Ch.4 */
export function VectorsSection({ go }) {
  return (
    <>
      <ChapterHeader num="05" part="Part II — Mathematical Foundations" difficulty="Beginner" time="6 min"
        depends={[{ id: "evolution-search-to-rag", label: "Evolution from Search Engines to RAG" }]} go={go} color="#8b5cf6" />
      <h2 id="vectors">Vectors</h2>

      <LearningGoalCard goals={[
        "Define a vector both geometrically (an arrow) and algebraically (a list of numbers)",
        "Perform vector addition and scalar multiplication, and know what each one means geometrically",
        "Understand why AI represents meaning as a list of numbers in the first place",
      ]} />

      <p>
        Part I told you what RAG is and why it exists. Part II builds the vocabulary underneath it — starting with the single object every embedding, every similarity score, and every index in this book is made of. It's a simpler idea than the word "vector" tends to suggest.
      </p>

      <h3>A vector is a list of numbers with a place to point</h3>
      <p>
        If you give someone directions — "walk 4 blocks east, then 3 blocks north" — you've just described a vector. Two numbers, <code>[4, 3]</code>, and a starting point. Draw it, and it's an arrow: starting at the origin, ending at a specific point in space. That's all a vector is, formally: an ordered list of numbers, each one a <strong>component</strong>, and the count of numbers is its <strong>dimensionality</strong>. <code>[4, 3]</code> is a 2-dimensional vector. <code>[4, 3, 7]</code> is 3-dimensional, and now describes a point in space rather than on a flat plane.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <VectorPlotDiagram />
      </Reveal>

      <h3>From directions to dimensions nobody can draw</h3>
      <p>
        Here's the part that matters for everything downstream: nothing about the math requires you to be able to picture it. A vector with 768 components — a completely ordinary size for a text embedding, which you'll meet in the next chapter — works by exactly the same rules as <code>[4, 3]</code>. You add them the same way, scale them the same way, measure distance and angle between them the same way. You'll never draw a 768-dimensional arrow, and you don't need to; the two-number version on this page is a faithful, if humble, stand-in for the real thing.
      </p>

      <h3>The two operations worth knowing cold</h3>
      <p>
        <strong>Addition</strong> combines two vectors component by component: <code>[4, 3] + [1, 2] = [5, 5]</code>. Geometrically, this is "walk the first vector, then walk the second one from wherever you ended up." <strong>Scalar multiplication</strong> stretches or shrinks a vector without changing its direction: <code>2 × [4, 3] = [8, 6]</code> — same direction, twice as long. Both operations reappear constantly once you get to embeddings: averaging several vectors is repeated addition and scaling; normalizing a vector's length (which the next few chapters lean on heavily) is scalar multiplication by a carefully chosen factor.
      </p>

      <CodeBlock
        execution="runnable"
        filename="vectors.py"
        code={`import numpy as np

a = np.array([4, 3])
b = np.array([1, 2])

print(a + b)        # -> [5 5]      (addition, component-wise)
print(2 * a)         # -> [8 6]      (scalar multiplication, same direction, 2x length)
print(len(a))         # -> 2          (dimensionality — how many components)

embedding = np.random.rand(768)   # a realistic embedding size — same rules, more numbers
print(embedding.shape)            # -> (768,)`}
      />

      <Callout icon={Sparkles} color="#3b82f6">
        Vectors aren't an AI invention — they're centuries old, from physics and geometry, used to describe force, velocity, and position long before anyone used one to describe the meaning of a sentence. AI didn't reinvent the vector. It found a new thing worth pointing one at.
      </Callout>

      <Callout icon={X} color="#f59e0b">
        Common mistake: confusing a vector's <em>dimensionality</em> (how many numbers are in the list) with the <em>number of vectors</em> in a dataset. A collection of a million 768-dimensional embeddings is a million separate vectors, each one 768 numbers long — dimensionality and dataset size are completely independent quantities.
      </Callout>

      <p className="not-prose mt-8 mb-2">
        <span className="mono text-xs uppercase tracking-wide text-slate-400">Interview question</span>
      </p>
      <p>
        <strong>"What is a vector in a machine learning context, and why represent data this way?"</strong> A vector is an ordered list of numbers describing a point or direction in space. ML represents data as vectors because it turns "how similar are these two things" into a computable geometric question — distance and angle — rather than something that has to be judged by hand. That's the entire premise the next chapter builds on.
      </p>

      <Quiz
        question="What is the magnitude (length) of the vector [3, 4]?"
        options={["5", "7", "12"]}
        correct={0}
        explain="Magnitude is computed the same way as Euclidean distance from the origin: √(3² + 4²) = √25 = 5. This is the same 3-4-5 triangle you'll see again when Euclidean distance is covered in depth."
      />

      <SummaryCard points={[
        "A vector is an ordered list of numbers — geometrically an arrow, algebraically a list of components.",
        "Addition and scalar multiplication are the two operations worth knowing cold; both reappear throughout the rest of this Part.",
        "The math works identically at 2 dimensions or 768 — you just lose the ability to draw it past 3.",
      ]} />

      <p>
        A vector, on its own, doesn't mean anything — <code>[4, 3]</code> could be a location, a color, or nothing at all. The next chapter is about what happens when a vector is trained, specifically, so that its position in space actually corresponds to meaning. That's an embedding.
      </p>

      <ChapterPrevNext
        prev={{ id: "evolution-search-to-rag", title: "Evolution from Search Engines to RAG" }}
        next={{ id: "embeddings", title: "Embeddings" }}
        go={go}
      />
    </>
  );
}
