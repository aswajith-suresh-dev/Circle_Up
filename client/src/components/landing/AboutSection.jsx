import "../../css/AboutSection.css";
import { FiUsers } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { FiTrendingUp } from "react-icons/fi";
import { FiBookOpen } from "react-icons/fi";
const AboutSection = () => {
return (
<section className="about-section">

  <div className="about-container">

    {/* LEFT SIDE */}
    <div className="about-left">

      <h2>Why CircleUp?</h2>

      <p>
        CircleUp connects learners through focused circles where people share
        knowledge, ask questions, and grow together every day.
      </p>

      <button className="about-btn">
        Explore Circles
      </button>

    </div>

    {/* RIGHT SIDE */}
    <div className="about-grid">

      <div className="about-card">
<FiUsers className="card-icon" />        <h3>Join Circles</h3>
        <p>Find circles built around shared interests and learning goals.</p>
      </div>

      <div className="about-card">
<FiMessageSquare className="card-icon" />
        <h3>Share Knowledge</h3>
        <p>Ask questions, share ideas, and learn through meaningful discussions.</p>
      </div>

      <div className="about-card">
<FiTrendingUp className="card-icon" />
        <h3>Grow Through Challenges</h3>
        <p>Stay motivated with challenges that help you improve your skills.</p>
      </div>

      <div className="about-card">
<FiBookOpen className="card-icon" />
        <h3>Learn from Circles</h3>
        <p>Discover answers, insights, and experiences shared within your circles.</p>
      </div>

    </div>

  </div>

</section>

);
};

export default AboutSection;