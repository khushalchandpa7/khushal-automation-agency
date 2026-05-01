import { useLayoutEffect, useRef } from "react";
import { FileWarning, FolderCheck } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import { gsap, ScrollTrigger } from "../../lib/gsap";

const before = [
  "invoice_FINAL_v3.pdf",
  "Copy of vendor list (1).xlsx",
  "client_followups - read me.docx",
  "Untitled-spreadsheet.csv",
  "Screenshot 2025-... .png",
  "Re: Re: Re: monthly report",
];

const after = [
  { label: "Invoices", value: "Auto-extracted, validated, posted to QuickBooks" },
  { label: "Vendor list", value: "Synced nightly from Airtable → Sheets" },
  { label: "Client follow-ups", value: "Triggered 48h after no reply" },
  { label: "Monthly report", value: "Generated every 1st at 9am, sent to Slack" },
];

function PainSolution() {
  const sectionRef = useRef(null);
  const beforeRef = useRef(null);
  const afterRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const beforeEl = beforeRef.current;
    const afterEl = afterRef.current;
    if (!section || !beforeEl || !afterEl) return;

    const ctx = gsap.context(() => {
      const headerEls = section.querySelectorAll("header > *");
      const beforeItems = beforeEl.querySelectorAll("[data-before-item]");
      const afterItems = afterEl.querySelectorAll("[data-after-item]");
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set([...headerEls, beforeEl, afterEl, ...afterItems], {
          autoAlpha: 1,
          clearProps: "transform,willChange",
        });
        return;
      }

      gsap.set(headerEls, {
        autoAlpha: 0,
        y: 22,
        willChange: "transform, opacity",
      });
      gsap.set([beforeEl, afterEl], {
        autoAlpha: 0,
        y: 32,
        willChange: "transform, opacity",
      });
      gsap.set(afterItems, {
        autoAlpha: 0,
        y: 16,
        willChange: "transform, opacity",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 76%",
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(headerEls, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        clearProps: "transform,willChange",
      })
        .to(
          [beforeEl, afterEl],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.12,
            clearProps: "transform,willChange",
          },
          "-=0.35",
        )
        // Beat 2: messy items strike through and fade.
        .to(beforeItems, {
          opacity: 0.32,
          x: -5,
          textDecoration: "line-through",
          stagger: 0.05,
          duration: 0.45,
          ease: "power2.out",
        })
        // Beat 3: messy panel softens slightly behind.
        .to(
          beforeEl,
          {
            opacity: 0.72,
            scale: 0.985,
            duration: 0.45,
            ease: "power2.out",
            clearProps: "transform,willChange",
          },
          "<0.1",
        )
        // Beat 4: clean rows fade up with stagger.
        .to(
          afterItems,
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.55,
            clearProps: "transform,willChange",
          },
          "-=0.25",
        );
    }, section);

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={sectionRef}>
      <SectionWrap
        id="pain-solution"
        eyebrow="Before / After"
        title="Messy work in. Clean automations out."
        lede="Most teams are buried in repetitive admin work that nobody is paid to do. We turn the chaos into systems that just run."
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div
            ref={beforeRef}
            className="rounded-3xl border border-ink-base/10 p-8 bg-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileWarning size={20} className="text-accent-tangerine" />
              <h3 className="font-semibold text-lg">The way it is now</h3>
            </div>
            <ul className="space-y-3 font-mono text-sm text-ink-muted">
              {before.map((line) => (
                <li key={line} data-before-item className="truncate">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div ref={afterRef} className="rounded-3xl bg-ink-base text-bg-base p-8">
            <div className="flex items-center gap-3 mb-6">
              <FolderCheck size={20} className="text-accent-mint" />
              <h3 className="font-semibold text-lg">The way it should be</h3>
            </div>
            <ul className="space-y-4">
              {after.map((item) => (
                <li
                  key={item.label}
                  data-after-item
                  className="grid grid-cols-3 gap-4"
                >
                  <span className="text-accent-mint text-sm font-semibold col-span-1">
                    {item.label}
                  </span>
                  <span className="text-bg-base/80 text-sm col-span-2 leading-relaxed">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrap>
    </div>
  );
}

export default PainSolution;
