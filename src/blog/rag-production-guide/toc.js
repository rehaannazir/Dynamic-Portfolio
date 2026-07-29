// Each entry belongs to a Part (per the approved 87-chapter architecture). Only chapters that
// exist as written content go here — TocSidebar renders whatever this list currently contains,
// and ChapterHeader/ChapterPrevNext check membership here to decide whether a link is live or
// "not yet published". The id must match the chapter's <h2 id="..."> anchor.
export const TOC = [
  { id: "history-of-ir", t: "History of Information Retrieval", part: "Part I — Foundations" },
  { id: "why-llms-hallucinate", t: "Why LLMs Hallucinate", part: "Part I — Foundations" },
  { id: "why-rag-exists", t: "Why RAG Exists", part: "Part I — Foundations" },
  { id: "evolution-search-to-rag", t: "Evolution from Search Engines to RAG", part: "Part I — Foundations" },
  { id: "vectors", t: "Vectors", part: "Part II — Mathematical Foundations" },
  { id: "embeddings", t: "Embeddings", part: "Part II — Mathematical Foundations" },
  { id: "distance-metrics", t: "Distance Metrics", part: "Part II — Mathematical Foundations" },
  { id: "cosine-similarity", t: "Cosine Similarity", part: "Part II — Mathematical Foundations" },
  { id: "dot-product", t: "Dot Product", part: "Part II — Mathematical Foundations" },
  { id: "euclidean-distance", t: "Euclidean Distance", part: "Part II — Mathematical Foundations" },
  { id: "high-dimensional-space", t: "High-Dimensional Space", part: "Part II — Mathematical Foundations" },
  { id: "ann-intuition", t: "ANN Intuition", part: "Part II — Mathematical Foundations" },
  { id: "documents", t: "Documents", part: "Part III — Core RAG Pipeline" },
  { id: "chunking", t: "Chunking", part: "Part III — Core RAG Pipeline" },
  { id: "generating-embeddings", t: "Generating Embeddings for Your Pipeline", part: "Part III — Core RAG Pipeline" },
  { id: "vector-storage", t: "Vector Databases: The Storage Layer", part: "Part III — Core RAG Pipeline" },
  { id: "retrieval", t: "Retrieval", part: "Part III — Core RAG Pipeline" },
  { id: "prompt-construction", t: "Prompt Construction", part: "Part III — Core RAG Pipeline" },
  { id: "llm-response-generation", t: "LLM Response Generation", part: "Part III — Core RAG Pipeline" },
  { id: "grounding", t: "Grounding", part: "Part III — Core RAG Pipeline" },
];
