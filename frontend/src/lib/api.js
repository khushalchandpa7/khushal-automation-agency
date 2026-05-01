import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

export async function fetchPortfolio() {
  const { data } = await api.get("/api/portfolio");
  return data;
}

export async function submitLead(payload) {
  const { data } = await api.post("/api/leads", payload);
  return data;
}
