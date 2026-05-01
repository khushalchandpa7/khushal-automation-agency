import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import PainSolution from "./components/sections/PainSolution";
import Services from "./components/sections/Services";
import Portfolio from "./components/sections/Portfolio";
import Process from "./components/sections/Process";
import LeadForm from "./components/sections/LeadForm";

function App() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Nav />
      <main>
        <Hero />
        <PainSolution />
        <Services />
        <Portfolio />
        <Process />
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
