import { Callout } from "../components/Callout";

/* ── INTRODUCTION ─────────────────────── */
export function IntroductionSection() {
  return (
    <>
      <h2 id="introduction">Introduction</h2>
      <p>
        Automation is the art of making software do what humans do manually — but faster, more reliably, and without ever getting tired. Python has become the dominant language for this discipline not by accident, but because every design decision in the language compounds into an advantage when you are building systems that need to run without supervision.
      </p>
      <p>
        Today, Python automation spans an enormous range: rename ten thousand files in two seconds, monitor a production API every five minutes, scrape and summarise a competitor's pricing page every morning, fill out browser forms that have no API, process quarterly sales data into a formatted Excel report, or orchestrate a chain of GPT-4o calls that research, write, and publish content. Every one of these is a Python job, and each one uses the same straightforward language you could learn in a weekend.
      </p>
      <p>
        This guide is a complete reference. It starts with <em>why Python</em> and works all the way through to a production-grade pipeline that combines web scraping, AI summarisation, a database, scheduling, and Slack notifications — in under 80 lines of code. Every section has real, runnable examples. By the end you will not just understand Python automation: you will be ready to build it.
      </p>

      <Callout color="#6366f1">
        <strong>Who this is for:</strong> beginners who want to learn automation from scratch, and intermediate developers who want a single comprehensive reference for Python's automation ecosystem.
      </Callout>
    </>
  );
}
