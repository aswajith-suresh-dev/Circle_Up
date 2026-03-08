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
  
<AboutSection />
<Features />
<HowWorks />    
<Testimonials />
<CTA /> 
<Footer />
</div>

);
};

export default Landing;