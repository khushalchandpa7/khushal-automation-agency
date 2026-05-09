import { lazy, Suspense } from "react";
import Nav from "./components/layout/Nav";
import Hero from "./components/sections/Hero";
import PainSolution from "./components/sections/PainSolution";
import SEO from "./components/seo/SEO";
import { RiyaBookingProvider } from "./components/ui/RiyaBookingProvider";

const RoiCalculator = lazy(() => import("./components/sections/RoiCalculator"));
const IntegrationStack = lazy(
  () => import("./components/sections/IntegrationStack"),
);
const WorkflowDemos = lazy(() => import("./components/sections/WorkflowDemos"));
const Portfolio = lazy(() => import("./components/sections/Portfolio"));
const Process = lazy(() => import("./components/sections/Process"));
const TrustProof = lazy(() => import("./components/sections/TrustProof"));
const Footer = lazy(() => import("./components/layout/Footer"));

function SectionSkeleton() {
  return <div aria-hidden="true" className="min-h-[600px] w-full" />;
}

function App() {
  return (
    <RiyaBookingProvider>
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
            <Process />
            <TrustProof />
          </Suspense>
        </main>
        <Suspense fallback={<SectionSkeleton />}>
          <Footer />
        </Suspense>
      </div>
    </RiyaBookingProvider>
  );
}

export default App;
