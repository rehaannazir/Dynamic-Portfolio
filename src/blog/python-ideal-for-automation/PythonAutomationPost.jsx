import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/constants";
import { TOC } from "./toc";
import { Hero } from "./sections/Hero";
import { StatsBar } from "./sections/StatsBar";
import { TocSidebar } from "./sections/TocSidebar";
import { IntroductionSection } from "./sections/IntroductionSection";
import { WhyPythonSection } from "./sections/WhyPythonSection";
import { ArchitectureSection } from "./sections/ArchitectureSection";
import { FileSystemSection } from "./sections/FileSystemSection";
import { WebHttpSection } from "./sections/WebHttpSection";
import { BrowserAutomationSection } from "./sections/BrowserAutomationSection";
import { DataProcessingSection } from "./sections/DataProcessingSection";
import { DatabasesSection } from "./sections/DatabasesSection";
import { AsyncSection } from "./sections/AsyncSection";
import { AiAutomationSection } from "./sections/AiAutomationSection";
import { PipelineSection } from "./sections/PipelineSection";
import { FaqSection } from "./sections/FaqSection";
import { ConclusionSection } from "./sections/ConclusionSection";
import { AuthorSection } from "./sections/AuthorSection";

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT — composes the hero, stats bar, TOC sidebar,
   and the article's content sections (each its own file under
   ./sections). This component owns only the scroll-spy state
   and metadata; it renders no prose itself.
───────────────────────────────────────────────────────── */
export default function PythonAutomationPost({ back, openArticle }) {
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
        <title>Why Python is Ideal for Automation | Nexara</title>
        <meta name="description" content="The complete guide to Python automation — from os and pathlib to Selenium, pandas, asyncio, and AI agents. Real code, interactive 3D visuals, 8 min read." />
        <link rel="canonical" href={`${SITE_URL}/blog/python-ideal-for-automation`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/blog/python-ideal-for-automation`} />
        <meta property="og:title" content="Why Python is Ideal for Automation | Nexara" />
        <meta property="og:description" content="The complete guide to Python automation — real code examples, key libraries, and interactive 3D visuals." />
        <meta name="keywords" content="python automation,python scripting,selenium python,pandas automation,python workflow automation,asyncio tutorial,python openai,langchain automation" />
        <meta property="article:author" content="Rehan Nazir" />
        <meta property="article:published_time" content="2026-06-27" />
        <meta property="article:section" content="Automation" />
        <meta property="article:tag" content="python" />
        <meta property="article:tag" content="automation" />
        <meta property="article:tag" content="selenium" />
        <meta property="article:tag" content="pandas" />
        <meta property="article:tag" content="ai" />
      </Helmet>

      <Hero back={back} go={go} />
      <StatsBar />

      <div className="max-w-6xl mx-auto px-5 pb-24">
        <div className="grid lg:grid-cols-[220px_1fr] gap-12">
          <TocSidebar active={active} go={go} />

          <div className="prose-blog max-w-2xl min-w-0">
            <IntroductionSection />
            <WhyPythonSection />
            <ArchitectureSection />
            <FileSystemSection />
            <WebHttpSection />
            <BrowserAutomationSection />
            <DataProcessingSection />
            <DatabasesSection />
            <AsyncSection />
            <AiAutomationSection />
            <PipelineSection />
            <FaqSection />
            <ConclusionSection openArticle={openArticle} />
            <AuthorSection />
          </div>
        </div>
      </div>
    </article>
  );
}
