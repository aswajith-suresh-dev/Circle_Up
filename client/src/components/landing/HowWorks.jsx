import { FiUsers, FiMessageSquare, FiAward, FiUserCheck } from "react-icons/fi";
import "../../css/HowWorks.css";

const HowWorks = () => {
  return (
    <section className="how-section">

      <div className="how-container">

        {/* LEFT VISUAL */}
        <div className="how-visual">
          <div className="visual-box">
            <div className="visual-card card1">Circles</div>
            <div className="visual-card card2">Discussions</div>
            <div className="visual-card card3">Challenges</div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="how-content">

          <span className="how-label">HOW IT WORKS</span>

          <h2>How CircleUp Works</h2>

          <p>
            Start learning in circles, share doubts, participate in challenges,
            and grow into a valued member of the community.
          </p>

          <div className="how-grid">

           <div className="how-card">
  <span className="step-number">01</span>
  <FiUsers className="how-icon" />
  <h3>Join Circles</h3>
  <p>
    Browse circles using search and filters to find topics that match
    your interests.
  </p>
</div>
<div className="how-card">
  <span className="step-number">02</span>
  <FiMessageSquare className="how-icon" />
  <h3>Post Doubts</h3>
  <p>
    Ask doubts or start discussions and learn from replies shared by
    circle members.
  </p>
</div>
<div className="how-card">
  <span className="step-number">03</span>
  <FiAward className="how-icon" />
  <h3>Learn & Participate</h3>
  <p>
    Join challenges and use your personal space to organize notes and
    learning resources.
  </p>
</div>
<div className="how-card">
  <span className="step-number">04</span>
  <FiUserCheck className="how-icon" />
  <h3>Earn Recognition</h3>
  <p>
    Active members become contributors, and experienced members can
    become mentors.
  </p>
</div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default HowWorks;