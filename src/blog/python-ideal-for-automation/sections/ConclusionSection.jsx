import { ArrowRight } from "lucide-react";
import { Reveal } from "@/lib/motion";

const RELATED = [
  { slug: "production-ai-content-api", cat: "Engineering", title: "Building a production AI content API" },
  { slug: "rag-chatbots-that-help",    cat: "AI Agents",   title: "RAG chatbots that actually help" },
  { slug: "n8n-llms-freelancer-edge",  cat: "Workflow",    title: "n8n + LLMs: the freelancer's edge" },
  { slug: "algo-trading-meets-automation", cat: "Trading", title: "Algorithmic trading meets automation" },
];

/* ── CONCLUSION ───────────────────────── */
export function ConclusionSection({ openArticle }) {
  return (
    <>
      <h2 id="where-next">Where to Go Next</h2>
      <p>
        You now have a complete map of Python automation: the conceptual architecture, the essential libraries from file system to AI, production code patterns, and the composition principle that turns individual scripts into reliable systems.
      </p>
      <p>
        The best next move is to pick one real problem you face today — a daily report you generate manually, a file-cleanup task you do every week, an API you check by hand — and build the simplest Python solution that solves it. Then add scheduling, logging, and error handling until it runs itself. Repeat for the next problem. That loop, applied consistently, is how automation compounds into infrastructure.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <div className="not-prose grid sm:grid-cols-2 gap-3 mt-8">
          {RELATED.map((p) => (
            <button key={p.slug} onClick={() => openArticle(p.slug)}
              className="glass glass-hover rounded-xl p-4 text-left" data-cursor>
              <div className="mono text-[11px] text-indigo-300/70">{p.cat}</div>
              <div className="text-white font-medium text-sm mt-1">{p.title}</div>
              <div className="text-indigo-300 text-xs mono mt-2 flex items-center gap-1">
                Read article <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </Reveal>
    </>
  );
}
