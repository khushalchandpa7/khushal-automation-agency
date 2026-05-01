import {
  Bot,
  CheckCircle2,
  Database,
  FileText,
  Mail,
  MessageSquare,
  Send,
  Workflow,
} from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import { useEntrance } from "../../hooks/useEntrance";

const demos = [
  {
    title: "Inbound lead routing",
    result: "Qualified lead in CRM and Slack in under 5 seconds.",
    steps: [
      { label: "Form submitted", Icon: FileText },
      { label: "AI scores fit", Icon: Bot },
      { label: "CRM updated", Icon: Database },
      { label: "Sales alerted", Icon: MessageSquare },
    ],
  },
  {
    title: "Invoice processing",
    result: "Line items extracted, checked, and ready for finance review.",
    steps: [
      { label: "Email received", Icon: Mail },
      { label: "PDF extracted", Icon: Bot },
      { label: "Totals matched", Icon: CheckCircle2 },
      { label: "Report sent", Icon: Send },
    ],
  },
  {
    title: "Ops reporting loop",
    result: "Daily operating snapshot delivered without spreadsheet chasing.",
    steps: [
      { label: "Data synced", Icon: Database },
      { label: "Rules applied", Icon: Workflow },
      { label: "Exceptions flagged", Icon: CheckCircle2 },
      { label: "Digest posted", Icon: MessageSquare },
    ],
  },
];

function WorkflowDemos() {
  const ref = useEntrance({ stagger: 0.08, y: 28 });

  return (
    <div ref={ref}>
      <SectionWrap
        id="workflow-demos"
        eyebrow="Workflow demos"
        title="See the kind of systems we put behind the scenes."
        lede="These mini maps show what your team experiences: one trigger starts a reliable chain of extraction, validation, updates, and alerts."
      >
        <div className="grid lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <article
              key={demo.title}
              data-entrance
              className="rounded-3xl border border-ink-base/8 bg-white p-7 shadow-soft"
            >
              <h3 className="text-xl font-semibold">{demo.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {demo.result}
              </p>

              <div className="mt-7 space-y-3">
                {demo.steps.map((step, index) => {
                  const Icon = step.Icon;
                  const isLast = index === demo.steps.length - 1;
                  return (
                    <div key={step.label} className="relative flex gap-4">
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="absolute left-5 top-11 h-7 w-px bg-ink-base/10"
                        />
                      )}
                      <span
                        className={`relative z-10 grid h-10 w-10 flex-shrink-0 place-items-center rounded-2xl ${
                          index === 1
                            ? "bg-accent-mint text-ink-base animate-pulse"
                            : "bg-bg-base text-ink-muted"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0 rounded-2xl border border-ink-base/8 bg-bg-base px-4 py-2 text-sm font-medium text-ink-base">
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </SectionWrap>
    </div>
  );
}

export default WorkflowDemos;
