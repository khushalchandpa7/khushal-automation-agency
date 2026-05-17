import { Loader2, PhoneCall, PhoneOff } from "lucide-react";
import { useRiyaBooking } from "./useRiyaBooking";

const STATE_CONFIG = {
  idle: {
    accent: "bg-accent-mint text-accent-contrast",
    icon: <PhoneCall size={18} strokeWidth={2.2} aria-hidden="true" />,
    label: "Book a Meeting",
  },
  connecting: {
    accent: "bg-accent-mint text-accent-contrast",
    icon: <PhoneCall size={18} strokeWidth={2.2} aria-hidden="true" />,
    label: "Connecting...",
  },
  active: {
    accent: "bg-accent-tangerine text-accent-contrast",
    icon: <PhoneOff size={18} strokeWidth={2.2} aria-hidden="true" />,
    label: "End Call",
  },
  ending: {
    accent: "bg-accent-tangerine text-accent-contrast",
    icon: <PhoneOff size={18} strokeWidth={2.2} aria-hidden="true" />,
    label: "Ending...",
  },
  error: {
    accent: "bg-accent-tangerine text-accent-contrast",
    icon: <PhoneCall size={18} strokeWidth={2.2} aria-hidden="true" />,
    label: "Try again",
  },
};

const VARIANT_CONFIG = {
  pill: {
    button:
      "glass-pill inline-flex h-16 w-16 shrink-0 items-center justify-center gap-2 rounded-full p-2 text-sm font-semibold text-ink-base transition duration-300 disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base lg:w-auto lg:pr-5",
    label: "hidden whitespace-nowrap lg:inline",
  },
  block: {
    button:
      "inline-flex w-full items-center justify-start gap-3 rounded-2xl border border-surface-strong bg-surface-base p-1.5 pr-4 text-sm font-semibold text-ink-base shadow-soft transition duration-300 disabled:cursor-not-allowed disabled:opacity-80 can-hover:hover:border-accent-mint can-hover:hover:bg-accent-mint/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
    label: "whitespace-nowrap",
  },
};

export default function BookCallButton({ variant = "pill" }) {
  const { status, isBusy, startCall, endCall } = useRiyaBooking();
  const { accent, icon, label } = STATE_CONFIG[status];
  const variantStyle = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.pill;
  const ariaLabel =
    status === "active" ? "End call with Riya" : "Book a meeting with Khushal";

  function handleClick() {
    if (status === "active") {
      endCall();
      return;
    }

    if (status === "idle" || status === "error") {
      startCall();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isBusy}
      aria-label={ariaLabel}
      className={variantStyle.button}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-soft transition-colors duration-300 ${accent}`}
      >
        {isBusy ? (
          <Loader2 size={18} strokeWidth={2.2} className="animate-spin" />
        ) : (
          icon
        )}
      </span>
      <span className={variantStyle.label}>{label}</span>
    </button>
  );
}
