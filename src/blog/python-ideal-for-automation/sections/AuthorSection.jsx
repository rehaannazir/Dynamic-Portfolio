import { GitFork, Link, Mail } from "lucide-react";

const SOCIALS = [
  ["https://www.linkedin.com/in/rehan-nazir-530597332", Link, "Rehan Nazir on LinkedIn"],
  ["https://github.com/rehaannazir", GitFork, "Rehan Nazir on GitHub"],
  ["mailto:rehaan689nazir@gmail.com", Mail, "Email Rehan Nazir"],
];

/* ── AUTHOR ───────────────────────────── */
export function AuthorSection() {
  return (
    <div className="glass rounded-2xl p-6 mt-12 flex items-start gap-4 not-prose">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
        style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>RN</div>
      <div>
        <div className="text-white font-semibold">Rehan Nazir</div>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          AI Engineer &amp; Automation Specialist. Building intelligent, self-running systems under the Nexara brand. Python automation is the foundation of everything I build.
        </p>
        <div className="flex gap-2 mt-3">
          {SOCIALS.map(([href, Icon, label], i) => (
            <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer" aria-label={label}
              className="w-9 h-9 rounded-lg glass glass-hover flex items-center justify-center text-slate-300 hover:text-white"
              data-cursor>
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
