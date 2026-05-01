import logo from "../../assets/svg/logo-KA.svg";

const links = [
  { href: "#roi-calculator", label: "ROI" },
  { href: "#integrations", label: "Stack" },
  { href: "#portfolio", label: "Work" },
  { href: "#audit-quiz", label: "Audit" },
  { href: "#contact", label: "Contact" },
];

function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-border bg-surface-base">
      <div className="mx-auto max-w-container px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="#top" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-mint shadow-soft">
                <img
                  src={logo}
                  alt="Khushal Automations logo"
                  className="h-full w-full"
                />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-ink-base">
                Khushal Automations
              </span>
            </a>

            <p className="mt-4 text-sm leading-6 text-ink-muted">
              Simple automation systems for teams that want less manual work and
              cleaner operations.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-ink-muted md:justify-end"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-ink-base"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-surface-border pt-6 text-sm text-ink-subtle md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Khushal Automation Agency. All
            rights reserved.
          </p>
          <a
            href="mailto:khushalchandpa7@gmail.com"
            className="transition-colors hover:text-ink-base"
          >
            khushalchandpa7@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
