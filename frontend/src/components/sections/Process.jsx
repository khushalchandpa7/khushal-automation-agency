import { Search, Hammer, FlaskConical, Rocket } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import { useEntrance } from "../../hooks/useEntrance";

const steps = [
  {
    icon: Search,
    title: "Discovery",
    body: "30-min call to map the routine you want gone. We leave with a one-page scope and a fixed quote.",
  },
  {
    icon: Hammer,
    title: "Build",
    body: "We design and build the automation in a sandbox using your real tools — no surprises in production.",
  },
  {
    icon: FlaskConical,
    title: "Test",
    body: "We run it against last week's actual data, you sign off on the edge cases, and we lock the workflow.",
  },
  {
    icon: Rocket,
    title: "Launch & Hand-off",
    body: "We turn it on, document everything, and hand you a runbook. Optional monthly retainer for tweaks.",
  },
];

function Process() {
  const ref = useEntrance({ stagger: 0.08, y: 28 });

  return (
    <div ref={ref}>
    <SectionWrap
      id="process"
      eyebrow="How it works"
      title="From first call to live workflow in 2–4 weeks."
      lede="No bloated SOWs, no agency hand-offs between four account managers. You work directly with the person building it."
    >
      <ol className="grid md:grid-cols-4 gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              data-entrance
              className="rounded-3xl border border-ink-base/8 p-7 bg-white hover:border-accent-mint/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono font-semibold text-ink-subtle">
                  STEP 0{i + 1}
                </span>
                <Icon size={20} className="text-accent-mint-deep" />
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                {step.body}
              </p>
            </li>
          );
        })}
      </ol>
    </SectionWrap>
    </div>
  );
}

export default Process;
