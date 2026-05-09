import { useEffect, useRef } from "react";
import { ArrowRight, Calculator, ClipboardCheck } from "lucide-react";
import Button from "../ui/Button";
import { gsap } from "../../lib/gsap";
import { useEntrance } from "../../hooks/useEntrance";
import { useRiyaBooking } from "../ui/useRiyaBooking";

const tasks = [
  "Manually copying 200 invoices into Sheets…",
  "Forwarding the same email 14 times a day…",
  "Pasting CSV data between three tools…",
  "Chasing follow-ups that already replied…",
];

const longestTask = tasks.reduce(
  (a, b) => (a.length >= b.length ? a : b),
  "",
);

function Hero() {
  const rootRef = useEntrance({ stagger: 0.1, y: 32 });
  const typingRef = useRef(null);
  const finaleRef = useRef(null);
  const { startCall } = useRiyaBooking();

  useEffect(() => {
    const el = typingRef.current;
    const finale = finaleRef.current;
    if (!el) return;

    el.style.opacity = "1";
    el.style.textDecoration = "none";
    el.style.textDecorationLine = "none";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

      tasks.forEach((task) => {
        tl.set(el, {
          opacity: 1,
          text: "",
          textDecoration: "none",
          textDecorationLine: "none",
        })
          .to(el, {
            duration: Math.max(0.9, task.length * 0.04),
            text: { value: task, delimiter: "" },
            ease: "none",
          })
          .to({}, { duration: 1.3 })
          .set(el, {
            opacity: 1,
            textDecoration: "none",
            textDecorationLine: "none",
          })
          .to({}, {
            duration: Math.max(1.2, task.length * 0.055),
            ease: "none",
            onUpdate: function () {
              const n = Math.round(task.length * (1 - this.progress()));
              el.textContent = task.substring(0, n);
            },
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
      className="relative w-full pt-10 md:pt-20 pb-24 md:pb-32 px-6 overflow-hidden"
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
          <span className="relative block">
            <span aria-hidden="true" className="invisible block break-words">
              {longestTask}
            </span>
            <span
              ref={typingRef}
              className="typing-cursor absolute inset-0 block break-words text-ink-subtle"
              aria-live="polite"
              aria-atomic="true"
            />
          </span>
          <span ref={finaleRef} className="block text-accent-mint-deep">
            Let AGENTS do it.
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
            type="button"
            size="lg"
            onClick={startCall}
          >
            Book a Meeting
            <ArrowRight size={18} strokeWidth={2.5} />
          </Button>
          <Button
            as="a"
            href="#roi-calculator"
            variant="ghost"
            size="lg"
          >
            <Calculator size={18} strokeWidth={2.5} />
            Calculate Savings
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={startCall}
          >
            <ClipboardCheck size={18} strokeWidth={2.5} />
            Discuss My Workflow
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
