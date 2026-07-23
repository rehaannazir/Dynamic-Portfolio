import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { smoothTo, useMagnetic } from "@/lib/motion";

const NAV = [
  { id: "home", label: "home", num: "01" }, { id: "services", label: "services", num: "02" },
  { id: "reviews", label: "reviews", num: "03" }, { id: "blog", label: "blog", num: "04" },
];

export function Header({ page, article, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hireRef = useMagnetic();
  useEffect(() => { setMenuOpen(false); }, [page, article]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button onClick={() => navigate("home")} className="flex items-center gap-2">
            <picture>
              <source type="image/avif" srcSet="/logo-40.avif 40w, /logo-80.avif 80w, /logo-120.avif 120w" sizes="36px" />
              <source type="image/webp" srcSet="/logo-40.webp 40w, /logo-80.webp 80w, /logo-120.webp 120w" sizes="36px" />
              <img src="/logo-40.png" alt="Nexara" width="36" height="36" className="w-9 h-9 object-contain" style={{ filter: "drop-shadow(0 0 8px rgba(99,102,241,0.6))" }} />
            </picture>
            <span className="mono text-sm text-white">rehan.nazir<span className="text-indigo-400">()</span></span>
          </button>
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => navigate(n.id)} className={"px-3 py-2 rounded-lg text-sm mono transition-all flex items-center gap-1.5 " + ((page === n.id || (page === "article" && n.id === "blog")) ? "text-white" : "text-slate-400 hover:text-white")} style={(page === n.id || (page === "article" && n.id === "blog")) ? { background: "rgba(99,102,241,0.14)", border: "1px solid rgba(139,92,246,0.4)" } : {}}>
                <span className="text-indigo-400 text-xs">{n.num}</span>{n.label}
              </button>
            ))}
            <button ref={hireRef} onClick={() => { navigate("home"); setTimeout(() => smoothTo(document.getElementById("contact"), { offset: -80 }), 180); }} className="btn-glow magnetic ml-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>hire me →</button>
          </nav>
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
        {menuOpen && (
          <div className="md:hidden glass border-t border-white/5 px-5 py-3 flex flex-col gap-1">
            {NAV.map((n) => (<button key={n.id} onClick={() => navigate(n.id)} className={"px-4 py-3 rounded-lg text-sm mono text-left flex items-center gap-2 " + (page === n.id ? "text-white bg-white/5" : "text-slate-400")}><span className="text-indigo-400 text-xs">{n.num}</span>{n.label}</button>))}
          </div>
        )}
      </div>
    </header>
  );
}
