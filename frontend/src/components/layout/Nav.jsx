import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Calculator,
  ClipboardCheck,
  Moon,
  Plug,
  Sun,
} from "lucide-react";

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
  const navRef = useRef(null);
  const itemRefs = useRef([]);
  const spotlightRef = useRef(null);
  const hoverPlateRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
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

  return (
    <header className="sticky top-4 z-40 w-full px-6 pt-2">
      <div className="relative mx-auto flex w-full max-w-container items-center justify-between">
        <a
          href="#top"
          className={`flex items-center gap-3 rounded-full px-3 py-3 font-semibold text-ink-base lg:pr-5 ${glassPill}`}
        >
          <span className="grid place-items-center w-10 h-10 rounded-full bg-accent-mint text-accent-contrast">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
              role="img"
              aria-labelledby="title desc"
            >
              <title id="title">KA logo</title>
              <desc id="desc">
                Rounded teal app icon with a white KA mark and dark green arrow
                accents.
              </desc>
              <defs>
                <filter
                  id="soft-shadow"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="120%"
                >
                  <feDropShadow
                    dx="0"
                    dy="18"
                    stdDeviation="18"
                    floodColor="#009B83"
                    floodOpacity="0.16"
                  />
                </filter>
                <linearGradient
                  id="accent"
                  x1="1408"
                  y1="282"
                  x2="1766"
                  y2="1766"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#075B4A" />
                  <stop offset="1" stopColor="#026652" />
                </linearGradient>
              </defs>

              <rect
                width="2048"
                height="2048"
                rx="1024"
                ry="1024"
                fill="#00C092"
              />

              <g
                id="logo-mark"
                transform="translate(1024 1024) scale(0.72) translate(-1024 -1024)"
              >
                <g filter="url(#soft-shadow)">
                  <rect
                    x="259"
                    y="207"
                    width="200"
                    height="1636"
                    rx="100"
                    fill="#FFFFFF"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M 455 1024 C 455 992 469 958 494 933 L 1004 438 C 1043 400 1093 409 1148 409 H 1429 L 1561 512 L 1429 615 H 1117 L 707 1024 L 1117 1435 H 1429 L 1561 1536 L 1429 1640 H 1148 C 1093 1640 1043 1648 1004 1610 L 494 1115 C 469 1090 455 1056 455 1024 Z"
                  />
                </g>

                <path
                  d="M 1485 360 L 1690 512 L 1485 665"
                  fill="none"
                  stroke="url(#accent)"
                  strokeWidth="150"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 1485 1383 L 1690 1536 L 1485 1689"
                  fill="none"
                  stroke="url(#accent)"
                  strokeWidth="150"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
          <span className="hidden lg:inline text-base whitespace-nowrap">
            Khushal Automations
          </span>
        </a>

        <nav
          ref={navRef}
          onMouseLeave={() => setActiveIdx(null)}
          className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center overflow-hidden rounded-full px-3 py-2 md:flex ${glassPill}`}
        >
          <div
            ref={spotlightRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 w-40 h-40 opacity-0 blur-xl"
            style={{
              left: "50%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(0,217,163,0.6) 0%, rgba(0,217,163,0.34) 32%, rgba(255,255,255,0.22) 58%, transparent 75%)",
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
              background:
                "linear-gradient(135deg, rgba(0,217,163,0.24), rgba(255,255,255,0.62) 52%, rgba(0,150,115,0.16))",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.82), inset 0 -1px 0 rgba(0,217,163,0.16), 0 10px 28px rgba(0,150,115,0.16)",
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
                  if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) {
                    setActiveIdx(null);
                  }
                }}
                className="group relative z-10 grid h-12 min-w-[82px] place-items-center overflow-hidden rounded-full px-5 outline-none"
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "-translate-y-1.5 rotate-[-8deg] scale-110 fill-transparent text-ink-base drop-shadow-[0_6px_12px_rgba(17,17,17,0.18)]"
                      : "translate-y-0 rotate-0 scale-100 fill-transparent text-ink-base"
                  }`}
                />
                <span
                  className={`absolute bottom-1.5 text-[10.5px] font-semibold leading-none tracking-wide whitespace-nowrap text-ink-base transition-all duration-300 ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1.5"
                  }`}
                >
                  {link.label}
                </span>
              </a>
            );
          })}
        </nav>

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
    </header>
  );
}

export default Nav;
