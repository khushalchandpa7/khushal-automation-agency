import { useEffect, useRef, useState } from "react";
import VapiPkg from "@vapi-ai/web";
import { Loader2, Mic2, PhoneCall, PhoneOff, X } from "lucide-react";
import { RiyaBookingContext } from "./useRiyaBooking";

// CJS/ESM interop: Vite's pre-bundler wraps @vapi-ai/web's CJS default export.
// Depending on bundler version, the import may be the class OR { default: class }.
const Vapi = VapiPkg?.default ?? VapiPkg;

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

const PANEL_COPY = {
  connecting: {
    eyebrow: "Starting voice session",
    title: "Connecting to Riya",
    body: "Riya helps visitors talk through their automation need and book a weekend meeting with Khushal.",
    action: "Connecting...",
  },
  active: {
    eyebrow: "Live with Riya",
    title: "Riya is listening",
    speakingTitle: "Riya is speaking",
    body: "Stay on this screen while Riya talks through your automation need and helps book the next step.",
    action: "End Call",
  },
  ending: {
    eyebrow: "Wrapping up",
    title: "Ending call",
    body: "Closing the voice session and returning you to the site.",
    action: "Ending...",
  },
  error: {
    eyebrow: "Connection issue",
    title: "Riya could not connect",
    body: "Check microphone permission or try starting the call again.",
    action: "Try again",
  },
};

const WAVE_BARS = [
  0.18, 0.36, 0.6, 0.84, 0.42, 1, 0.74, 0.22, 0.74, 1, 0.42, 0.84, 0.6,
  0.36, 0.18,
];

