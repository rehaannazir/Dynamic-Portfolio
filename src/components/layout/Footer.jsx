import { memo } from "react";
import { ArrowRight, ChevronRight, GitFork, Link, Mail } from "lucide-react";
import { Reveal } from "@/lib/motion";

export const Footer = memo(function Footer({ setPage }) {
  const navLinks = [
    { id: "home", label: "Home", num: "01" },
    { id: "services", label: "Services", num: "02" },
    { id: "reviews", label: "Reviews", num: "03" },
    { id: "blog", label: "Blog", num: "04" },
  ];
  const socials = [
    { Icon: GitFork, label: "GitHub", href: "https://github.com/rehaannazir" },
    { Icon: Link, label: "LinkedIn", href: "https://www.linkedin.com/in/rehan-nazir-530597332" },
    { Icon: Mail, label: "Email", href: "mailto:rehaan689nazir@gmail.com" },
  ];
  return (
    <footer className="relative z-10 mt-6 overflow-hidden">
      {/* top glow line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.6) 30%,rgba(139,92,246,0.6) 70%,transparent)" }} />

      {/* ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#3b82f6,transparent 70%)", filter: "blur(20px)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)", filter: "blur(20px)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-8">

        {/* CTA strip */}
        <Reveal>
          <div className="rounded-2xl mb-14 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(139,92,246,0.15))", border: "1px solid rgba(139,92,246,0.3)" }}>
            <div>
              <p className="text-white font-semibold text-lg">Have a process worth automating?</p>
              <p className="text-slate-400 text-sm mt-1">Let's build something that runs itself.</p>
            </div>
            <button
              onClick={() => { setPage("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150); }}
              className="btn-glow shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white text-sm"
              style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
              data-cursor>
              Start a project <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Reveal>

        {/* main grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* brand col */}
          <Reveal className="space-y-5">
            <div className="flex items-center gap-3">
              <picture>
                <source type="image/avif" srcSet="/logo-40.avif 40w, /logo-80.avif 80w, /logo-120.avif 120w" sizes="40px" />
                <source type="image/webp" srcSet="/logo-40.webp 40w, /logo-80.webp 80w, /logo-120.webp 120w" sizes="40px" />
                <img src="/logo-40.png" alt="Nexara" width="40" height="40" className="w-10 h-10 object-contain shrink-0" style={{ filter: "drop-shadow(0 0 8px rgba(99,102,241,0.6))" }} />
              </picture>
              <div>
                <span className="mono text-base text-white font-medium">rehan.nazir<span className="text-indigo-400">()</span></span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "vpulse 2s ease-in-out infinite" }} />
                  <span className="mono text-[10px] text-emerald-400">available for projects</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              AI Engineer &amp; Automation Specialist. Building intelligent, self-running systems. <span className="text-indigo-300">Design. Build. Deploy. AI.</span>
            </p>
            <div className="mono text-xs text-slate-400 flex items-center gap-2">
              <span className="text-indigo-400">//</span> Lahore, Pakistan · 2026
            </div>
          </Reveal>

          {/* navigate col */}
          <Reveal delay={0.08}>
            <div className="mono text-xs uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
              <span className="text-indigo-400">#</span> Navigate
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map(({ id, label, num }) => (
                <button
                  key={id}
                  onClick={() => setPage(id)}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 hover:bg-white/5"
                  data-cursor>
                  <span className="mono text-[11px] text-indigo-400/60 group-hover:text-indigo-400 transition-colors w-5">{num}</span>
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          </Reveal>

          {/* connect col */}
          <Reveal delay={0.16}>
            <div className="mono text-xs uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
              <span className="text-indigo-400">#</span> Connect
            </div>
            <div className="grid grid-cols-2 gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl glass transition-all duration-300 hover:border-indigo-500/50"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  data-cursor>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.25))" }}>
                    <Icon className="w-3.5 h-3.5 text-indigo-300" />
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{label}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="mono text-xs text-slate-400">© 2026 Rehan Nazir — Nexara.</span>
          <div className="flex items-center gap-2">
            {["LLMs", "FAST API", "REST APIs", "AI Agents"].map((t) => (
              <span key={t} className="mono text-[10px] px-2.5 py-1 rounded-full text-slate-400"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
});
