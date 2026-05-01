import { Plug, Workflow } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import { useEntrance } from "../../hooks/useEntrance";

const integrations = [
  { name: "Airtable", category: "Ops data" },
  { name: "Notion", category: "Knowledge" },
  { name: "Google Sheets", category: "Reporting" },
  { name: "Slack", category: "Alerts" },
  { name: "Gmail", category: "Inbox" },
  { name: "HubSpot", category: "CRM" },
  { name: "Shopify", category: "Commerce" },
  { name: "Zapier", category: "Automation" },
  { name: "Make", category: "Automation" },
  { name: "n8n", category: "Automation" },
  { name: "OpenAI", category: "AI" },
  { name: "Stripe", category: "Payments" },
  { name: "Calendly", category: "Scheduling" },
];

function IntegrationStack() {
  const ref = useEntrance({ stagger: 0.045, y: 20 });

  return (
    <div ref={ref}>
      <SectionWrap
        id="integrations"
        eyebrow="Integration stack"
        title="We automate the tools your team already lives in."
        lede="The fastest workflows usually connect the software you already pay for instead of forcing another platform into the middle."
        className="bg-white/45"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {integrations.map((tool) => (
            <div
              key={tool.name}
              data-entrance
              className="rounded-2xl border border-ink-base/8 bg-white p-4 shadow-soft hover:border-accent-mint/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-mint/15 text-sm font-bold text-accent-mint-deep">
                  {tool.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
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
          className="mt-8 flex flex-col gap-4 rounded-3xl bg-ink-base p-6 text-bg-base md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-mint text-ink-base">
              <Plug size={22} />
            </span>
            <div>
              <h3 className="font-semibold">Missing your tool?</h3>
              <p className="mt-1 text-sm text-bg-base/70">
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
