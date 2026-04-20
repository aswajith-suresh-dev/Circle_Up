import { Link } from "react-router-dom";
import "../css/Landing.css";
import Hero from "../components/landing/Hero";
import AboutSection from "../components/landing/AboutSection";
import Features from "../components/landing/Features";
import HowWorks from "../components/landing/HowWorks";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import LandingNavbar from "../components/landing/LandingNavbar";

const Landing = () => {
  return (
    <div className="landing">
      {/* Navbar */}
      <LandingNavbar />

      {/* HERO COMPONENT */}
      <Hero />
      <div id="why">
        <AboutSection />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="how">
        <HowWorks />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <CTA />
      
      <Footer />
    </div>
  );
};

export default Landing;
