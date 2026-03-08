import {
  FiUsers,
  FiMessageSquare,
  FiFolder,
  FiAward,
  FiUserCheck,
  FiStar
} from "react-icons/fi";

import "../../css/Features.css";

const Features = () => {
  return (
    <section className="features-section">

      <div className="features-header">
        <span className="features-label">FEATURES</span>

        <h2>
          Everything You Need to Learn and Grow
        </h2>

        <p>
          CircleUp brings circles, discussions, and personal learning spaces
          together in one platform.
        </p>
      </div>

      <div className="features-grid">

        <div className="feature-card">
          <div className="feature-icon"><FiUsers /></div>
          <h3>Join Circles</h3>
          <p>Find circles based on topics you love and learn with people who share the same interests.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><FiMessageSquare /></div>
          <h3>Post Doubts</h3>
          <p>Ask doubts or start discussions and get helpful replies from your circle members.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><FiFolder /></div>
          <h3>Personal Space</h3>
          <p>Keep your learning organized with your own personal space for notes and resources.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><FiAward /></div>
          <h3>Learning Challenges</h3>
          <p>Stay consistent and improve your skills through engaging challenges.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><FiUserCheck /></div>
          <h3>Become a Mentor</h3>
          <p>Experienced members can apply to become mentors and guide others through discussions.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><FiStar /></div>
          <h3>Contributors</h3>
          <p>Active contributors help the community by sharing knowledge and answering doubts.</p>
        </div>

      </div>

    </section>
  );
};

export default Features;