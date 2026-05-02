import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

  // Respect the user's motion preferences. If they've requested reduced
  // motion at the OS level, kill any timeline progress and skip ScrollTrigger
  // animations entirely instead of fighting CSS's transition kill-switch.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) {
    gsap.globalTimeline.timeScale(100); // collapse anything in flight
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
}

export { gsap, ScrollTrigger, TextPlugin, ScrollToPlugin };
