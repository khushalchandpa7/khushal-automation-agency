import { useEffect, useRef, useState } from "react";
import {
  Wand2,
  Briefcase,
  Workflow,
  MessageCircle,
} from "lucide-react";
import Button from "../ui/Button";

const links = [
  { href: "#services", label: "Services", Icon: Wand2 },
  { href: "#portfolio", label: "Work", Icon: Briefcase },
  { href: "#process", label: "Process", Icon: Workflow },
  { href: "#contact", label: "Contact", Icon: MessageCircle },
];

const glassPill =
  "bg-ink-base/[0.07] backdrop-blur-xl border border-ink-base/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_32px_rgba(17,17,17,0.07)]";

function Nav() {
  const navRef = useRef(null);
  const itemRefs = useRef([]);
  const spotlightRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    const navEl = navRef.current;
    if (!spotlight || !navEl) return;

    if (activeIdx === null) {
      spotlight.style.opacity = "0";
      return;
    }

    const item = itemRefs.current[activeIdx];
    if (!item) return;

    const navRect = navEl.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const x = itemRect.left - navRect.left + itemRect.width / 2;

    spotlight.style.left = `${x}px`;
    spotlight.style.opacity = "1";
  }, [activeIdx]);

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 pt-2">
      <div className="relative flex w-full items-center justify-between">
        <a
          href="#top"
          className={`flex items-center gap-2 rounded-full px-2 py-2 font-semibold text-ink-base lg:pr-4 ${glassPill}`}
        >
          <span className="grid place-items-center w-8 h-8 rounded-full bg-accent-mint text-ink-base">
            {/* <img src="./logo-KA.png" alt="Khushal Automation Logo Icon" /> */}
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
          <span className="hidden lg:inline text-sm whitespace-nowrap">
            Khushal Automations
          </span>
        </a>

        <nav
          ref={navRef}
          onMouseLeave={() => setActiveIdx(null)}
          className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center overflow-hidden rounded-full px-2 py-2 md:flex ${glassPill}`}
        >
          <div
            ref={spotlightRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 w-40 h-40 opacity-0 blur-xl"
            style={{
              left: "50%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(0,217,163,0.6) 0%, rgba(0,217,163,0.38) 28%, rgba(255,107,53,0.28) 55%, transparent 75%)",
              transition:
                "left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease",
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
                className="relative z-10 grid h-12 min-w-[72px] place-items-center px-4"
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "-translate-y-1.5 fill-accent-mint text-accent-mint-deep"
                      : "translate-y-0 fill-transparent text-ink-base"
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

        <div className={`rounded-full p-2 ${glassPill}`}>
          <Button as="a" href="#contact" size="sm" className="!rounded-full">
            Book a Call
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Nav;
