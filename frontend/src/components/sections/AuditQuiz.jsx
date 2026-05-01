import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ClipboardCheck, RotateCcw } from "lucide-react";
import SectionWrap from "../ui/SectionWrap";
import Button from "../ui/Button";
import { useEntrance } from "../../hooks/useEntrance";
import { useIntelligenceStore } from "../../store/intelligenceStore";

const questions = [
  {
    key: "department",
    label: "Where is the manual work happening?",
    options: ["Sales", "Operations", "Finance", "Customer success"],
  },
  {
    key: "tools",
    label: "Which stack is involved most often?",
    options: ["CRM + inbox", "Sheets + docs", "Store + payments", "Internal ops tools"],
  },
  {
    key: "task",
    label: "What hurts most right now?",
    options: [
      "Copying data between tools",
      "Following up with leads or clients",
      "Processing forms, PDFs, or emails",
      "Building reports by hand",
    ],
  },
  {
    key: "frequency",
    label: "How often does it happen?",
    options: ["Every day", "A few times a week", "Weekly", "Whenever volume spikes"],
  },
  {
    key: "type",
    label: "What kind of help sounds closest?",
    options: ["AI extraction", "Workflow automation", "App integrations", "Not sure yet"],
  },
];

function getRecommendation(answers) {
  if (answers.type === "AI extraction" || answers.task?.includes("PDFs")) {
    return {
      title: "AI intake and extraction workflow",
      body: "Best fit for turning emails, PDFs, forms, and messy notes into clean structured data.",
    };
  }

  if (answers.type === "App integrations" || answers.task?.includes("data")) {
    return {
      title: "Cross-tool integration sprint",
      body: "Best fit for syncing CRMs, spreadsheets, ecommerce tools, inboxes, and payment systems.",
    };
  }

  if (answers.task?.includes("reports")) {
    return {
      title: "Automated reporting pipeline",
      body: "Best fit for scheduled dashboards, exception alerts, and daily operating summaries.",
    };
  }

  return {
    title: "Workflow automation build",
    body: "Best fit for recurring tasks with clear triggers, handoffs, rules, and notifications.",
  };
}

function AuditQuiz() {
  const ref = useEntrance({ stagger: 0.08, y: 28 });
  const setQuiz = useIntelligenceStore((state) => state.setQuiz);
  const setSourceSection = useIntelligenceStore((state) => state.setSourceSection);
  const clearQuiz = useIntelligenceStore((state) => state.clearQuiz);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const answeredCount = Object.keys(answers).length;
  const complete = questions.every((question) => answers[question.key]);
  const recommendation = useMemo(() => getRecommendation(answers), [answers]);
  const activeQuestion = questions[step];

  useEffect(() => {
    if (answeredCount === 0) return;

    setQuiz({
      answers,
      recommendation: complete ? recommendation : null,
      completed: complete,
    });
  }, [answeredCount, answers, complete, recommendation, setQuiz]);

  function answerQuestion(value) {
    setAnswers((current) => ({
      ...current,
      [activeQuestion.key]: value,
    }));

    if (step < questions.length - 1) {
      setStep((current) => current + 1);
    }
  }

  function resetQuiz() {
    setStep(0);
    setAnswers({});
    clearQuiz();
  }

  return (
    <div ref={ref}>
      <SectionWrap
        id="audit-quiz"
        eyebrow="Free automation audit"
        title="Answer five questions and get a starting point."
        lede="The quiz helps colder visitors self-qualify, and it gives us useful context before the first call."
        className="bg-white/45"
      >
        <div className="grid lg:grid-cols-5 gap-6">
          <div
            data-entrance
            className="lg:col-span-3 rounded-3xl border border-ink-base/8 bg-white p-7 md:p-8 shadow-soft"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-ink-subtle">
                Question {Math.min(step + 1, questions.length)} of{" "}
                {questions.length}
              </p>
              <div className="h-2 w-36 overflow-hidden rounded-full bg-ink-base/8">
                <div
                  className="h-full rounded-full bg-accent-mint transition-all"
                  style={{
                    width: `${(answeredCount / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <h3 className="mt-8 text-2xl font-semibold">
              {activeQuestion.label}
            </h3>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {activeQuestion.options.map((option) => {
                const selected = answers[activeQuestion.key] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => answerQuestion(option)}
                    className={`rounded-2xl border p-4 text-left text-sm font-semibold transition-colors ${
                      selected
                        ? "border-accent-mint bg-accent-mint/20"
                        : "border-ink-base/10 bg-bg-base hover:border-accent-mint/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={step === 0}
                className="text-sm font-semibold text-ink-muted transition-colors hover:text-ink-base disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink-base"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            </div>
          </div>

          <aside
            data-entrance
            className="lg:col-span-2 rounded-3xl bg-ink-base p-7 md:p-8 text-bg-base shadow-lift"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-mint text-ink-base">
              <ClipboardCheck size={24} />
            </span>
            <p className="mt-6 text-sm font-semibold text-bg-base/60">
              Suggested automation type
            </p>
            <h3 className="mt-2 text-2xl font-semibold">
              {complete ? recommendation.title : "Finish the quiz"}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-bg-base/75">
              {complete
                ? recommendation.body
                : "Your recommendation updates as soon as all five answers are selected."}
            </p>

            {complete && (
              <div className="mt-6 rounded-2xl bg-bg-base/8 p-5 text-sm text-bg-base/75">
                <p>
                  We will attach these answers to your lead request so the first
                  call starts with the right workflow context.
                </p>
              </div>
            )}

            <Button
              as="a"
              href="#contact"
              size="md"
              className="mt-7 w-full"
              onClick={() => setSourceSection("audit-quiz-cta")}
            >
              Send My Audit Context
              <ArrowRight size={18} />
            </Button>
          </aside>
        </div>
      </SectionWrap>
    </div>
  );
}

export default AuditQuiz;
