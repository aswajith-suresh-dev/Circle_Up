import { Link } from "react-router-dom";
import "../../css/Landing.css";

const LandingNavbar = () => {
  return (
    <nav className="landing-navbar">

      <div className="logo">CircleUp</div>

      <div className="nav-links">
        <Link to="/login">Login</Link>

        <Link to="/signup" className="join-btn">
          Join for Free
        </Link>
      </div>

    </nav>
  );
};

export default LandingNavbar;