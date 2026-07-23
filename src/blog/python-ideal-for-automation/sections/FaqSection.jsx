import { FaqItem } from "../components/FaqItem";

/* ── FAQ ──────────────────────────────── */
const FAQS = [
  ["Is Python fast enough for production automation?",
   "For I/O-bound automation — web scraping, API calls, file operations, database queries — Python is fast enough. The bottleneck is almost always the network or disk, not the language. For CPU-bound tasks like image processing or number crunching, use multiprocessing or offload to a compiled library like NumPy, which runs at C speed under the hood."],
  ["Do I need to learn asyncio to automate tasks?",
   "No. Most automation tasks work fine with synchronous code. You only need asyncio when you want to do many things at the same time — like fetching 50 API endpoints simultaneously. If you are just running one job sequentially, synchronous requests and a for loop are perfectly appropriate."],
  ["How do I run my Python automation on a schedule without leaving my laptop on?",
   "Deploy it to a cloud VM (DigitalOcean, AWS EC2, or a free-tier VPS) and use the system cron or the schedule library to trigger it. Alternatively, use a serverless platform (AWS Lambda, Google Cloud Functions) for event-based automation that only runs when needed."],
  ["What is the difference between Selenium and Playwright?",
   "Both automate real browsers. Selenium is older, has more tutorials and Stack Overflow answers, and works with every language. Playwright is newer, async-first, and better at handling modern JavaScript-heavy sites. If you are starting fresh, Playwright is the better choice. If you are maintaining existing Selenium code, there is no rush to migrate."],
  ["Is Python good for automating AI workflows?",
   "Python is the primary language of the AI ecosystem. OpenAI, Anthropic, Hugging Face, LangChain, LlamaIndex, and virtually every other AI framework ships its Python SDK first. If you want to build automated pipelines that use LLMs, embeddings, or local models, Python is not just good — it is the obvious choice."],
  ["How do I handle credentials and API keys securely in automation scripts?",
   "Never hardcode secrets in your code. Use environment variables (os.environ.get) and a .env file with a library like python-dotenv for local development. In production, use a secrets manager (AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault). Always add .env to your .gitignore."],
];

export function FaqSection() {
  return (
    <>
      <h2 id="faq">Frequently Asked Questions</h2>
      <div className="not-prose space-y-3">
        {FAQS.map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
      </div>
    </>
  );
}
