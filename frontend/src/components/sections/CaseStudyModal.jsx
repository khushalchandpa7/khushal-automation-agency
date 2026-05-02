import { useEffect } from "react";
import { X } from "lucide-react";
import { getCaseStudy } from "../../constants/caseStudies";

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

export default CaseStudyModal;
