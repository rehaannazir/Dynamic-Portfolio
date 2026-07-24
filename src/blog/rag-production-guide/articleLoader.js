import { lazy } from "react";

const importArticle = () => import("./RagProductionGuidePost");

export const RagProductionGuidePost = lazy(importArticle);
export const prefetchRagGuide = importArticle;
