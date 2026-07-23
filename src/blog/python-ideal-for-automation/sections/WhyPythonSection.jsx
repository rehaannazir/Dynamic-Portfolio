import { CircleCheck } from "lucide-react";
import { Reveal } from "@/lib/motion";

/* ── WHY PYTHON ───────────────────────── */
export function WhyPythonSection() {
  return (
    <>
      <h2 id="why-python">Why Python Won</h2>
      <p>
        Every major language can automate tasks. Bash can run system commands. PowerShell owns Windows administration. JavaScript runs everywhere the web does. Go compiles to tiny, fast binaries. Yet Python is the one language that engineers reach for first when the goal is automation, and for reasons that are structural rather than fashionable.
      </p>

      <h3>Syntax that reads like intent</h3>
      <p>
        Consider finding every PDF in a directory tree. In Python: <code>Path(".").rglob("*.pdf")</code>. That is not a simplification — it is the real code. Python's syntax is close enough to natural language that you can often read a script aloud and be understood by a non-programmer. This matters for automation because automation scripts are maintained by humans long after they are written. Readable code survives; clever code rots.
      </p>

      <h3>Batteries included, ecosystem unlimited</h3>
      <p>
        Python ships with a standard library that covers file I/O, HTTP, JSON, CSV, SQLite, email, threading, subprocess control, and more — all without a single <code>pip install</code>. Beyond the standard library, PyPI hosts over 430,000 packages. Whatever automation category you are working in, someone has already built and tested the hard parts.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <div className="not-prose grid sm:grid-cols-2 gap-3 my-7">
          {[
            ["Simple syntax", "Reads like English. A junior developer can maintain your automation scripts without deciphering them."],
            ["Cross-platform", "The same Python script runs on Windows, macOS, and Linux. Write once, deploy anywhere your clients or servers operate."],
            ["430,000+ packages", "Every automation category — web, data, AI, desktop, scheduling — has multiple mature, well-documented libraries waiting."],
            ["8M+ developers", "The largest programming community means your error message is probably already answered on Stack Overflow."],
            ["AI-first", "OpenAI, Anthropic, Hugging Face, and LangChain all ship Python SDKs first. Python is the language of the AI era."],
            ["Rapid iteration", "Prototype an idea in 20 lines, test it in the REPL, ship it as a scheduled job. The feedback loop is uniquely fast."],
          ].map(([t, d]) => (
            <div key={t} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
                <CircleCheck className="w-4 h-4 text-indigo-400 shrink-0" />{t}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed m-0">{d}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <h3>The companies that chose Python</h3>
      <p>
        Google used Python to automate their original web-crawling infrastructure. Instagram runs on Python at a scale of over a billion users. Dropbox's desktop client was Python. NASA scripts mission-critical data pipelines in Python. Spotify uses it for data engineering. These are not toy projects — they are proof that Python scales from a weekend script to enterprise infrastructure.
      </p>
    </>
  );
}
