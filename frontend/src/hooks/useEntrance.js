import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

/**
 * Shared section entrance animation.
 *
 * `refreshKey` is intentionally part of the hook API so sections with async
 * content can re-scan their final DOM once the data is ready.
 */
export function useEntrance({
  stagger = 0.08,
  delay = 0,
  y = 24,
  start = "top 82%",
  refreshKey,
} = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll("[data-entrance]");
    if (targets.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(targets, {
          autoAlpha: 1,
          clearProps: "transform,transitionProperty,willChange",
        });
        return;
      }

      gsap.set(targets, {
        autoAlpha: 0,
        y,
        transitionProperty: "none",
        willChange: "transform, opacity",
      });

      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        ease: "power3.out",
        stagger,
        delay,
        clearProps: "transform,transitionProperty,willChange",
        scrollTrigger: {
          trigger: root,
          start,
          once: true,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, [stagger, delay, y, start, refreshKey]);

  return ref;
}
