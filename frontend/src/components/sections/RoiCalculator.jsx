import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calculator, Clock3, DollarSign, Users } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import Button from "../ui/Button";
import { useEntrance } from "../../hooks/useEntrance";
import { useIntelligenceStore } from "../../store/intelligenceStore";

const toolOptions = [
  "Google Sheets",
  "Slack",
  "Gmail",
  "HubSpot",
  "Shopify",
  "Notion",
  "Airtable",
  "Stripe",
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function RoiCalculator() {
  const ref = useEntrance({ stagger: 0.08, y: 28 });
  const setRoi = useIntelligenceStore((state) => state.setRoi);
  const setSourceSection = useIntelligenceStore((state) => state.setSourceSection);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inputs, setInputs] = useState({
    hoursPerWeek: 12,
    hourlyCost: 45,
    peopleInvolved: 3,
    toolStack: ["Google Sheets", "Slack"],
  });

  const monthlyLoss = useMemo(
    () =>
      Math.round(
        inputs.hoursPerWeek * inputs.hourlyCost * inputs.peopleInvolved * 4.33,
      ),
    [inputs],
  );

  const annualLoss = monthlyLoss * 12;

  useEffect(() => {
    if (!hasInteracted) return;

    setRoi({
      ...inputs,
      monthlyLoss,
      annualLoss,
    });
  }, [annualLoss, hasInteracted, inputs, monthlyLoss, setRoi]);

  function updateField(field, value) {
    setHasInteracted(true);
    setInputs((current) => ({
      ...current,
      [field]: Number(value),
    }));
  }

  function toggleTool(tool) {
    setHasInteracted(true);
    setInputs((current) => {
      const hasTool = current.toolStack.includes(tool);
      return {
        ...current,
        toolStack: hasTool
          ? current.toolStack.filter((item) => item !== tool)
          : [...current.toolStack, tool],
      };
    });
  }

  return (
    <div ref={ref}>
      <SectionWrap
        id="roi-calculator"
        eyebrow="Automation ROI"
        title="Find the cost of manual work before another week slips by."
        lede="Put rough numbers into the calculator and turn vague frustration into a dollar figure your team can act on."
      >
        <div className="grid lg:grid-cols-5 gap-6">
          <div
            data-entrance
            className="lg:col-span-3 rounded-3xl bg-white border border-ink-base/8 p-7 md:p-8 shadow-soft"
          >
            <div className="grid md:grid-cols-3 gap-5">
              <label className="block rounded-2xl border border-ink-base/10 p-5">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Clock3 size={17} className="text-accent-mint-deep" />
                  Hours wasted/week
                </span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={inputs.hoursPerWeek}
                  onChange={(e) => updateField("hoursPerWeek", e.target.value)}
                  className="mt-4 w-full bg-transparent text-4xl font-semibold outline-none"
                />
              </label>

              <label className="block rounded-2xl border border-ink-base/10 p-5">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <DollarSign size={17} className="text-accent-mint-deep" />
                  Hourly team cost
                </span>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={inputs.hourlyCost}
                  onChange={(e) => updateField("hourlyCost", e.target.value)}
                  className="mt-4 w-full bg-transparent text-4xl font-semibold outline-none"
                />
              </label>

              <label className="block rounded-2xl border border-ink-base/10 p-5">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Users size={17} className="text-accent-mint-deep" />
                  People involved
                </span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={inputs.peopleInvolved}
                  onChange={(e) =>
                    updateField("peopleInvolved", e.target.value)
                  }
                  className="mt-4 w-full bg-transparent text-4xl font-semibold outline-none"
                />
              </label>
            </div>

            <div className="mt-7">
              <p className="text-sm font-semibold text-ink-base">
                Tool stack involved
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {toolOptions.map((tool) => {
                  const selected = inputs.toolStack.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                        selected
                          ? "border-accent-mint bg-accent-mint/20 text-ink-base"
                          : "border-ink-base/10 bg-bg-base text-ink-muted hover:border-accent-mint/50"
                      }`}
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside
            data-entrance
            className="lg:col-span-2 rounded-3xl bg-ink-base p-7 md:p-8 text-bg-base shadow-lift"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-mint text-ink-base">
                <Calculator size={22} />
              </span>
              <p className="text-sm font-semibold text-bg-base/70">
                Estimated manual-work loss
              </p>
            </div>

            <p className="mt-8 text-5xl font-semibold tracking-tight">
              {formatter.format(monthlyLoss)}
            </p>
            <p className="mt-2 text-bg-base/70">per month</p>

            <div className="mt-8 rounded-2xl bg-bg-base/8 p-5">
              <p className="text-sm text-bg-base/70">Annual drag</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatter.format(annualLoss)}
              </p>
            </div>

            <Button
              as="a"
              href="#contact"
              size="md"
              className="mt-7 w-full"
              onClick={() => setSourceSection("roi-calculator-cta")}
            >
              Get a Free Automation Audit
              <ArrowRight size={18} />
            </Button>
          </aside>
        </div>
      </SectionWrap>
    </div>
  );
}

export default RoiCalculator;
