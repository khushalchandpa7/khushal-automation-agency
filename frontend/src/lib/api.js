import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// 60s timeout: Render free-tier web services spin down after 15 min of
// inactivity and take 30-60s to cold-start. A short timeout here would surface
// "Couldn't load" errors to the first visitor of every idle period.
export const api = axios.create({
  baseURL,
  timeout: 60000,
});

/**
 * Wrap a request in a single retry. If the first attempt times out or fails
 * with a network error, retry once after a short delay — this catches the
 * common "Render woke up halfway through" case where the second request
 * succeeds immediately because the dyno is now warm.
 */
async function withRetry(fn, { retries = 1, delayMs = 1500 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isRetryable =
        err.code === "ECONNABORTED" ||
        err.code === "ERR_NETWORK" ||
        err.code === "ETIMEDOUT" ||
        (err.response && err.response.status >= 502 && err.response.status <= 504);
      if (!isRetryable || attempt === retries) break;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastError;
}

export async function fetchPortfolio() {
  const { data } = await withRetry(() => api.get("/api/portfolio"));
  return data;
}

export async function submitLead(payload) {
  const { data } = await withRetry(() => api.post("/api/leads", payload));
  return data;
}
