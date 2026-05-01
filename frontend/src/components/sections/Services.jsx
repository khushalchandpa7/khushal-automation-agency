import { useLayoutEffect, useRef } from "react";
import {
  Zap,
  FormInput,
  Webhook,
  Inbox,
  BarChart3,
  Bot,
} from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import BentoCard from "../ui/BentoCard";
import { gsap, ScrollTrigger } from "../../lib/gsap";

const services = [
  {
    icon: Zap,
    title: "Trigger-Based Workflows",
    body: "When a customer pays, when a form is filled, when a row is added — we build the chain reaction that runs the rest.",
    size: "lg",
    tone: "default",
  },
  {
    icon: FormInput,
    title: "Form Processing & Data Extraction",
    body: "Turn PDFs, emails, and inbound forms into clean, structured data your team can actually use.",
    size: "md",
    tone: "default",
  },
  {
    icon: Webhook,
    title: "Webhook Integrations",
    body: "Connect anything to anything. Webhooks, REST APIs, retries, and monitoring built-in.",
    size: "sm",
    tone: "mint",
  },
  {
    icon: Inbox,
    title: "Inbox & CRM Automation",
    body: "Auto-tagging, follow-ups, lead routing — your CRM works for you instead of the other way around.",
    size: "sm",
    tone: "default",
  },
  {
    icon: BarChart3,
    title: "Reporting & Data Sync",
    body: "Two-way syncs, scheduled reports, and one source of truth across the tools you already pay for.",
    size: "md",
    tone: "default",
  },
  {
    icon: Bot,
    title: "Custom AI Agents",
    body: "LLM-powered assistants for triage, summarization, and any task that's almost-but-not-quite rules-based.",
    size: "sm",
    tone: "tangerine",
  },
];

function Services() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const headerEls = root.querySelectorAll("header > *");
      const cards = root.querySelectorAll("[data-bento]");
      const icons = root.querySelectorAll("[data-bento-icon]");
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set([...headerEls, ...cards, ...icons], {
          autoAlpha: 1,
          clearProps: "transform,willChange",
        });
        return;
      }

      // Hide everything synchronously so there's no flash of natural state
      // before the trigger fires.
      gsap.set(headerEls, {
        autoAlpha: 0,
        y: 22,
        willChange: "transform, opacity",
      });
      gsap.set(cards, {
        autoAlpha: 0,
        y: 42,
        scale: 0.96,
        transformOrigin: "center bottom",
        willChange: "transform, opacity",
      });
      gsap.set(icons, {
        autoAlpha: 0,
        scale: 0.75,
        rotate: -12,
        transformOrigin: "center",
        willChange: "transform, opacity",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 76%",
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "power3.out" },
      });

      // Beat 1: section header settles in.
      tl.to(headerEls, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        clearProps: "transform,willChange",
      });

      // Beat 2: cards rise in a grid-aware cascade.
      tl.to(
        cards,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          ease: "power3.out",
          stagger: { each: 0.075, from: "start" },
          // Strip the inline transform once the entrance is done so the
          // BentoCard hover spring (scale + lift) starts from a clean slate.
          clearProps: "transform,willChange",
        },
        "-=0.35",
      );

      // Beat 3: icons land after the card body so the motion feels layered.
      tl.to(
        icons,
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 0.45,
          ease: "back.out(1.6)",
          stagger: 0.045,
          clearProps: "transform,willChange",
        },
        "-=0.45",
      );
    }, root);

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <SectionWrap
        id="services"
        eyebrow="What we build"
        title="Custom automations, not off-the-shelf templates."
        lede="Every workflow we ship is tailored to your stack, your team, and the specific task that's wasting your week."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[14rem] grid-flow-dense gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <BentoCard
                key={s.title}
                size={s.size}
                tone={s.tone}
                data-bento
              >
                <div className="flex flex-col h-full">
                  <Icon
                    size={24}
                    strokeWidth={2}
                    data-bento-icon
                    className={`origin-center ${s.tone === "ink" ? "text-accent-mint" : ""}`}
                  />
                  <h3 className="mt-6 text-xl font-semibold leading-tight">
                    {s.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${s.tone === "default" ? "text-ink-muted" : "text-accent-contrast/80"}`}
                  >
                    {s.body}
                  </p>
                </div>
              </BentoCard>
            );
          })}
        </div>
      </SectionWrap>
    </div>
  );
}

export default Services;
