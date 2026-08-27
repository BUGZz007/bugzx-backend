import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import PartnerPage from "./pages/PartnerPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import { Toaster } from "./components/ui/toaster";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

function RouteLoader({ children }) {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      <PageLoader visible={loading} />
      {children}
    </>
  );
}

function App() {
  return (
    <div className="App bg-white text-black min-h-screen font-orbitron">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <RouteLoader>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />

          </Routes>
          <Footer />
        </RouteLoader>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;

