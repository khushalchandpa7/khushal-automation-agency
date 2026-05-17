// Pure, side-effect-free detection of WebRTC capability and known in-app browsers.
// Run this BEFORE attempting to start a Vapi call so we can show targeted UX
// instead of letting the SDK throw "WebRTC not supported or suppressed".

const IN_APP_BROWSER_PATTERNS = [
  { id: "instagram", label: "Instagram", regex: /Instagram/i },
  { id: "facebook", label: "Facebook", regex: /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i },
  { id: "messenger", label: "Messenger", regex: /Messenger/i },
  { id: "linkedin", label: "LinkedIn", regex: /LinkedInApp/i },
  { id: "twitter", label: "X / Twitter", regex: /Twitter/i },
  { id: "tiktok", label: "TikTok", regex: /musical_ly|BytedanceWebview|TikTok/i },
  { id: "snapchat", label: "Snapchat", regex: /Snapchat/i },
  { id: "wechat", label: "WeChat", regex: /MicroMessenger/i },
  { id: "line", label: "Line", regex: /\bLine\//i },
  { id: "pinterest", label: "Pinterest", regex: /Pinterest/i },
];

export function detectInAppBrowser(ua = navigator.userAgent || "") {
  for (const entry of IN_APP_BROWSER_PATTERNS) {
    if (entry.regex.test(ua)) return entry;
  }
  return null;
}

export function detectPlatform(ua = navigator.userAgent || "") {
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/i.test(ua);
  return { isIOS, isAndroid, isMobile: isIOS || isAndroid };
}

/**
 * Returns { ok, reason, inAppBrowser, platform, recommendedBrowser }
 *   reason: "ok" | "insecure-context" | "in-app-browser"
 *         | "no-mediadevices" | "no-getusermedia" | "no-rtcpeerconnection"
 */
export function checkWebRTCSupport() {
  if (typeof window === "undefined") {
    return {
      ok: false,
      reason: "no-window",
      platform: { isIOS: false, isAndroid: false, isMobile: false },
      inAppBrowser: null,
      recommendedBrowser: "Safari or Chrome",
    };
  }

  const platform = detectPlatform();
  const inAppBrowser = detectInAppBrowser();
  const recommendedBrowser = platform.isIOS ? "Safari" : "Chrome";

  if (window.isSecureContext === false) {
    return { ok: false, reason: "insecure-context", platform, inAppBrowser, recommendedBrowser };
  }

  if (inAppBrowser) {
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasRTC = typeof window.RTCPeerConnection === "function";
    if (!hasMediaDevices || !hasRTC) {
      return { ok: false, reason: "in-app-browser", platform, inAppBrowser, recommendedBrowser };
    }
  }

  if (!navigator.mediaDevices) {
    return { ok: false, reason: "no-mediadevices", platform, inAppBrowser, recommendedBrowser };
  }
  if (typeof navigator.mediaDevices.getUserMedia !== "function") {
    return { ok: false, reason: "no-getusermedia", platform, inAppBrowser, recommendedBrowser };
  }
  if (typeof window.RTCPeerConnection !== "function") {
    return { ok: false, reason: "no-rtcpeerconnection", platform, inAppBrowser, recommendedBrowser };
  }

  return { ok: true, reason: "ok", platform, inAppBrowser: null, recommendedBrowser };
}

/**
 * Synchronously request mic permission inside a user gesture, then immediately
 * release the tracks. Pre-warms iOS Safari's permission cache so Vapi's
 * subsequent internal acquisition succeeds without re-prompting.
 *
 * Returns: { ok: true } | { ok: false, code, error }
 *   code: "denied" | "no-device" | "insecure" | "unknown"
 */
export async function primeMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return { ok: true };
  } catch (error) {
    const name = error?.name || "";
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      return { ok: false, code: "denied", error };
    }
    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      return { ok: false, code: "no-device", error };
    }
    if (name === "SecurityError") {
      return { ok: false, code: "insecure", error };
    }
    return { ok: false, code: "unknown", error };
  }
}
