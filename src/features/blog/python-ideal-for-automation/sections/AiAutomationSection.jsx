import { Reveal } from "@/lib/motion";
import { CodeBlock } from "../components/CodeBlock";
import { LazyMount } from "../components/LazyMount";
import { NeuralCanvas } from "../components/NeuralCanvas";

/* ── AI AUTOMATION ────────────────────── */
export function AiAutomationSection() {
  return (
    <>
      <h2 id="ai-automation">AI Automation</h2>
      <p>
        The most significant shift in automation over the last two years is the arrival of large language models as first-class automation components. Python is the primary language for every major AI SDK, which means AI-powered automation is now a Python-native capability.
      </p>

      <Reveal variant="blur" duration={0.7}>
        <div className="glass rounded-2xl relative overflow-hidden my-8 not-prose">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="relative" style={{ height: 280 }}>
            <LazyMount><NeuralCanvas /></LazyMount>
          </div>
          <p className="text-xs text-center text-slate-400 mono pb-4 px-4 relative">Neural network: pulses travel between nodes like prompts flowing through an LLM agent. Move mouse to rotate.</p>
        </div>
      </Reveal>

      <h3>openai — Intelligent Task Processing</h3>
      <p>
        The OpenAI Python SDK gives you GPT-4o, DALL-E, Whisper, and embeddings from a clean API. For automation, the most powerful use case is <em>structured output</em>: pass a list of support tickets, emails, or invoices to a model and get back categorised, summarised, or scored JSON — tasks that would otherwise require hand-coded heuristics.
      </p>
      <CodeBlock
        filename="openai_triage.py"
        note="Auto-triage support tickets with GPT-4o structured output"
        code={`from openai import OpenAI
import json

client = OpenAI()   # reads OPENAI_API_KEY from environment

def triage_tickets(tickets: list[str]) -> list[dict]:
    prompt = f"""Triage each support ticket.

Category options: bug, feature_request, billing, question, spam
Urgency:          high, medium, low

Return JSON: {{"tickets": [{{"original": "...", "category": "...", "urgency": "...", "action": "..."}}]}}

Tickets:
{json.dumps(tickets, indent=2)}"""

    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)["tickets"]

tickets = [
    "App crashes when uploading files over 10 MB",
    "Please add dark mode",
    "My invoice for June shows the wrong amount",
]
for t in triage_tickets(tickets):
    print(f"[{t['urgency'].upper():6}] {t['category']:20} → {t['action']}")`}
      />

      <h3>LangChain — AI Agents with Tools</h3>
      <p>
        LangChain goes beyond single API calls. It lets you build <em>agents</em>: AI systems that choose which tools to use, call them, observe the results, and reason about the next step. An agent can search the web, save files, query databases, and call APIs — all orchestrated by a language model in a single Python script.
      </p>
      <CodeBlock
        filename="langchain_agent.py"
        note="Research automation agent that searches and saves findings"
        code={`from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain.tools import tool
import requests

@tool
def search_news(query: str) -> str:
    """Search Hacker News for the latest stories on a topic."""
    r = requests.get(
        f"https://hn.algolia.com/api/v1/search?query={query}&hitsPerPage=5"
    )
    hits = r.json()["hits"]
    return "\\n".join(f"• {h['title']} — {h.get('url','')}" for h in hits)

@tool
def save_report(filename: str, content: str) -> str:
    """Save a text report to disk."""
    with open(filename, "w") as f:
        f.write(content)
    return f"Saved {len(content):,} chars to {filename}"

llm   = ChatOpenAI(model="gpt-4o", temperature=0)
tools = [search_news, save_report]
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a research automation agent. Use tools to gather and save information."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])
executor = AgentExecutor(
    agent=create_tool_calling_agent(llm, tools, prompt),
    tools=tools, verbose=True,
)

executor.invoke({
    "input": "Research Python automation trends in 2026 and save a summary to python_trends.txt"
})`}
      />
    </>
  );
}
