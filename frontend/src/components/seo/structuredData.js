import { SITE_URL } from "./seoConfig";

const ORG_NAME = "Khushal Automation Agency";
const ORG_LOGO = `${SITE_URL}/favicon.svg`;
const ORG_IMAGE = `${SITE_URL}/og-image.png`;

// TODO: replace placeholder social URLs with real handles before deploy.
const SOCIAL_LINKS = [
  "https://www.linkedin.com/in/khushal-chandpa/",
  "https://github.com/khushalchandpa",
];

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: ORG_NAME,
    alternateName: ["Khushal Automation", "Khushal Automations"],
    description:
      "Custom workflow automation and AI agent development for ops teams. Triggers, form processing, webhooks, and integrations across the tools you already use.",
    url: SITE_URL,
    logo: ORG_LOGO,
    image: ORG_IMAGE,
    email: "khushalchandpa7@gmail.com",
    areaServed: { "@type": "Place", name: "Worldwide" },
    serviceType: [
      "Workflow Automation",
      "Business Process Automation",
      "AI Agents",
      "Integration Services",
    ],
    priceRange: "$$",
    sameAs: SOCIAL_LINKS,
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORG_NAME,
    alternateName: "Khushal Automation",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFaqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
