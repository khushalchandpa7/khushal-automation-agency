import { useEffect, useState } from "react";
import {
  Briefcase,
  Calculator,
  ClipboardCheck,
  Moon,
  Plug,
  Sun,
} from "lucide-react";
import logo from "../../assets/svg/logo-KA.svg";

const links = [
  { href: "#roi-calculator", label: "ROI", Icon: Calculator },
  { href: "#integrations", label: "Stack", Icon: Plug },
  { href: "#portfolio", label: "Work", Icon: Briefcase },
  { href: "#audit-quiz", label: "Audit", Icon: ClipboardCheck },
];

const glassPill =
  "bg-panel-base/[0.07] backdrop-blur-xl border border-surface-strong shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_32px_rgba(17,17,17,0.07)]";

function getInitialTheme() {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  try {
    window.localStorage.setItem("theme", theme);
  } catch {
    // The visual theme should still work if storage is unavailable.
  }
}

function Nav() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <header className="sticky top-4 z-40 w-full px-6 pt-2">
      <div className="relative mx-auto flex w-full max-w-container items-center justify-between">
        <a
          href="#top"
          className={`flex items-center gap-3 rounded-full px-3 py-3 font-semibold text-ink-base lg:pr-5 ${glassPill}`}
        >
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-accent-mint text-accent-contrast">
            <img src={logo} alt="" className="h-full w-full" aria-hidden="true" />
          </span>
          <span className="hidden lg:inline text-base whitespace-nowrap">
            Khushal Automations
          </span>
        </a>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            aria-pressed={isDark}
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            className={`grid h-16 w-16 shrink-0 place-items-center rounded-full p-2 text-ink-base transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${glassPill}`}
          >
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-accent-mint text-accent-contrast shadow-soft">
              <Sun
                size={20}
                strokeWidth={2.2}
                className={`absolute transition-all duration-300 ${
                  isDark
                    ? "scale-50 rotate-90 opacity-0"
                    : "scale-100 opacity-100"
                }`}
              />
              <Moon
                size={19}
                strokeWidth={2.2}
                className={`absolute transition-all duration-300 ${
                  isDark
                    ? "scale-100 opacity-100"
                    : "scale-50 -rotate-90 opacity-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary navigation"
        className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full p-2 md:flex ${glassPill}`}
      >
        {links.map((link) => {
          const Icon = link.Icon;
          return (
            <a
              key={link.href}
              href={link.href}
              className="group inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-muted transition duration-200 hover:-translate-y-0.5 hover:bg-surface-base/70 hover:text-ink-base hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              <Icon
                size={18}
                strokeWidth={2}
                className="shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              <span className="whitespace-nowrap">{link.label}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}

export default Nav;
