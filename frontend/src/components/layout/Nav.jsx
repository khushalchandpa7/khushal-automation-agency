import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Calculator,
  ClipboardList,
  Menu,
  Moon,
  Plug,
  Sun,
  X,
} from "lucide-react";
import BookCallButton from "../ui/BookCallButton";
import logo from "../../assets/svg/logo-KA.svg";

const links = [
  { href: "#roi-calculator", label: "ROI", Icon: Calculator },
  { href: "#integrations", label: "Stack", Icon: Plug },
  { href: "#portfolio", label: "Work", Icon: Briefcase },
  { href: "#process", label: "Process", Icon: ClipboardList },
];

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
  const navRef = useRef(null);
  const itemRefs = useRef([]);
  const spotlightRef = useRef(null);
  const hoverPlateRef = useRef(null);
  const drawerRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const spotlight = spotlightRef.current;
    const hoverPlate = hoverPlateRef.current;
    const navEl = navRef.current;
    if (!spotlight || !hoverPlate || !navEl) return;

    if (activeIdx === null) {
      spotlight.style.opacity = "0";
      hoverPlate.style.opacity = "0";
      return;
    }

    const item = itemRefs.current[activeIdx];
    if (!item) return;

    const navRect = navEl.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const x = itemRect.left - navRect.left + itemRect.width / 2;

    spotlight.style.left = `${x}px`;
    spotlight.style.opacity = "1";

    hoverPlate.style.left = `${x}px`;
    hoverPlate.style.width = `${itemRect.width + 4}px`;
    hoverPlate.style.opacity = "1";
  }, [activeIdx]);

  useEffect(() => {
    document.body.classList.toggle("body-lock", isMenuOpen);
    return () => document.body.classList.remove("body-lock");
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const drawer = drawerRef.current;
    const focusables = drawer?.querySelectorAll("a, button");
    focusables?.[0]?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && focusables?.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  useEffect(() => {
    const onHash = () => setMenuOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <header className="sticky top-4 z-40 w-full px-gutter pt-2">
      <div className="relative mx-auto flex w-full max-w-container items-center justify-between">
        <a
          href="#top"
          className="glass-pill flex items-center gap-3 rounded-full px-3 py-3 font-semibold text-ink-base lg:pr-5"
        >
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-accent-mint text-accent-contrast">
            <img
              src={logo}
              alt="Khushal Automation Agency logo"
              className="h-full w-full"
            />
          </span>
          <span className="hidden lg:inline text-base whitespace-nowrap">
            Khushal Automations
          </span>
        </a>

        <div className="flex items-center gap-3">
          <button
            ref={hamburgerRef}
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen((v) => !v)}
            className="glass-pill grid h-12 w-12 min-h-touch-lg min-w-touch-lg shrink-0 place-items-center rounded-full text-ink-base md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            {isMenuOpen ? (
              <X size={22} strokeWidth={2.2} />
            ) : (
              <Menu size={22} strokeWidth={2.2} />
            )}
          </button>
          <BookCallButton />
          <button
            type="button"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            aria-pressed={isDark}
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            className="glass-pill grid h-16 w-16 shrink-0 place-items-center rounded-full p-2 text-ink-base transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
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
        ref={navRef}
        aria-label="Primary navigation"
        onMouseLeave={() => setActiveIdx(null)}
        className="glass-pill absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center overflow-hidden rounded-full px-3 py-2 md:flex"
      >
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-40 w-40 opacity-0 blur-xl"
          style={{
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "var(--glass-nav-glow)",
            transition:
              "left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease",
          }}
        />
        <div
          ref={hoverPlateRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 left-1/2 rounded-full opacity-0"
          style={{
            width: "76px",
            transform: "translateX(-50%)",
            background: "var(--glass-nav-plate-bg)",
            borderTop: "1px solid var(--glass-nav-plate-top-border)",
            boxShadow: "var(--glass-nav-plate-shadow)",
            transition:
              "left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease",
          }}
        />

        {links.map((link, idx) => {
          const Icon = link.Icon;
          const isActive = activeIdx === idx;
          return (
            <a
              key={link.href}
              href={link.href}
              ref={(el) => (itemRefs.current[idx] = el)}
              onMouseEnter={() => setActiveIdx(idx)}
              onFocus={() => setActiveIdx(idx)}
              onBlur={(event) => {
                if (
                  !event.currentTarget.parentElement?.contains(
                    event.relatedTarget,
                  )
                ) {
                  setActiveIdx(null);
                }
              }}
              className="group relative z-10 grid h-12 min-w-[82px] place-items-center overflow-hidden rounded-full px-5 outline-none"
            >
              <Icon
                size={20}
                strokeWidth={2}
                style={{
                  filter: isActive ? "var(--glass-nav-icon-filter)" : "none",
                }}
                className={`transition-all duration-300 ${
                  isActive
                    ? "-translate-y-1.5 rotate-[-8deg] scale-110 fill-transparent text-ink-base"
                    : "translate-y-0 rotate-0 scale-100 fill-transparent text-ink-base"
                }`}
              />
              <span
                className={`absolute bottom-1.5 whitespace-nowrap text-[10.5px] font-semibold leading-none tracking-wide text-ink-base transition-all duration-300 ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1.5 opacity-0"
                }`}
              >
                {link.label}
              </span>
            </a>
          );
        })}
      </nav>

      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed inset-0 z-50 md:hidden ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={closeMenu}
          aria-hidden="true"
          className={`absolute inset-0 bg-panel-base/55 backdrop-blur-md transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          ref={drawerRef}
          className={`glass-pill absolute right-0 top-0 flex h-[100svh] w-[min(86vw,22rem)] flex-col gap-1 rounded-l-3xl rounded-r-none px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 transition-transform duration-300 ease-out will-change-transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-fs-meta font-semibold uppercase tracking-widest text-ink-subtle">
              Menu
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="grid h-touch-lg w-touch-lg place-items-center rounded-full text-ink-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint"
            >
              <X size={20} strokeWidth={2.2} />
            </button>
          </div>
          {links.map((link) => {
            const Icon = link.Icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex min-h-touch-lg items-center gap-4 rounded-2xl px-4 py-3 text-fs-lead font-semibold text-ink-base can-hover:hover:bg-surface-soft focus-visible:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint"
              >
                <Icon size={22} strokeWidth={2} />
                {link.label}
              </a>
            );
          })}
        </aside>
      </div>
    </header>
  );
}

export default Nav;
