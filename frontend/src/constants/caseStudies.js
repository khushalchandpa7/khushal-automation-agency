export const caseStudies = {
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
  "AI Headshot Generator for Professional Profiles": {
    problem:
      "Users needed polished headshots for work profiles, but studio shoots, manual retouching, and delivery delays made the process slow and expensive.",
    workflow: [
      "User uploads a casual image",
      "Agent checks image quality and face visibility",
      "Nano Banana 2 (Gemini) generates headshot variations",
      "Final high-quality headshot is delivered",
    ],
    result:
      "Everyday photos became professional profile-ready headshots without a studio session or manual editing workflow.",
    savings:
      "Professional profile image generated in under 60 seconds instead of scheduling a photoshoot",
  },
  "One-Click AI Carousel Generator for Social Content": {
    problem:
      "Creators and teams were spending too much time turning raw ideas into polished carousel posts with strong hooks, slide copy, design, and final export formatting.",
    workflow: [
      "User provides content or chooses a niche",
      "AI drafts the hook, slide copy, and CTA",
      "AI generates custom-design carousel slide images",
      "Slides are combined, exported, or published to social platforms",
    ],
    result:
      "Users can produce platform-ready carousel content without manual copywriting, design, and formatting work.",
    savings:
      "Carousel campaign prepared in minutes instead of manual copy-design-export work",
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

export function getCaseStudy(project) {
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
