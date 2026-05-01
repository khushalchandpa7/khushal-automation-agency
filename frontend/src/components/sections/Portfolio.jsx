import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import { fetchPortfolio } from "../../lib/api";
import { useEntrance } from "../../hooks/useEntrance";

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const ref = useEntrance({
    stagger: 0.08,
    y: 28,
    refreshKey: `${status}:${projects.length}`,
  });

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio()
      .then((data) => {
        if (cancelled) return;
        setProjects(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={ref}>
    <SectionWrap
      id="portfolio"
      eyebrow="Recent work"
      title="Real automations. Real time saved."
      lede="A few of the workflows we've built for clients across SaaS, DTC, and professional services."
    >
      {status === "loading" && (
        <p data-entrance className="text-ink-subtle">Loading recent work…</p>
      )}

      {status === "error" && (
        <div
          data-entrance
          className="flex items-center gap-3 p-5 rounded-2xl border border-accent-tangerine/30 bg-accent-tangerine/5 text-ink-base"
        >
          <AlertCircle size={18} className="text-accent-tangerine" />
          <p className="text-sm">
            Couldn't load portfolio. Make sure the backend is running on{" "}
            <code className="font-mono text-xs">{import.meta.env.VITE_API_URL || "http://localhost:4000"}</code>.
          </p>
        </div>
      )}

      {status === "ready" && projects.length === 0 && (
        <p data-entrance className="text-ink-subtle">No projects yet.</p>
      )}

      {status === "ready" && projects.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <article
              key={p.id}
              data-entrance
              className="rounded-3xl bg-white border border-ink-base/8 p-8 shadow-soft hover:shadow-lift transition-shadow"
            >
              <h3 className="text-xl font-semibold leading-tight">{p.title}</h3>
              <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                {p.description}
              </p>
              <div className="mt-5 flex items-start gap-2 text-sm">
                <CheckCircle2
                  size={16}
                  className="text-accent-mint-deep mt-0.5 flex-shrink-0"
                />
                <span className="font-medium text-ink-base">{p.metrics}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.toolsUsed.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-ink-base/5 text-ink-muted"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionWrap>
    </div>
  );
}

export default Portfolio;
