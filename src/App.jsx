import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/sections/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Timeline from "./components/sections/Timeline";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import Projects from "./components/sections/Projects";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin.jsx";
import SkillsBanner from "./components/SkillsBanner";
import SmoothCursor from "./components/SmoothCursor";
import ChatBot from "./components/ChatBot";
import PortfolioSkeleton from "./components/PortfolioSkeleton";
import { useAnalyticsTracker } from "./hooks/useAnalyticsTracker";
import "./App.css";

function Portfolio() {
  const [loading, setLoading] = useState(true);
  useAnalyticsTracker();

  useEffect(() => {
    // Show skeleton loader on initial page load, then cross-fade smoothly to live content
    const timer = setTimeout(() => {
      setLoading(false);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <PortfolioSkeleton isVisible={loading} />
      <SmoothCursor size={60} ease={0.16} />
      <Navbar />
      <Hero />
      <main className="portfolioMainContent">
        <About />
        {/* <Timeline /> -- Milestones section (Uncomment once first client is closed) */}
        <SkillsBanner />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;