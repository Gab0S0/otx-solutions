import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Pricing from "./components/Pricing";
import HowItWorks from "./components/HowItWorks";
import WhyUs from "./components/WhyUs";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import TicketPage from "./components/TicketPage";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <HowItWorks />
        <WhyUs />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ticket" element={<TicketPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
