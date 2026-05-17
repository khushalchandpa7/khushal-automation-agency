import { useEffect, useRef, useState } from "react";
import VapiPkg from "@vapi-ai/web";
import { Copy, ExternalLink, Loader2, Mic2, MicOff, PhoneCall, PhoneOff, X } from "lucide-react";
import { RiyaBookingContext } from "./useRiyaBooking";
import { checkWebRTCSupport, primeMicrophonePermission } from "../../lib/webrtcSupport";

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
    body: "Something went wrong starting the call. Try again, or check your network.",
    action: "Try again",
  },
  "permission-denied": {
    eyebrow: "Microphone blocked",
    title: "Mic access is needed",
    body: "Riya needs your microphone to hear you. Tap the lock or camera icon in your address bar, allow microphone access, then try again.",
    action: "Try again",
  },
  unsupported: {
    eyebrow: "Browser not supported",
    title: "Open in your system browser",
    body: "",
    action: "Close",
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

function UnsupportedPanelBody({ supportInfo }) {
  const [copied, setCopied] = useState(false);

  const info = supportInfo || {};
  const inApp = info.inAppBrowser;
  const recommended = info.recommendedBrowser || "Safari or Chrome";
  const platform = info.platform || {};

  let headline;
  let instructions;

  if (info.reason === "in-app-browser" && inApp) {
    headline = `You're inside the ${inApp.label} in-app browser.`;
    instructions = platform.isIOS
      ? `Tap the menu (•••) at the top right and choose "Open in ${recommended}" to use the voice agent.`
      : `Tap the menu (⋮) at the top right and choose "Open in ${recommended}" to use the voice agent.`;
  } else if (info.reason === "insecure-context") {
    headline = "This page isn't on a secure (HTTPS) connection.";
    instructions = "Voice calls require HTTPS. Please reload the page from the secure URL.";
  } else if (
    info.reason === "no-mediadevices" ||
    info.reason === "no-getusermedia" ||
    info.reason === "no-rtcpeerconnection"
  ) {
    headline = "Your browser doesn't support voice calls.";
    instructions = `Please open this page in ${recommended} to talk to Riya.`;
  } else {
    headline = "Your browser can't run the voice agent here.";
    instructions = `Please open this page in ${recommended}.`;
  }

  const copyLink = async () => {
    try {
      const url = window.location.href;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // user can long-press the URL bar as a last resort
    }
  };

  return (
    <div className="mx-auto w-full max-w-md text-left">
      <div className="rounded-2xl border border-panel-soft bg-panel-base/60 p-4 shadow-soft sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-panel-soft text-accent-tangerine">
            <MicOff size={18} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-panel-text">{headline}</p>
            <p className="mt-1 text-sm leading-6 text-panel-muted">{instructions}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-panel-soft bg-panel-base px-4 py-3 text-sm font-medium text-panel-text transition can-hover:hover:border-accent-mint/60 can-hover:hover:text-accent-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint"
          aria-label="Copy page link to paste into your system browser"
        >
          {copied ? (
            <>
              <ExternalLink size={16} strokeWidth={2.2} />
              Link copied — paste it in {recommended}
            </>
          ) : (
            <>
              <Copy size={16} strokeWidth={2.2} />
              Copy link to open in {recommended}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function RiyaCallPanel({
  status,
  volume,
  isSpeaking,
  supportInfo,
  onPrimaryAction,
  onCancel,
}) {
  if (status === "idle") return null;

  const copy = PANEL_COPY[status];
  const title =
    status === "active" && isSpeaking ? copy.speakingTitle : copy.title;
  const isBusy = status === "connecting" || status === "ending";
  const isError = status === "error" || status === "permission-denied";
  const isUnsupported = status === "unsupported";

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
            {isUnsupported ? (
              <MicOff size={20} strokeWidth={2.2} />
            ) : (
              <Mic2 size={20} strokeWidth={2.2} />
            )}
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
          {isUnsupported ? (
            <UnsupportedPanelBody supportInfo={supportInfo} />
          ) : (
            <RiyaWave status={status} volume={volume} isSpeaking={isSpeaking} />
          )}
        </div>

        <footer className="mx-auto w-full max-w-lg pb-[max(env(safe-area-inset-bottom),0px)]">
          {!isUnsupported && (
            <p className="text-sm leading-6 text-panel-muted sm:text-base md:text-lg md:leading-7">
              {copy.body}
            </p>
          )}

          <button
            type="button"
            onClick={onPrimaryAction}
            disabled={isBusy}
            className={`mt-4 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-accent-contrast shadow-soft transition duration-300 disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-panel-base sm:mt-6 ${
              isError || isUnsupported
                ? "bg-accent-tangerine can-hover:hover:bg-accent-tangerine-deep active:bg-accent-tangerine-deep"
                : "bg-accent-mint can-hover:hover:bg-accent-mint-deep active:bg-accent-mint-deep"
            }`}
          >
            {isBusy ? (
              <Loader2 size={18} strokeWidth={2.2} className="animate-spin" />
            ) : status === "active" ? (
              <PhoneOff size={18} strokeWidth={2.2} />
            ) : isUnsupported ? (
              <X size={18} strokeWidth={2.2} />
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
  const vapiCleanupRef = useRef(null);
  const suppressVapiEventsRef = useRef(false);
  const suppressVapiEventsTimerRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [volume, setVolume] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supportInfo, setSupportInfo] = useState(null);

  const isBusy = status === "connecting" || status === "ending";

  useEffect(() => {
    if (typeof document === "undefined" || status === "idle") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [status]);

  // Lazy Vapi initializer — only constructed once, on first successful gesture.
  // Avoids any chance of SDK internals touching WebRTC on page load in
  // environments where it's stubbed/suppressed.
  const ensureVapi = () => {
    if (vapiRef.current) return vapiRef.current;

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
      const msg = String(e?.message || e?.error || e || "");
      if (/webrtc/i.test(msg) && /(not supported|suppressed)/i.test(msg)) {
        setSupportInfo(checkWebRTCSupport());
        setStatus("unsupported");
      } else {
        setStatus("error");
      }
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

    vapiCleanupRef.current = () => {
      vapi.removeListener("call-start", handleCallStart);
      vapi.removeListener("call-end", handleCallEnd);
      vapi.removeListener("error", handleError);
      vapi.removeListener("volume-level", handleVolumeLevel);
      vapi.removeListener("speech-start", handleSpeechStart);
      vapi.removeListener("speech-end", handleSpeechEnd);
    };

    return vapi;
  };

  useEffect(() => {
    return () => {
      if (suppressVapiEventsTimerRef.current) {
        window.clearTimeout(suppressVapiEventsTimerRef.current);
      }
      const vapi = vapiRef.current;
      if (vapi) {
        vapiCleanupRef.current?.();
        try {
          vapi.stop();
        } catch {
          // noop
        }
      }
    };
  }, []);

  // startCall MUST be called directly from an onClick handler.
  // Step order is critical for iOS Safari: pre-flight → synchronous mic prime
  // → only then await Vapi.start.
  const startCall = async () => {
    if (status === "connecting" || status === "ending" || status === "active") {
      return;
    }

    const support = checkWebRTCSupport();
    if (!support.ok) {
      setSupportInfo(support);
      setStatus("unsupported");
      return;
    }

    setStatus("connecting");
    setVolume(0.12);
    setIsSpeaking(false);

    const mic = await primeMicrophonePermission();
    if (!mic.ok) {
      if (mic.code === "denied") {
        setStatus("permission-denied");
      } else if (mic.code === "insecure" || mic.code === "no-device") {
        setSupportInfo(checkWebRTCSupport());
        setStatus("unsupported");
      } else {
        setStatus("error");
      }
      setVolume(0);
      return;
    }

    try {
      if (suppressVapiEventsTimerRef.current) {
        window.clearTimeout(suppressVapiEventsTimerRef.current);
        suppressVapiEventsTimerRef.current = null;
      }
      suppressVapiEventsRef.current = false;
      const vapi = ensureVapi();
      await vapi.start(ASSISTANT_ID);
    } catch (err) {
      console.error(err);
      const msg = String(err?.message || err || "");
      if (/webrtc/i.test(msg) && /(not supported|suppressed)/i.test(msg)) {
        setSupportInfo(checkWebRTCSupport());
        setStatus("unsupported");
      } else {
        setStatus("error");
      }
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
    setSupportInfo(null);
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
    status === "active"
      ? endCall
      : status === "error" || status === "permission-denied"
        ? startCall
        : status === "unsupported"
          ? cancelCall
          : () => {};

  return (
    <RiyaBookingContext.Provider
      value={{ status, isBusy, startCall, endCall }}
    >
      {children}
      <RiyaCallPanel
        status={status}
        volume={volume}
        isSpeaking={isSpeaking}
        supportInfo={supportInfo}
        onPrimaryAction={panelAction}
        onCancel={cancelCall}
      />
    </RiyaBookingContext.Provider>
  );
}
