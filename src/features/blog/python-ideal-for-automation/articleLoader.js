import { lazy } from "react";

// Single source of truth for the article's dynamic import — used both to code-split it via
// lazy() and to prefetch it ahead of navigation (idle-triggered / on hover, see Blog.jsx).
// React.lazy's own import() call then resolves instantly from the already-warm module cache.
const importArticle = () => import("./PythonAutomationPost");

export const PythonAutomationPost = lazy(importArticle);
export const prefetchMainArticle = importArticle;
