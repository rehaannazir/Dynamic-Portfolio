import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { SITE_URL } from "@/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { POSTS } from "@/blog/posts";
import { BlogVisual } from "@/blog/BlogVisual";
import { prefetchMainArticle } from "@/blog/python-ideal-for-automation/articleLoader";

/* ===================== BLOG ===================== */
export function Blog({ openArticle }) {
  const feat = POSTS[0];
  useEffect(() => {
    // Warms the module cache for the flagship article so the Suspense fallback in BlogPost
    // almost never has to paint for real users (idle-prefetched here, or on hover/focus of
    // its link below) — React.lazy's own import() then resolves instantly.
    const id = "requestIdleCallback" in window
      ? window.requestIdleCallback(prefetchMainArticle, { timeout: 2000 })
      : setTimeout(prefetchMainArticle, 300);
    return () => ("requestIdleCallback" in window ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);
  return (
    <>
      <Helmet>
        <title>Blog — AI Automation & Engineering | Rehan Nazir</title>
        <meta name="description" content="Practical notes on AI engineering, workflow automation, n8n, RAG chatbots and building systems that run themselves. By Rehan Nazir, AI Engineer and Founder of Nexara." />
        <link rel="canonical" href={SITE_URL + "/blog"} />
        <meta property="og:url" content={SITE_URL + "/blog"} />
        <meta property="og:title" content="Blog — AI Automation & Engineering | Rehan Nazir" />
        <meta property="og:description" content="Practical notes on AI engineering, workflow automation, n8n, RAG chatbots and building systems that run themselves." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Rehan Nazir — Notes on Building with AI",
          "url": SITE_URL + "/#blog",
          "author": { "@type": "Person", "name": "Rehan Nazir" },
          "description": "Thoughts on AI, automation, building systems and the road to a real tech company.",
          "blogPost": POSTS.map(p => ({
            "@type": "BlogPosting",
            "headline": p.title,
            "description": p.excerpt,
            "datePublished": p.isoDate,
            "url": `${SITE_URL}/blog/${p.slug}`,
            "author": { "@type": "Person", "name": "Rehan Nazir" }
          }))
        })}</script>
      </Helmet>
      <section className="grid-bg"><div className="max-w-6xl mx-auto px-5 pt-20 pb-6">
        <Reveal><SectionLabel num="04">Blog</SectionLabel></Reveal>
        <Reveal><h1 className="text-4xl md:text-5xl font-bold text-white">Notes on playing <span className="grad-text">with AI</span>.</h1></Reveal>
        <Reveal delay={0.1}><p className="max-w-2xl mt-5 text-slate-400">Field notes on AI engineering, automation systems and the road to building a real AI company.</p></Reveal>
        <Reveal delay={0.16}><div className="flex items-center gap-3 mt-6">
          {["All","Engineering","AI Agents","Workflow","Strategy"].map((t,i)=>(
            <button key={t} className={`px-3.5 py-1.5 rounded-full text-xs mono transition-all duration-500 ${i===0?"text-white":"text-slate-400 hover:text-white"}`} style={i===0?{background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}:{border:"1px solid rgba(255,255,255,0.08)"}}>{t}</button>
          ))}
        </div></Reveal>
      </div></section>
      <section className="max-w-6xl mx-auto px-5 py-10">
        <Reveal><div className="group glass glass-hover rounded-3xl overflow-hidden grid md:grid-cols-2" data-cursor>
          <div className="relative min-h-[220px] overflow-hidden"><BlogVisual cat={feat.cat} /></div>
          <div className="p-8 flex flex-col justify-center">
            <span className="text-xs mono px-3 py-1 rounded-full glass w-fit text-indigo-200 mb-4">featured</span>
            <h2 className="text-2xl font-bold text-white">{feat.title}</h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">{feat.excerpt}</p>
            <div className="flex items-center gap-4 mt-5 text-xs mono text-slate-400"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{feat.date}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{feat.read}</span></div>
            <button onClick={() => openArticle(feat.slug)} onMouseEnter={prefetchMainArticle} onFocus={prefetchMainArticle} className="btn-glow mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white w-fit" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Read article <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div></Reveal>
      </section>
      <section className="max-w-6xl mx-auto px-5 py-6"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {POSTS.slice(1).map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.08}>
            <article className="glass glass-hover rounded-2xl overflow-hidden group h-full flex flex-col" data-cursor>
              <div className="h-40 relative overflow-hidden"><BlogVisual cat={p.cat} /><span className="absolute top-3 left-3 z-10 text-[11px] mono px-2.5 py-1 rounded-full text-white" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>{p.cat}</span></div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white font-semibold leading-snug group-hover:text-indigo-200 transition-colors">{p.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed flex-1">{p.excerpt}</p>
                <div className="flex items-center gap-4 mt-4 text-xs mono text-slate-400"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{p.date}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{p.read}</span></div>
                <button onClick={() => openArticle(p.slug)} className="mt-4 inline-flex items-center gap-1.5 text-sm mono text-indigo-300 hover:text-white transition-colors w-fit">Read article →</button>
              </div>
            </article>
          </Reveal>
        ))}
      </div></section>
    </>
  );
}
