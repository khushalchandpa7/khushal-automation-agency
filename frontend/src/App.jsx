import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import PainSolution from "./components/sections/PainSolution";
import RoiCalculator from "./components/sections/RoiCalculator";
import IntegrationStack from "./components/sections/IntegrationStack";
import Services from "./components/sections/Services";
import WorkflowDemos from "./components/sections/WorkflowDemos";
import Portfolio from "./components/sections/Portfolio";
import AuditQuiz from "./components/sections/AuditQuiz";
import Process from "./components/sections/Process";
import TrustProof from "./components/sections/TrustProof";
import LeadForm from "./components/sections/LeadForm";

function App() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main>
        <Hero />
        <PainSolution />
        <RoiCalculator />
        <IntegrationStack />
        <Services />
        <WorkflowDemos />
        <Portfolio />
        <AuditQuiz />
        <Process />
        <TrustProof />
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
