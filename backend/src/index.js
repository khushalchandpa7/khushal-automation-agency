require("dotenv").config();
const express = require("express");
const cors = require("cors");

const leadsRouter = require("./routes/leads");
const portfolioRouter = require("./routes/portfolio");

const app = express();

const PORT = process.env.PORT || 4000;

// CORS_ORIGIN accepts a single origin or a comma-separated list.
// In production, list the deployed frontend URL plus any preview domains, e.g.:
//   CORS_ORIGIN=https://khushalautomation.com,https://khushal-automation-agency.vercel.app
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/server-to-server requests (no Origin header) and
      // any origin in the allowlist.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
    credentials: true,
  }),
);
// Render terminates TLS at its edge proxy. Trust the first proxy hop so
// req.ip and secure cookies behave correctly in production.
app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/leads", leadsRouter);
app.use("/api/portfolio", portfolioRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, _next) => {
  const stack = err && err.stack ? err.stack : err;
  console.error(`[error] ${req.method} ${req.originalUrl}`, stack);

  if (err && err.code === "P2002") {
    return res.status(409).json({ error: "Duplicate entry" });
  }

  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`CORS origins: ${ALLOWED_ORIGINS.join(", ")}`);
});
