import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/constants";
import { TOC } from "./toc";
import { Hero } from "./sections/Hero";
import { StatsBar } from "./sections/StatsBar";
import { TocSidebar } from "./sections/TocSidebar";
import { HistoryOfIrSection } from "./sections/HistoryOfIrSection";
import { WhyLlmsHallucinateSection } from "./sections/WhyLlmsHallucinateSection";
import { WhyRagExistsSection } from "./sections/WhyRagExistsSection";
import { EvolutionToRagSection } from "./sections/EvolutionToRagSection";
import { VectorsSection } from "./sections/VectorsSection";
import { EmbeddingsSection } from "./sections/EmbeddingsSection";
import { DistanceMetricsSection } from "./sections/DistanceMetricsSection";
import { CosineSimilaritySection } from "./sections/CosineSimilaritySection";
import { DotProductSection } from "./sections/DotProductSection";
import { EuclideanDistanceSection } from "./sections/EuclideanDistanceSection";

/* ─────────────────────────────────────────────────────────
   RAG MASTER GUIDE — same composition pattern as
   PythonAutomationPost: owns scroll-spy state and metadata,
   renders no prose itself. Chapters are added to the prose
   column (and to toc.js) one at a time as they're written.
───────────────────────────────────────────────────────── */
export default function RagProductionGuidePost({ back }) {
  const [active, setActive] = useState(TOC[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    TOC.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <article itemScope itemType="https://schema.org/BlogPosting">
      <Helmet>
        <title>Retrieval-Augmented Generation: The Complete Engineering Guide | Nexara</title>
        <meta name="description" content="The complete, chapter-by-chapter guide to RAG — from information retrieval history to production-grade multi-tenant systems. Real code, math, diagrams, and interactive tools." />
        <link rel="canonical" href={`${SITE_URL}/blog/rag-production-guide`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/blog/rag-production-guide`} />
        <meta property="og:title" content="Retrieval-Augmented Generation: The Complete Engineering Guide | Nexara" />
        <meta property="og:description" content="87 chapters, zero to production: RAG history, math, retrieval, indexing, vector databases, advanced retrieval, agentic RAG, production engineering, and evaluation." />
        <meta name="keywords" content="retrieval augmented generation,RAG tutorial,vector database,embeddings,RAG architecture,hybrid search,RAG evaluation,agentic RAG" />
        <meta property="article:author" content="Rehan Nazir" />
        <meta property="article:published_time" content="2026-07-24" />
        <meta property="article:section" content="AI Engineering" />
        <meta property="article:tag" content="RAG" />
        <meta property="article:tag" content="vector databases" />
        <meta property="article:tag" content="embeddings" />
        <meta property="article:tag" content="LLM" />
      </Helmet>

      <Hero back={back} go={go} />
      <StatsBar />

      <div className="max-w-6xl mx-auto px-5 pb-24">
        <div className="grid lg:grid-cols-[220px_1fr] gap-12">
          <TocSidebar active={active} go={go} />

          <div className="prose-blog max-w-2xl min-w-0">
            <HistoryOfIrSection go={go} />
            <WhyLlmsHallucinateSection go={go} />
            <WhyRagExistsSection go={go} />
            <EvolutionToRagSection go={go} />
            <VectorsSection go={go} />
            <EmbeddingsSection go={go} />
            <DistanceMetricsSection go={go} />
            <CosineSimilaritySection go={go} />
            <DotProductSection go={go} />
            <EuclideanDistanceSection go={go} />
          </div>
        </div>
      </div>
    </article>
  );
}
