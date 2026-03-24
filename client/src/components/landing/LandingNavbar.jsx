import { Link } from "react-router-dom";
import "../../css/Landing.css";

const LandingNavbar = () => {
  return (
    <nav className="landing-navbar">

<div className="logo">
    <Link to="/" className="logo-link">

  <img src="/landinglogo.png" alt="CircleUp" className="logo-img" />
  <span className="logo-text">CircleUp</span>
  </Link>
</div>
      <div className="nav-links">
        <Link to="/login">Login</Link>

        <Link to="/signup" className="landing-join-btn">
          Join for Free
        </Link>
      </div>

    </nav>
  );
};

export default LandingNavbar;