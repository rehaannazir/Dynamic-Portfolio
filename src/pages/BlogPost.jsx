import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { SITE_URL } from "@/constants";
import { POSTS } from "@/blog/posts";
import { PythonAutomationPost } from "@/blog/python-ideal-for-automation/articleLoader";

/* Mirrors the real article's hero (`minHeight: 88vh`, centered column) so the swap from
   fallback to loaded content resizes nothing already painted above the fold. Content that
   mounts below the fold (the rest of the ~8-min article) never shifts anything visible,
   since it only appends after this block — it doesn't need its own height reserved. */
function ArticleSkeleton() {
  return (
    <div className="relative overflow-hidden" style={{ minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "center" }} role="status" aria-live="polite" aria-label="Loading article">
      <div className="relative z-10 text-center max-w-5xl mx-auto px-5 pt-16 pb-20 w-full">
        <div className="h-5 w-32 mx-auto rounded bg-white/5 animate-pulse mb-10" />
        <div className="h-7 w-56 mx-auto rounded-full bg-white/5 animate-pulse mb-8" />
        <div className="h-12 w-full max-w-3xl mx-auto rounded bg-white/5 animate-pulse mb-4" />
        <div className="h-12 w-2/3 mx-auto rounded bg-white/5 animate-pulse mb-8" />
        <div className="h-5 w-full max-w-xl mx-auto rounded bg-white/5 animate-pulse mb-3" />
        <div className="h-5 w-1/2 mx-auto rounded bg-white/5 animate-pulse mb-8" />
        <div className="h-9 w-64 mx-auto rounded-full bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

function BackToBlog({ back }) {
  return (
    <button onClick={back} className="inline-flex items-center gap-2 text-sm mono text-slate-400 hover:text-indigo-300 transition-colors mb-8"><ArrowLeft className="w-4 h-4" /> All blog posts</button>
  );
}

/* ===================== BLOG POST ===================== */
export function BlogPost({ slug, back, openArticle }) {
  const meta = POSTS.find((p) => p.slug === slug) || POSTS[0];
  const isMain = slug === "python-ideal-for-automation";

  if (!isMain) {
    return (
      <div className="max-w-3xl mx-auto px-5 pt-12 pb-24">
        <Helmet>
          <title>{meta.title} — Rehan Nazir</title>
          <meta name="description" content={meta.excerpt} />
          <link rel="canonical" href={`${SITE_URL}/blog/${meta.slug}`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`${SITE_URL}/blog/${meta.slug}`} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.excerpt} />
          <meta property="article:author" content="Rehan Nazir" />
          <meta property="article:published_time" content={meta.isoDate} />
          <meta property="article:section" content={meta.cat} />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": meta.title,
            "description": meta.excerpt,
            "datePublished": meta.isoDate,
            "url": `${SITE_URL}/blog/${meta.slug}`,
            "author": { "@type": "Person", "name": "Rehan Nazir", "url": SITE_URL },
            "publisher": { "@type": "Organization", "name": "Nexara", "url": SITE_URL },
            "articleSection": meta.cat,
            "timeRequired": meta.read
          })}</script>
        </Helmet>
        <BackToBlog back={back} />
        <span className="text-xs mono px-3 py-1 rounded-full glass text-indigo-200">{meta.cat}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mt-5 leading-tight">{meta.title}</h1>
        <p className="text-slate-400 mt-4">{meta.excerpt}</p>
        <div className="glass rounded-2xl p-10 mt-10 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-indigo-300 mb-4" />
          <h2 className="text-xl font-semibold text-white">This article is coming soon.</h2>
          <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">The full write-up for this post is still in drafts. The "Why Python is Ideal for Automation" article is fully built out — open that one to see the complete layout.</p>
          <button onClick={() => openArticle("python-ideal-for-automation")} className="btn-glow mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>Read the finished article <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <PythonAutomationPost back={back} openArticle={openArticle} />
    </Suspense>
  );
}
