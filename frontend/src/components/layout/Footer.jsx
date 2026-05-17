import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import logo from "../../assets/svg/logo-KA.svg";
import { socials } from "../../constants/socials";
import SocialIcon from "../ui/SocialIcon";

const productLinks = [
  { href: "#roi-calculator", label: "ROI calculator" },
  { href: "#integrations", label: "Integrations" },
  { href: "#workflow-demos", label: "Live demos" },
];

const resourceLinks = [
  { href: "#portfolio", label: "Case studies" },
  { href: "#process", label: "How we work" },
  { href: "#proof", label: "Client proof" },
  { href: "#pain-solution", label: "Pain & solution" },
];

const columns = [
  { id: "product", title: "Product", links: productLinks },
  { id: "resources", title: "Resources", links: resourceLinks },
];

function useIsDesktop(minWidth = 768) {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
    const handler = (event) => setIsDesktop(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [minWidth]);

  return isDesktop;
}

function FooterColumn({ id, title, links, isDesktop }) {
  const [open, setOpen] = useState(false);
  const expanded = isDesktop || open;
  const regionId = `footer-col-${id}`;

  return (
    <div className="border-b border-surface-border/70 md:border-0">
      <h3 className="m-0 text-fs-meta">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={regionId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 py-5 text-left font-semibold uppercase tracking-[0.18em] text-ink-base transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-4 focus-visible:ring-offset-surface-base md:py-0 md:focus-visible:ring-0"
        >
          <span>{title}</span>
          <ChevronDown
            size={18}
            strokeWidth={2.2}
            aria-hidden="true"
            className={`text-ink-muted transition-transform duration-300 md:hidden ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </h3>
      <div
        id={regionId}
        inert={!expanded}
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:!grid-rows-[1fr] ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <ul className="m-0 min-h-0 list-none space-y-1 overflow-hidden p-0 pb-4 md:space-y-3 md:pb-0 md:pt-5">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-touch items-center text-fs-body text-ink-muted transition-colors duration-200 rounded-md can-hover:hover:text-ink-base focus-visible:text-ink-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) return;
    setStatus("success");
    setEmail("");
    window.setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 w-full max-w-sm"
      aria-describedby="footer-newsletter-help"
      noValidate
    >
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center gap-1.5 rounded-2xl border border-surface-strong bg-surface-soft p-1 transition-colors duration-200 focus-within:border-accent-mint focus-within:ring-2 focus-within:ring-accent-mint/30 sm:gap-2 sm:p-1.5">
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-fs-body text-ink-base placeholder:text-ink-subtle outline-none sm:px-3"
        />
        <button
          type="submit"
          aria-label="Subscribe to the newsletter"
          className="grid h-10 w-10 min-h-touch min-w-touch shrink-0 place-items-center rounded-xl bg-accent-mint text-accent-contrast shadow-soft transition-all duration-200 can-hover:hover:bg-accent-mint-deep can-hover:hover:translate-x-[1px] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
        >
          <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
      <p
        id="footer-newsletter-help"
        className="mt-3 text-xs leading-5 text-ink-subtle"
        aria-live="polite"
      >
        {status === "success"
          ? "Thanks — you're on the list."
          : "Monthly notes on automation systems. No spam, ever."}
      </p>
    </form>
  );
}

function Footer() {
  const isDesktop = useIsDesktop(768);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-section-y border-t border-surface-border bg-surface-base">
      <div className="mx-auto max-w-container px-gutter py-section-y">
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-gutter md:gap-y-12 lg:gap-x-16">
          <div className="md:col-span-5 lg:col-span-4">
            <a
              href="#top"
              className="inline-flex flex-wrap items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-4 focus-visible:ring-offset-surface-base"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-mint shadow-soft">
                <img
                  src={logo}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full"
                />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-ink-base sm:text-xl">
                Khushal Automations
              </span>
            </a>
            <p className="mt-5 max-w-sm text-fs-body leading-relaxed text-ink-muted">
              Simple automation systems for teams that want less manual work and
              cleaner operations.
            </p>
            <NewsletterForm />
          </div>

          <nav
            aria-label="Footer"
            className="md:col-span-7 md:grid md:grid-cols-2 md:gap-x-gutter lg:col-span-8 lg:gap-x-10"
          >
            {columns.map((column) => (
              <FooterColumn
                key={column.id}
                id={column.id}
                title={column.title}
                links={column.links}
                isDesktop={isDesktop}
              />
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-surface-border pt-8 md:mt-16 md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-8">
          <p className="m-0 text-sm text-ink-subtle">
            &copy; {year} Khushal Automation Agency. All rights reserved.
          </p>

          <ul className="m-0 flex flex-wrap items-center gap-1 list-none p-0">
            {socials.map(({ href, label, path }) => (
              <li key={href}>
                <a
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="grid h-10 w-10 min-h-touch min-w-touch place-items-center rounded-full text-ink-muted transition-all duration-200 can-hover:hover:bg-surface-soft can-hover:hover:text-ink-base can-hover:hover:-translate-y-0.5 focus-visible:bg-surface-soft focus-visible:text-ink-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint"
                >
                  <SocialIcon path={path} label={label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
