import { lazy, Suspense } from "react";
import Nav from "./components/layout/Nav";
import Hero from "./components/sections/Hero";
import PainSolution from "./components/sections/PainSolution";
import SEO from "./components/seo/SEO";

const RoiCalculator = lazy(() =>
  import("./components/sections/RoiCalculator"),
);
const IntegrationStack = lazy(() =>
  import("./components/sections/IntegrationStack"),
);
const WorkflowDemos = lazy(() =>
  import("./components/sections/WorkflowDemos"),
);
const Portfolio = lazy(() => import("./components/sections/Portfolio"));
const AuditQuiz = lazy(() => import("./components/sections/AuditQuiz"));
const Process = lazy(() => import("./components/sections/Process"));
const TrustProof = lazy(() => import("./components/sections/TrustProof"));
const LeadForm = lazy(() => import("./components/sections/LeadForm"));
const Footer = lazy(() => import("./components/layout/Footer"));

function SectionSkeleton() {
  return <div aria-hidden="true" className="min-h-[600px] w-full" />;
}

function App() {
  return (
    <div className="min-h-screen bg-bg-base">
      <SEO />
      <Nav />
      <main aria-label="Main content">
        <Hero />
        <PainSolution />
        <Suspense fallback={<SectionSkeleton />}>
          <RoiCalculator />
          <IntegrationStack />
          <WorkflowDemos />
          <Portfolio />
          <AuditQuiz />
          <Process />
          <TrustProof />
          <LeadForm />
        </Suspense>
      </main>
      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
