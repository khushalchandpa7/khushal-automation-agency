import { useMemo, useState } from "react";
import { ArrowRight, Calculator, Clock3, IndianRupee, Users } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import Button from "../ui/Button";
import { useEntrance } from "../../hooks/useEntrance";
import { useRiyaBooking } from "../ui/useRiyaBooking";

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

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function RoiCalculator() {
  const ref = useEntrance({ stagger: 0.08, y: 28 });
  const { startCall } = useRiyaBooking();
  const [inputs, setInputs] = useState({
    hoursPerWeek: 12,
    hourlyCost: 1200,
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

  function updateField(field, value) {
    setInputs((current) => ({
      ...current,
      [field]: Number(value),
    }));
  }

  function toggleTool(tool) {
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
        lede="Put rough numbers into the calculator and turn vague frustration into a rupee figure your team can act on."
      >
        <div className="grid lg:grid-cols-5 gap-6">
          <div
            data-entrance
            className="lg:col-span-3 rounded-3xl bg-surface-base border border-surface-border p-7 md:p-8 shadow-soft"
          >
            <div className="grid md:grid-cols-3 gap-5">
              <label className="block rounded-2xl border border-surface-strong p-5">
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

              <label className="block rounded-2xl border border-surface-strong p-5">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <IndianRupee size={17} className="text-accent-mint-deep" />
                  Hourly team cost
                </span>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-3xl font-semibold text-ink-subtle">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="100"
                    value={inputs.hourlyCost}
                    onChange={(e) => updateField("hourlyCost", e.target.value)}
                    className="w-full bg-transparent text-4xl font-semibold outline-none"
                  />
                </div>
              </label>

              <label className="block rounded-2xl border border-surface-strong p-5">
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
                          : "border-surface-strong bg-surface-soft text-ink-muted hover:border-accent-mint/50"
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
            className="lg:col-span-2 rounded-3xl bg-panel-base p-7 md:p-8 text-panel-text shadow-lift"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-mint text-accent-contrast">
                <Calculator size={22} />
              </span>
              <p className="text-sm font-semibold text-panel-muted">
                Estimated manual-work loss
              </p>
            </div>

            <p className="mt-8 text-5xl font-semibold tracking-tight">
              {formatter.format(monthlyLoss)}
            </p>
            <p className="mt-2 text-panel-muted">per month</p>

            <div className="mt-8 rounded-2xl bg-panel-soft p-5">
              <p className="text-sm text-panel-muted">Annual drag</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatter.format(annualLoss)}
              </p>
            </div>

            <Button
              type="button"
              size="md"
              className="mt-7 w-full"
              onClick={startCall}
            >
              Book a Meeting
              <ArrowRight size={18} />
            </Button>
          </aside>
        </div>
      </SectionWrap>
    </div>
  );
}

export default RoiCalculator;