function clampVolume(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function RiyaWave({ status, volume, isSpeaking }) {
  const reactiveVolume =
    status === "active"
      ? Math.max(volume, isSpeaking ? 0.24 : 0.05)
      : status === "ending"
        ? 0.08
        : status === "error"
          ? 0.04
          : 0.14;
  const waveStyle = {
    "--riya-volume": reactiveVolume.toFixed(3),
    "--riya-scale": (1 + reactiveVolume * 0.035).toFixed(3),
    "--riya-halo-opacity-low": (0.36 + reactiveVolume * 0.28).toFixed(3),
    "--riya-halo-opacity-high": (0.58 + reactiveVolume * 0.34).toFixed(3),
    "--riya-halo-scale-low": "0.9",
    "--riya-halo-scale-high": (0.98 + reactiveVolume * 0.1).toFixed(3),
    "--riya-orb-glow": `${(24 + reactiveVolume * 52).toFixed(1)}px`,
    "--riya-bar-glow": `${(6 + reactiveVolume * 16).toFixed(1)}px`,
    "--riya-bar-opacity": (0.78 + reactiveVolume * 0.2).toFixed(3),
  };

  return (
    <div
      aria-hidden="true"
      className={`riya-wave relative mx-auto grid h-[clamp(10rem,46vmin,18rem)] w-[clamp(10rem,46vmin,18rem)] place-items-center rounded-full ${
        isSpeaking ? "riya-wave-speaking" : ""
      } ${status === "error" ? "riya-wave-error" : ""}`}
      style={waveStyle}
    >
      <span className="riya-wave-halo absolute inset-0 rounded-full" />
      <div className="riya-wave-orb absolute inset-[7%] grid place-items-center rounded-full">
        <div className="riya-wave-equalizer">
          {WAVE_BARS.map((barLevel, index) => {
            const lift = reactiveVolume * barLevel * 1.85;
            const barScale = 0.34 + barLevel * 0.66 + lift;
            const drift = (index - (WAVE_BARS.length - 1) / 2) * reactiveVolume;

            return (
              <span
                key={`riya-wave-bar-${index}`}
                className="riya-wave-bar"
                style={{
                  "--bar-delay": `${index * -0.055}s`,
                  "--bar-drift": `${drift.toFixed(2)}px`,
                  "--bar-scale": barScale.toFixed(3),
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RiyaCallPanel({
  status,
  volume,
  isSpeaking,
  onPrimaryAction,
  onCancel,
}) {
  if (status === "idle") return null;

  const copy = PANEL_COPY[status];
  const title =
    status === "active" && isSpeaking ? copy.speakingTitle : copy.title;
  const isBusy = status === "connecting" || status === "ending";
  const isError = status === "error";

  return (
    <section
      className="fixed inset-0 z-50 overflow-hidden bg-panel-base px-4 py-4 text-center text-panel-text sm:px-6 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="riya-call-title"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-mint/15 blur-3xl" />
        <span className="absolute -right-24 top-16 h-64 w-64 rounded-full bg-accent-mint/20 blur-3xl" />
        <span className="absolute -bottom-32 left-6 h-72 w-72 rounded-full bg-accent-tangerine/10 blur-3xl" />
        <span className="absolute inset-x-0 top-0 h-px bg-panel-soft" />
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-10 grid h-touch-lg w-touch-lg place-items-center rounded-full border border-panel-soft bg-panel-base/70 text-panel-text shadow-soft backdrop-blur-xl transition duration-300 can-hover:hover:border-accent-mint/50 can-hover:hover:text-accent-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-panel-base sm:h-12 sm:w-12"
        aria-label="Cancel call and return home"
      >
        <X size={20} strokeWidth={2.2} />
      </button>

      <div className="relative mx-auto grid h-[calc(100svh-2rem)] max-w-3xl grid-rows-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:h-[calc(100svh-3rem)] sm:gap-5">
        <header className="min-h-0">
          <span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-panel-soft text-accent-mint shadow-soft sm:mb-5 sm:h-12 sm:w-12">
            <Mic2 size={20} strokeWidth={2.2} />
          </span>

          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent-mint sm:text-xs">
            {copy.eyebrow}
          </p>
          <h2
            id="riya-call-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-panel-text sm:text-3xl md:text-5xl"
          >
            {title}
          </h2>
        </header>

        <div className="grid min-h-0 place-items-center py-2">
          <RiyaWave status={status} volume={volume} isSpeaking={isSpeaking} />
        </div>

        <footer className="mx-auto w-full max-w-lg pb-[max(env(safe-area-inset-bottom),0px)]">
          <p className="text-sm leading-6 text-panel-muted sm:text-base md:text-lg md:leading-7">
            {copy.body}
          </p>

          <button
            type="button"
            onClick={onPrimaryAction}
            disabled={isBusy}
            className={`mt-4 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-accent-contrast shadow-soft transition duration-300 disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-panel-base sm:mt-6 ${
              isError
                ? "bg-accent-tangerine can-hover:hover:bg-accent-tangerine-deep active:bg-accent-tangerine-deep"
                : "bg-accent-mint can-hover:hover:bg-accent-mint-deep active:bg-accent-mint-deep"
            }`}
          >
            {isBusy ? (
              <Loader2 size={18} strokeWidth={2.2} className="animate-spin" />
            ) : status === "active" ? (
              <PhoneOff size={18} strokeWidth={2.2} />
            ) : (
              <PhoneCall size={18} strokeWidth={2.2} />
            )}
            {copy.action}
          </button>
        </footer>
      </div>
    </section>
  );
}

export function RiyaBookingProvider({ children }) {
  const vapiRef = useRef(null);
  const suppressVapiEventsRef = useRef(false);
  const suppressVapiEventsTimerRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [volume, setVolume] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isBusy = status === "connecting" || status === "ending";

  useEffect(() => {
    if (typeof document === "undefined" || status === "idle") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [status]);

  useEffect(() => {
    const vapi = new Vapi(PUBLIC_KEY);
    vapiRef.current = vapi;

    const handleCallStart = () => {
      if (suppressVapiEventsRef.current) {
        vapi.stop();
        return;
      }

      setStatus("active");
    };
    const handleCallEnd = () => {
      if (suppressVapiEventsRef.current) return;

      setStatus("idle");
      setVolume(0);
      setIsSpeaking(false);
    };
    const handleError = (e) => {
      if (suppressVapiEventsRef.current) return;

      console.error("Vapi error:", e);
      setStatus("error");
      setVolume(0);
      setIsSpeaking(false);
    };
    const handleVolumeLevel = (nextVolume) =>
      setVolume((current) => current * 0.45 + clampVolume(nextVolume) * 0.55);
    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      setVolume(0);
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("error", handleError);
    vapi.on("volume-level", handleVolumeLevel);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);

    return () => {
      vapi.removeListener("call-start", handleCallStart);
      vapi.removeListener("call-end", handleCallEnd);
      vapi.removeListener("error", handleError);
      vapi.removeListener("volume-level", handleVolumeLevel);
      vapi.removeListener("speech-start", handleSpeechStart);
      vapi.removeListener("speech-end", handleSpeechEnd);
      if (suppressVapiEventsTimerRef.current) {
        window.clearTimeout(suppressVapiEventsTimerRef.current);
      }
      vapi.stop();
    };
  }, []);

  const startCall = async () => {
    if (status === "connecting" || status === "ending" || status === "active") {
      return;
    }

    try {
      if (suppressVapiEventsTimerRef.current) {
        window.clearTimeout(suppressVapiEventsTimerRef.current);
        suppressVapiEventsTimerRef.current = null;
      }

      suppressVapiEventsRef.current = false;
      setStatus("connecting");
      setVolume(0.12);
      setIsSpeaking(false);
      await vapiRef.current.start(ASSISTANT_ID);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setVolume(0);
      setIsSpeaking(false);
    }
  };

  const endCall = () => {
    if (!vapiRef.current || status === "idle" || status === "ending") return;
    setStatus("ending");
    setIsSpeaking(false);
    setVolume(0.06);
    vapiRef.current.stop();
  };

  const cancelCall = () => {
    if (status === "idle") return;

    if (suppressVapiEventsTimerRef.current) {
      window.clearTimeout(suppressVapiEventsTimerRef.current);
    }

    suppressVapiEventsRef.current = true;
    suppressVapiEventsTimerRef.current = window.setTimeout(() => {
      suppressVapiEventsRef.current = false;
      suppressVapiEventsTimerRef.current = null;
    }, 1200);

    if (status === "connecting" || status === "active" || status === "ending") {
      vapiRef.current?.stop();
    }

    setStatus("idle");
    setVolume(0);
    setIsSpeaking(false);

    if (typeof window !== "undefined") {
      if (window.location.hash) {
        window.history.replaceState(
          null,
          document.title,
          `${window.location.pathname}${window.location.search}`,
        );
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const panelAction =
    status === "active" ? endCall : status === "error" ? startCall : () => {};

  return (
    <RiyaBookingContext.Provider
      value={{ status, isBusy, startCall, endCall }}
    >
      {children}
      <RiyaCallPanel
        status={status}
        volume={volume}
        isSpeaking={isSpeaking}
        onPrimaryAction={panelAction}
        onCancel={cancelCall}
      />
    </RiyaBookingContext.Provider>
  );
}
