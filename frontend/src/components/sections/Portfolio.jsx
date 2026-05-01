import { useEffect, useState } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, X } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import { fetchPortfolio } from "../../lib/api";
import { useEntrance } from "../../hooks/useEntrance";

const caseStudies = {
  "Invoice Reconciliation for a 50-Person Accounting Firm": {
    problem:
      "Finance staff were copying invoice details from email into spreadsheets, then checking totals against their accounting system by hand.",
    workflow: [
      "Gmail watches for vendor invoices",
      "AI extracts line items and totals",
      "Rules validate totals and vendor names",
      "QuickBooks updates and Slack flags exceptions",
    ],
    result:
      "The team kept human review for exceptions, but removed the repetitive copy-check-post loop.",
    savings: "$2,800+/month in recovered finance time",
  },
  "Lead Routing for a B2B SaaS Sales Team": {
    problem:
      "Inbound demo requests sat in a queue until someone enriched, scored, and assigned them manually.",
    workflow: [
      "Website form triggers webhook",
      "Lead gets enriched and scored",
      "HubSpot owner is assigned",
      "Slack alert posts with next action",
    ],
    result:
      "Qualified leads reached the right rep while intent was still warm.",
    savings: "Lead response time dropped from 36 hours to 4 seconds",
  },
  "Daily Inventory Sync for a DTC Brand": {
    problem:
      "Ops compared Shopify inventory, warehouse exports, and stock reports every morning to catch drift.",
    workflow: [
      "Shopify and 3PL data sync nightly",
      "Drift rules compare SKU counts",
      "Replenishment tasks are created",
      "Slack digest summarizes risks",
    ],
    result:
      "The team moved from spreadsheet checking to exception review.",
    savings: "Stock-outs cut by 73%",
  },
  "Onboarding Automation for an HR Tech Startup": {
    problem:
      "Every new hire required the same account setup, welcome docs, and first-week scheduling tasks.",
    workflow: [
      "New-hire form starts the workflow",
      "Accounts are provisioned",
      "Welcome packet is generated",
      "Calendly and manager reminders are sent",
    ],
    result:
      "People ops kept control of approvals while routine setup became automatic.",
    savings: "3 hours saved per hire",
  },
};

function getCaseStudy(project) {
  return (
    caseStudies[project.title] || {
      problem:
        "A recurring operational workflow was taking skilled team members away from higher-value work.",
      workflow: [
        "Trigger captures the event",
        "Data is cleaned and validated",
        "Systems are updated",
        "Team gets an exception alert",
      ],
      result: project.description,
      savings: project.metrics,
    }
  );
}

function CaseStudyModal({ project, onClose }) {
  const detail = getCaseStudy(project);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-panel-base/70 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-surface-base p-6 shadow-lift md:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-mint-deep">
              Case study
            </p>
            <h3
              id="case-study-title"
              className="mt-3 text-2xl font-semibold md:text-4xl"
            >
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border border-surface-strong bg-surface-base text-ink-muted transition-colors hover:text-ink-base"
            aria-label="Close case study"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <section className="rounded-2xl border border-surface-border bg-surface-base p-5">
            <h4 className="font-semibold">Problem</h4>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {detail.problem}
            </p>
          </section>
          <section className="rounded-2xl border border-surface-border bg-surface-base p-5">
            <h4 className="font-semibold">Result</h4>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {detail.result}
            </p>
          </section>
          <section className="rounded-2xl border border-accent-mint/40 bg-accent-mint/15 p-5">
            <h4 className="font-semibold">Time and money saved</h4>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-ink-base">
              {detail.savings}
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-surface-border bg-surface-base p-5">
          <h4 className="font-semibold">Workflow map</h4>
          <ol className="mt-5 grid gap-3 md:grid-cols-4">
            {detail.workflow.map((step, index) => (
              <li key={step} className="relative rounded-2xl bg-surface-soft p-4">
                <span className="text-xs font-mono font-semibold text-accent-mint-deep">
                  0{index + 1}
                </span>
                <p className="mt-2 text-sm font-medium leading-snug">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6">
          <h4 className="font-semibold">Tools used</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {(project.toolsUsed || []).map((tool) => (
              <span
                key={tool}
                className="rounded-full bg-surface-soft px-3 py-1.5 text-xs font-semibold text-ink-muted"
              >
                {tool}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedProject, setSelectedProject] = useState(null);
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
        lede="A few of the workflows we have built for clients across SaaS, DTC, and professional services."
      >
        {status === "loading" && (
          <p data-entrance className="text-ink-subtle">
            Loading recent work...
          </p>
        )}

        {status === "error" && (
          <div
            data-entrance
            className="flex items-center gap-3 rounded-2xl border border-accent-tangerine/30 bg-accent-tangerine/5 p-5 text-ink-base"
          >
            <AlertCircle size={18} className="text-accent-tangerine" />
            <p className="text-sm">
              Couldn't load portfolio. Make sure the backend is running on{" "}
              <code className="font-mono text-xs">
                {import.meta.env.VITE_API_URL || "http://localhost:4000"}
              </code>
              .
            </p>
          </div>
        )}

        {status === "ready" && projects.length === 0 && (
          <p data-entrance className="text-ink-subtle">
            No projects yet.
          </p>
        )}

        {status === "ready" && projects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <article
                key={p.id}
                data-entrance
                className="rounded-3xl border border-surface-border bg-surface-base p-8 shadow-soft transition-shadow hover:shadow-lift"
              >
                <h3 className="text-xl font-semibold leading-tight">
                  {p.title}
                </h3>
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
                  {(p.toolsUsed || []).map((tool) => (
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
        )}
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
