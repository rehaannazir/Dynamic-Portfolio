import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { onScrollFrame, prefersReduced, smoothTo, useSmoothScroll, useSpotlight } from "@/lib/motion";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { ChapterRail } from "@/components/ui/ChapterRail";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { Reviews } from "@/pages/Reviews";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";

/* ===================== APP ===================== */
function getStateFromPath(path) {
  const p = path || window.location.pathname;
  if (p.startsWith("/blog/")) return { page: "article", article: p.slice(6).replace(/\/$/, "") || null };
  if (/^\/services\/?$/.test(p)) return { page: "services", article: null };
  if (/^\/reviews\/?$/.test(p)) return { page: "reviews", article: null };
  if (/^\/blog\/?$/.test(p)) return { page: "blog", article: null };
  return { page: "home", article: null };
}

export default function Portfolio() {
  const initial = getStateFromPath();
  const [page, setPage] = useState(initial.page);
  const [article, setArticle] = useState(initial.article);
  useSmoothScroll();
  useEffect(() => { smoothTo(0, { duration: 0.8 }); }, [page, article]);
  // Background depth — drift the ambient layer with scroll, via the shared scroll dispatcher.
  useEffect(() => {
    if (prefersReduced()) return;
    return onScrollFrame({ write: (y) => document.documentElement.style.setProperty("--sy", String(y)) });
  }, []);
  // Pause EVERY section's animations (CSS + SVG/SMIL) while it's off-screen — nothing animates
  // unless you're actually looking at it. Big idle-CPU/GPU saving across the whole page.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const off = !e.isIntersecting;
        e.target.toggleAttribute("data-offscreen", off);
        e.target.querySelectorAll("svg").forEach((svg) => { try { off ? svg.pauseAnimations() : svg.unpauseAnimations(); } catch { /* not an animated SVG */ } });
      });
    }, { rootMargin: "200px 0px" });
    document.querySelectorAll("main section").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page, article]);
  useEffect(() => {
    const onPop = () => { const s = getStateFromPath(); setPage(s.page); setArticle(s.article); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  // Pointer-reactive spotlight + subtle 3D tilt on every glass card (one delegated listener).
  useSpotlight();
  const navigate = useCallback((newPage) => {
    const paths = { home: "/", services: "/services", reviews: "/reviews", blog: "/blog" };
    window.history.pushState({}, "", paths[newPage] || "/");
    setPage(newPage);
  }, []);
  const goArticle = useCallback((slug) => { window.history.pushState({}, "", `/blog/${slug}`); setArticle(slug); setPage("article"); }, []);

  return (
    <div className="nocursor min-h-screen w-full text-slate-200 relative overflow-x-hidden"
      style={{ background: "radial-gradient(1200px 600px at 12% -10%, rgba(59,130,246,0.035), transparent 60%), radial-gradient(1000px 700px at 92% 8%, rgba(139,92,246,0.04), transparent 60%), #000000", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <CustomCursor />
      {page === "article" && <ReadingProgress />}
      {page === "home" && <ChapterRail />}

      <AmbientBackground />

      <Header page={page} article={article} navigate={navigate} />

      <main className="relative z-10" key={page + (article || "")}>
        {page === "home" && <Home setPage={navigate} />}
        {page === "services" && <Services />}
        {page === "reviews" && <Reviews />}
        {page === "blog" && <Blog openArticle={goArticle} />}
        {page === "article" && (<><BlogPost slug={article} back={() => navigate("blog")} openArticle={goArticle} /><div className="max-w-6xl mx-auto px-5 pb-20 flex justify-center"><button onClick={() => navigate("blog")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-200 glass glass-hover" data-cursor><ArrowLeft className="w-4 h-4" /> Back to all blogs</button></div></>)}
      </main>

      <Footer setPage={navigate} />
    </div>
  );
}
