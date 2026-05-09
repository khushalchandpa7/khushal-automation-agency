import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import CaseStudyModal from "./CaseStudyModal";
import { useEntrance } from "../../hooks/useEntrance";
import { portfolioProjects } from "../../constants/portfolioProjects";

function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  const ref = useEntrance({
    stagger: 0.08,
    y: 28,
    refreshKey: portfolioProjects.length,
  });

  return (
    <div ref={ref}>
      <SectionWrap
        id="portfolio"
        eyebrow="Recent work"
        title="Real automations. Real time saved."
        lede="A few of the workflows we have built for clients across SaaS, DTC, and professional services."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {portfolioProjects.map((p) => (
            <article
              key={p.id}
              data-entrance
              className="rounded-3xl border border-surface-border bg-surface-base p-8 shadow-soft transition-shadow hover:shadow-lift"
            >
              <h3 className="text-xl font-semibold leading-tight">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {p.description}
              </p>
              <div className="mt-5 flex items-start gap-2 text-sm">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-accent-mint-deep"
                />
                <span className="font-medium text-ink-base">{p.metrics}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.toolsUsed.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-surface-soft px-2.5 py-1 text-xs font-medium text-ink-muted"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(p)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-base transition-colors hover:text-accent-tangerine-deep"
              >
                View case study
                <ArrowUpRight size={16} />
              </button>
            </article>
          ))}
        </div>
      </SectionWrap>

      {selectedProject && (
        <CaseStudyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

export default Portfolio;
