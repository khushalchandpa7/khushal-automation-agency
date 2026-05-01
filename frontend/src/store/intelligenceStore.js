import { create } from "zustand";

const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export function getUtmCampaign() {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const utm = {};

  for (const key of utmKeys) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  return Object.keys(utm).length > 0 ? utm : undefined;
}

export const useIntelligenceStore = create((set) => ({
  roi: null,
  quiz: null,
  selectedPainPoint: null,
  lastSourceSection: null,

  setRoi: (roi) =>
    set({
      roi,
      lastSourceSection: "roi-calculator",
    }),

  setQuiz: (quiz) =>
    set({
      quiz,
      selectedPainPoint: quiz?.answers?.task || null,
      lastSourceSection: "audit-quiz",
    }),

  clearQuiz: () =>
    set({
      quiz: null,
      selectedPainPoint: null,
    }),

  setSourceSection: (source) =>
    set({
      lastSourceSection: source,
    }),
}));
