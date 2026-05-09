import {
  BadgeCheck,
  BookOpen,
  Clock3,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import Button from "../ui/Button";
import { useEntrance } from "../../hooks/useEntrance";
import { useRiyaBooking } from "../ui/useRiyaBooking";

const proofSignals = [
  {
    icon: ShieldCheck,
    title: "Fixed-scope builds",
    body: "Clear scope, clear handoff, and no surprise retainers unless you want ongoing support.",
  },
  {
    icon: Clock3,
    title: "Typical delivery: 2-4 weeks",
    body: "Small enough to ship quickly, structured enough to handle real operational edge cases.",
  },
  {
    icon: BookOpen,
    title: "Documentation included",
    body: "Every workflow ships with a plain-English runbook so your team can operate it confidently.",
  },
  {
    icon: Headphones,
    title: "Post-launch support",
    body: "Optional support for tweaks, monitoring, new tool changes, and workflow improvements.",
  },
];

function TrustProof() {
  const ref = useEntrance({ stagger: 0.08, y: 28 });
  const { startCall } = useRiyaBooking();

  return (
    <div ref={ref}>
      <SectionWrap
        id="proof"
        eyebrow="Trust signals"
        title="Built for teams that need outcomes, not automation theater."
        lede="We build across SaaS, DTC, agencies, ops teams, and service businesses where repetitive work quietly eats margin."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {proofSignals.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                data-entrance
                className="rounded-3xl border border-surface-border bg-surface-base p-6 shadow-soft"
              >
                <Icon size={22} className="text-accent-mint-deep" />
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>

        <div
          data-entrance
          className="mt-8 rounded-3xl bg-accent-mint p-7 md:p-8 text-accent-contrast"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <BadgeCheck size={18} />
                Better first step
              </div>
              <h3 className="mt-3 text-2xl font-semibold">
                Ready to remove the manual work? Start with the calculator or
                book a meeting with Riya.
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                as="a"
                href="#roi-calculator"
                variant="secondary"
              >
                Calculate Savings
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="border-accent-contrast/20 text-accent-contrast hover:border-accent-contrast/40 hover:text-accent-contrast"
                onClick={startCall}
              >
                Book a Meeting
              </Button>
            </div>
          </div>
        </div>
      </SectionWrap>
    </div>
  );
}

export default TrustProof;
