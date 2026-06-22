from models import Project, ServiceItem, Review, Post

PROJECTS: list[Project] = [
    Project(
        n="01",
        cat="FastAPI · Gemini",
        title="AI Content Automation API",
        desc="Production backend that generates, categorizes and schedules content via LLMs behind a clean REST interface.",
        role="Full Stack · AI · 2026",
        stack=["FastAPI", "Gemini", "SQLAlchemy"],
    ),
    Project(
        n="02",
        cat="n8n · LLMs",
        title="B2B Sales Automation Flow",
        desc="End-to-end lead enrichment and outreach pipeline that runs hands-free and hands off cleanly to the client.",
        role="Automation · 2026",
        stack=["n8n", "LLMs", "APIs"],
    ),
    Project(
        n="03",
        cat="Python · Gemini",
        title="Finance Expense Categorizer",
        desc="Turns raw CSV bank exports into categorized, analysis-ready Excel sheets automatically.",
        role="AI Tooling · 2025",
        stack=["Python", "Gemini", "Pandas"],
    ),
    Project(
        n="04",
        cat="RAG · Agents",
        title="Support Chatbot Agent",
        desc="Context-aware support agent grounded in company docs, deployed across web and messaging channels.",
        role="AI Agents · 2025",
        stack=["RAG", "Agents", "React"],
    ),
]

SERVICES: list[ServiceItem] = [
    ServiceItem(
        title="AI Chatbots & Agents",
        desc="Context-aware assistants and autonomous agents trained on your data, deployed across web and messaging.",
        points=["RAG over your docs", "Multi-channel deploy", "Human-in-the-loop ready"],
    ),
    ServiceItem(
        title="B2B Sales Automation",
        desc="Lead enrichment, qualification and personalized outreach pipelines that run without manual lifting.",
        points=["Lead enrichment", "Personalized outreach", "CRM sync"],
    ),
    ServiceItem(
        title="Content Automation APIs",
        desc="Production-grade FastAPI backends that generate, categorize and schedule content via LLMs.",
        points=["REST API", "LLM pipelines", "Scalable backend"],
    ),
    ServiceItem(
        title="Custom Workflow Automation",
        desc="End-to-end n8n + AI workflows that connect your tools and remove repetitive ops entirely.",
        points=["n8n orchestration", "API integrations", "Hands-off handoff"],
    ),
    ServiceItem(
        title="Agentic Systems",
        desc="Multi-step reasoning agents that plan, call tools and execute tasks autonomously.",
        points=["Tool calling", "Task planning", "Reliable execution"],
    ),
    ServiceItem(
        title="SaaS MVP Builds",
        desc="From idea to a polished, futuristic web product — frontend, backend and AI baked in.",
        points=["React + Vite", "API backend", "Modern UI/UX"],
    ),
]

REVIEWS: list[Review] = [
    Review(
        name="Sarah Khan",
        role="Founder, BrightLeads",
        rating=5,
        text="Rehan rebuilt our entire lead pipeline as an automated system. What used to take hours now runs on its own. Genuinely impressive.",
    ),
    Review(
        name="Daniel Mehta",
        role="CEO, NovaCommerce",
        rating=5,
        text="The support chatbot he delivered handles 70% of our tickets. Clean handoff, great docs, zero headaches.",
    ),
    Review(
        name="Aisha Raza",
        role="Ops Lead, FinTrack",
        rating=5,
        text="Our CSV chaos is gone. The categorizer he built just works. Fast, reliable, exactly what we asked for.",
    ),
    Review(
        name="Omar Siddiqui",
        role="Director, ScaleHub",
        rating=5,
        text="Communicated clearly the whole way and delivered a system that runs without us touching it. Will hire again.",
    ),
    Review(
        name="Lena Fischer",
        role="Marketing Head, Vireo",
        rating=4,
        text="The content automation API saved us a ton of time. Solid backend work and responsive throughout.",
    ),
    Review(
        name="Hamza Ali",
        role="Owner, HN Foods",
        rating=5,
        text="Built our site and automated our order flow beautifully. Professional, futuristic and on time.",
    ),
]

POSTS: list[Post] = [
    Post(
        slug="systems-not-scripts",
        title="Why I build systems, not scripts",
        cat="Automation",
        date="12 Jun 2026",
        read="6 min",
        excerpt="The real value of AI automation isn't a clever script — it's a system a business can rely on without you. How I think about the difference.",
        featured=True,
    ),
    Post(
        slug="production-ai-content-api",
        title="Building a production AI content API",
        cat="Engineering",
        date="28 May 2026",
        read="8 min",
        excerpt="Architecting a FastAPI + Gemini backend that's clean, scalable and ready to hand off to a client.",
    ),
    Post(
        slug="rag-chatbots-that-help",
        title="RAG chatbots that actually help",
        cat="AI Agents",
        date="14 May 2026",
        read="6 min",
        excerpt="Most chatbots frustrate users. The fix is grounding them in real context. A practical look at retrieval-augmented agents.",
    ),
    Post(
        slug="n8n-llms-freelancer-edge",
        title="n8n + LLMs: the freelancer's edge",
        cat="Workflow",
        date="30 Apr 2026",
        read="4 min",
        excerpt="How combining n8n orchestration with language models lets a solo builder deliver agency-level automation.",
    ),
    Post(
        slug="freelancing-to-ai-company",
        title="From freelancing to an AI company",
        cat="Strategy",
        date="18 Apr 2026",
        read="7 min",
        excerpt="My roadmap from done-for-you services to a productized SaaS — and the niche decisions driving it.",
    ),
    Post(
        slug="algo-trading-meets-automation",
        title="Algorithmic trading meets automation",
        cat="Trading",
        date="02 Apr 2026",
        read="6 min",
        excerpt="Trading, ML and automation share one loop: data → pattern → test → execute. Why learning them together compounds.",
    ),
]

POSTS_BY_SLUG: dict[str, Post] = {p.slug: p for p in POSTS}
