import { Plug, Workflow } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import BrandIcon from "../ui/BrandIcon";
import { integrations } from "../../constants/integrations";
import { useEntrance } from "../../hooks/useEntrance";

function IntegrationStack() {
  const ref = useEntrance({ stagger: 0.045, y: 20 });

  return (
    <div ref={ref}>
      <SectionWrap
        id="integrations"
        eyebrow="Integration stack"
        title="We automate the tools your team already lives in."
        lede="The fastest workflows usually connect the software you already pay for instead of forcing another platform into the middle."
        className="bg-surface-base/55"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {integrations.map((tool) => (
            <div
              key={tool.name}
              data-entrance
              className="rounded-2xl border border-surface-border bg-surface-base p-4 shadow-soft can-hover:hover:border-accent-mint/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BrandIcon tool={tool} />
                <div>
                  <h3 className="font-semibold leading-tight">{tool.name}</h3>
                  <p className="mt-1 text-xs text-ink-subtle">
                    {tool.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          data-entrance
          className="mt-8 flex flex-col gap-4 rounded-3xl bg-panel-base p-6 text-panel-text md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-mint text-accent-contrast">
              <Plug size={22} />
            </span>
            <div>
              <h3 className="font-semibold">Missing your tool?</h3>
              <p className="mt-1 text-sm text-panel-muted">
                If it has an API, webhook, export, email, or database, we can
                usually automate around it.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-accent-mint">
            <Workflow size={18} />
            Custom connectors available
          </div>
        </div>
      </SectionWrap>
    </div>
  );
}

export default IntegrationStack;
