require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const projects = [
  {
    title: "Invoice Reconciliation for a 50-Person Accounting Firm",
    description:
      "Built a workflow that pulls invoices from Gmail, extracts line items with an LLM, validates totals against the ERP, and posts mismatches to Slack for human review.",
    metrics: "12 hrs/week saved · 99.4% extraction accuracy · 3-day payback",
    toolsUsed: ["OpenAI", "Google Sheets", "Slack", "QuickBooks"],
  },
  {
    title: "Lead Routing for a B2B SaaS Sales Team",
    description:
      "Webhook-driven pipeline that scores inbound form submissions, enriches them via Clearbit, and assigns the right AE in HubSpot — all in under 4 seconds.",
    metrics: "Lead response time: 36h → 4s · 28% lift in qualified meetings",
    toolsUsed: ["Clearbit", "HubSpot", "Webhooks", "Postgres"],
  },
  {
    title: "Daily Inventory Sync for a DTC Brand",
    description:
      "Two-way sync between Shopify and a 3PL warehouse system. Detects stock drift, auto-triggers replenishment, and posts a daily digest to the operations channel.",
    metrics: "Stock-outs cut by 73% · 6 manual reports replaced",
    toolsUsed: ["Shopify API", "Postgres", "Slack"],
  },
  {
    title: "Onboarding Automation for an HR Tech Startup",
    description:
      "Form-triggered new-hire pipeline: provisions accounts in Google Workspace, GitHub, and Notion; ships a welcome packet; and schedules first-week 1:1s.",
    metrics: "3 hrs/hire saved · zero missed account provisioning since launch",
    toolsUsed: ["Google Workspace", "GitHub", "Notion", "Calendly"],
  },
];

async function main() {
  console.log("Seeding portfolio projects...");

  for (const project of projects) {
    const existing = await prisma.portfolioProject.findFirst({
      where: { title: project.title },
    });

    if (existing) {
      await prisma.portfolioProject.update({
        where: { id: existing.id },
        data: project,
      });
      console.log(`  updated: ${project.title}`);
    } else {
      await prisma.portfolioProject.create({ data: project });
      console.log(`  created: ${project.title}`);
    }
  }

  const count = await prisma.portfolioProject.count();
  console.log(`Done. ${count} portfolio project(s) in DB.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
