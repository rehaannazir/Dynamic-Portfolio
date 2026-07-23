import { Reveal } from "@/lib/motion";
import { ArchDiagram } from "../components/ArchDiagram";
import { LazyMount } from "../components/LazyMount";
import { WorkflowCanvas } from "../components/WorkflowCanvas";

/* ── ARCHITECTURE ─────────────────────── */
export function ArchitectureSection() {
  return (
    <>
      <h2 id="architecture">Automation Architecture</h2>
      <p>
        Every Python automation, no matter how simple or complex, follows the same five-stage anatomy. Understanding this pattern is the most important conceptual step in the discipline — it is what separates a script that works once from a system that runs indefinitely.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <ArchDiagram />
      </Reveal>

      <p>
        The <strong>Trigger</strong> decides when the automation runs — a file change, a time-based schedule, an incoming webhook, or a queue message. The <strong>Python Logic</strong> contains your actual business rules. The <strong>Libraries</strong> handle the heavy lifting (HTTP, parsing, data transformation). The <strong>Output</strong> is the action that creates value: writing a file, inserting a database row, sending a notification, calling an API. The <strong>Monitor</strong> layer — logs, retry logic, and alerts — is what makes the automation trustworthy enough to hand off.
      </p>
      <p>
        The feedback arrow matters: a well-built automation loops back to the trigger and keeps running without human attention. This is the architectural distinction between a one-shot script and a production system.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <div className="glass rounded-2xl p-5 my-8 not-prose relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <p className="text-xs mono text-slate-400 mb-3 relative">// Three.js workflow graph — nodes pulse, particles travel connections in real time</p>
          <div className="relative rounded-xl overflow-hidden" style={{ height: 300 }}>
            <LazyMount><WorkflowCanvas /></LazyMount>
          </div>
          <p className="text-xs text-center text-slate-400 mono mt-2 relative">Trigger → fetch → schedule → Python core → store → notify → done. Move your mouse to rotate the graph.</p>
        </div>
      </Reveal>
    </>
  );
}
