import { useEffect, useRef } from "react";
import { ArrowRight, Calculator, ClipboardCheck } from "lucide-react";
import Button from "../ui/Button";
import { gsap } from "../../lib/gsap";
import { useEntrance } from "../../hooks/useEntrance";
import { useIntelligenceStore } from "../../store/intelligenceStore";

const tasks = [
  "Manually copying 200 invoices into Sheets…",
  "Forwarding the same email 14 times a day…",
  "Pasting CSV data between three tools…",
  "Chasing follow-ups that already replied…",
];

function Hero() {
  const rootRef = useEntrance({ stagger: 0.1, y: 32 });
  const typingRef = useRef(null);
  const finaleRef = useRef(null);
  const setSourceSection = useIntelligenceStore((state) => state.setSourceSection);

  useEffect(() => {
    const el = typingRef.current;
    const finale = finaleRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });

      tasks.forEach((task) => {
        tl.to(el, {
          duration: Math.max(0.9, task.length * 0.035),
          text: { value: task, delimiter: "" },
          ease: "none",
        })
          .to({}, { duration: 1.4 })
          .to(el, {
            duration: 0.35,
            opacity: 0.35,
            textDecoration: "line-through",
            ease: "power2.in",
          })
          .to(el, {
            duration: 0.25,
            text: { value: "", delimiter: "" },
            opacity: 1,
            textDecoration: "none",
            ease: "none",
          });
      });

      if (finale) {
        gsap.fromTo(
          finale,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" },
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [rootRef]);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative w-full pt-16 md:pt-24 pb-24 md:pb-32 px-6 overflow-hidden"
    >
      <div className="max-w-container mx-auto">
        <p
          data-entrance
          className="text-xs font-semibold tracking-widest uppercase text-accent-mint-deep mb-6"
        >
          AI Automation Agency
        </p>

        <h1
          data-entrance
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight leading-[0.95] text-ink-base max-w-4xl"
        >
          <span className="block">Stop doing</span>
          <span
            className="relative block h-[3.05em] sm:h-[2.05em]"
            aria-live="polite"
            aria-atomic="true"
          >
            <span
              ref={typingRef}
              className="absolute inset-x-0 top-0 block text-ink-subtle"
            />
          </span>
          <span ref={finaleRef} className="block text-accent-mint-deep">
            Let bots do it.
          </span>
        </h1>

        <p
          data-entrance
          className="mt-8 text-xl text-ink-muted max-w-2xl leading-relaxed"
        >
          We replace your most repetitive daily routines with custom automations
          that run themselves — triggers, form processing, webhooks, and clean
          integrations across the tools you already use.
        </p>

        <div data-entrance className="mt-10 flex flex-wrap items-center gap-4">
          <Button
            as="a"
            href="#contact"
            size="lg"
            onClick={() => setSourceSection("hero-book-call")}
          >
            Book a Discovery Call
            <ArrowRight size={18} strokeWidth={2.5} />
          </Button>
          <Button
            as="a"
            href="#roi-calculator"
            variant="ghost"
            size="lg"
            onClick={() => setSourceSection("hero-calculate-savings")}
          >
            <Calculator size={18} strokeWidth={2.5} />
            Calculate Savings
          </Button>
          <Button
            as="a"
            href="#audit-quiz"
            variant="ghost"
            size="lg"
            onClick={() => setSourceSection("hero-free-audit")}
          >
            <ClipboardCheck size={18} strokeWidth={2.5} />
            Get Free Audit
          </Button>
        </div>

        <p data-entrance className="mt-10 text-sm text-ink-subtle">
          Trusted by ops teams replacing 10+ hrs/week of manual work.
        </p>
      </div>
    </section>
  );
}

export default Hero;
