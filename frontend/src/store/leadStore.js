import { create } from "zustand";
import { submitLead } from "../lib/api";
import { getUtmCampaign, useIntelligenceStore } from "./intelligenceStore";

const initialForm = {
  name: "",
  email: "",
  company: "",
  painPoints: "",
  website: "", // honeypot — humans never see this
};

// Lightweight client-side validation. Mirrors the server's Zod schema so users
// get fast feedback before the round-trip. The server is still the source of
// truth — anything that slips past here will still be caught by Zod.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateClient(form) {
  const errors = {};
  const name = (form.name || "").trim();
  const email = (form.email || "").trim();
  const company = (form.company || "").trim();
  const painPoints = (form.painPoints || "").trim();

  if (!name) errors.name = ["Name is required"];
  else if (name.length > 100) errors.name = ["Name is too long"];

  if (!email) errors.email = ["Please enter a valid email"];
  else if (!EMAIL_RE.test(email))
    errors.email = ["Please enter a valid email"];
  else if (email.length > 200) errors.email = ["Email is too long"];

  if (company && company.length > 150)
    errors.company = ["Company name is too long"];

  if (!painPoints || painPoints.length < 10)
    errors.painPoints = ["Tell us a bit more (at least 10 characters)"];
  else if (painPoints.length > 2000)
    errors.painPoints = ["Please keep this under 2000 characters"];

  return errors;
}

function buildLeadPayload(form) {
  const intelligence = useIntelligenceStore.getState();
  const quizRecommendation = intelligence.quiz?.recommendation?.title;

  return {
    ...form,
    sourceSection: intelligence.lastSourceSection || "lead-form",
    selectedPainPoint: intelligence.selectedPainPoint || undefined,
    roiMonthlyLoss: intelligence.roi?.monthlyLoss,
    roiPayload: intelligence.roi || undefined,
    quizAnswers: intelligence.quiz?.answers || undefined,
    recommendedAutomation: quizRecommendation || undefined,
    utmCampaign: getUtmCampaign(),
  };
}

export const useLeadStore = create((set, get) => ({
  form: { ...initialForm },
  status: "idle", // 'idle' | 'submitting' | 'success' | 'error'
  fieldErrors: {},
  errorMessage: null,

  setField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
      fieldErrors: { ...state.fieldErrors, [field]: undefined },
    })),

  reset: () =>
    set({
      form: { ...initialForm },
      status: "idle",
      fieldErrors: {},
      errorMessage: null,
    }),

  submit: async () => {
    const { form } = get();

    // Client-side pre-flight — skip the round-trip if we already know it's bad.
    const clientErrors = validateClient(form);
    if (Object.keys(clientErrors).length > 0) {
      set({
        status: "error",
        fieldErrors: clientErrors,
        errorMessage: "Please check the highlighted fields.",
      });
      const err = new Error("client-validation-failed");
      err.fieldErrors = clientErrors;
      throw err;
    }

    set({ status: "submitting", fieldErrors: {}, errorMessage: null });
    try {
      const lead = await submitLead(buildLeadPayload(form));
      set({ status: "success", errorMessage: null });
      return lead;
    } catch (err) {
      const data = err?.response?.data;
      if (data?.fields) {
        set({
          status: "error",
          fieldErrors: data.fields,
          errorMessage: "Please check the highlighted fields.",
        });
      } else {
        set({
          status: "error",
          fieldErrors: {},
          errorMessage:
            data?.error || "Something went wrong. Please try again.",
        });
      }
      throw err;
    }
  },
}));
