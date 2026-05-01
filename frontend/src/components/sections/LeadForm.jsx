import { useEffect, useRef } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import Button from "../ui/Button";
import { useLeadStore } from "../../store/leadStore";
import { useEntrance } from "../../hooks/useEntrance";
import { gsap } from "../../lib/gsap";

function FieldError({ messages }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p className="mt-2 text-sm text-accent-tangerine-deep">
      {messages[0]}
    </p>
  );
}

function LeadForm() {
  const { form, setField, submit, status, fieldErrors, errorMessage, reset } =
    useLeadStore();

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  const rootRef = useEntrance({ stagger: 0.08 });
  const successRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await submit();
    } catch {
      /* error state already set in store */
    }
  }

  useEffect(() => {
    if (isSuccess && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.96, y: 8 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: "back.out(1.4)",
        },
      );
    }
  }, [isSuccess]);

  return (
    <div ref={rootRef}>
    <SectionWrap
      id="contact"
      eyebrow="Book a Discovery Call"
      title="Tell us what's wasting your week."
      lede="The more specific you are about the routine you want gone, the faster we can tell you whether we can help. Most replies in under a business day."
    >
      <div className="grid md:grid-cols-5 gap-8">
        <div data-entrance className="md:col-span-2">
          <ul className="space-y-4 text-sm text-ink-muted leading-relaxed">
            <li className="flex gap-3">
              <CheckCircle2
                size={18}
                className="text-accent-mint-deep flex-shrink-0 mt-0.5"
              />
              <span>30-minute, no-pitch discovery call.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2
                size={18}
                className="text-accent-mint-deep flex-shrink-0 mt-0.5"
              />
              <span>You leave with a one-page scope and a fixed quote.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2
                size={18}
                className="text-accent-mint-deep flex-shrink-0 mt-0.5"
              />
              <span>If we're not the right fit, we'll tell you who is.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2
                size={18}
                className="text-accent-mint-deep flex-shrink-0 mt-0.5"
              />
              <span>Calculator and audit answers come through with your request.</span>
            </li>
          </ul>
        </div>

        <div data-entrance className="md:col-span-3">
          {isSuccess ? (
            <div
              ref={successRef}
              className="rounded-3xl bg-accent-mint/15 border border-accent-mint/40 p-8 text-center"
            >
              <CheckCircle2
                size={32}
                className="text-accent-mint-deep mx-auto"
              />
              <h3 className="mt-4 text-2xl font-semibold">
                Got it — talk soon.
              </h3>
              <p className="mt-2 text-ink-muted">
                We'll reply from <span className="font-medium">khushalchandpa7@gmail.com</span> within one business day.
              </p>
              <button
                onClick={reset}
                className="mt-6 text-sm font-medium underline text-ink-base hover:text-accent-tangerine-deep"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-surface-base border border-surface-strong p-8 space-y-5"
              noValidate
            >
              {/* Honeypot — humans never see, bots fill it. */}
              <div
                aria-hidden="true"
                className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden"
              >
                <label htmlFor="website">Website (leave empty)</label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setField("website", e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-ink-base mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-surface-strong focus:border-accent-mint focus:ring-2 focus:ring-accent-mint/30 outline-none transition-colors"
                  placeholder="Your name"
                />
                <FieldError messages={fieldErrors.name} />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ink-base mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-surface-strong focus:border-accent-mint focus:ring-2 focus:ring-accent-mint/30 outline-none transition-colors"
                  placeholder="you@company.com"
                />
                <FieldError messages={fieldErrors.email} />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-ink-base mb-2"
                >
                  Company <span className="text-ink-subtle font-normal">(optional)</span>
                </label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={(e) => setField("company", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-surface-strong focus:border-accent-mint focus:ring-2 focus:ring-accent-mint/30 outline-none transition-colors"
                  placeholder="Acme Co."
                />
                <FieldError messages={fieldErrors.company} />
              </div>

              <div>
                <label
                  htmlFor="painPoints"
                  className="block text-sm font-medium text-ink-base mb-2"
                >
                  What routine do you want gone?
                </label>
                <textarea
                  id="painPoints"
                  rows={4}
                  value={form.painPoints}
                  onChange={(e) => setField("painPoints", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-surface-strong focus:border-accent-mint focus:ring-2 focus:ring-accent-mint/30 outline-none transition-colors resize-none"
                  placeholder="e.g. Every Monday I copy 200 invoices from email into a spreadsheet, then chase down line items that don't match…"
                />
                <FieldError messages={fieldErrors.painPoints} />
              </div>

              {errorMessage && Object.keys(fieldErrors).length === 0 && (
                <p className="text-sm text-accent-tangerine-deep">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Book a Discovery Call
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </SectionWrap>
    </div>
  );
}

export default LeadForm;
