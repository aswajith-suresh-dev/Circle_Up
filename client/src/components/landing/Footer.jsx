import { Link } from "react-router-dom";
import "../../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Logo Section */}
        <div className="footer-brand">
          <h2>CircleUp</h2>
          <p>
            Learn together through circles, discussions,
            and challenges. Grow with mentors and contributors.
          </p>
        </div>

        {/* Product Links */}
        <div className="footer-links">
          <h4>Product</h4>
          <Link to="#">Features</Link>
          <Link to="#">Circles</Link>
          <Link to="#">Challenges</Link>
        </div>

        {/* Company Links */}
        <div className="footer-links">
          <h4>Company</h4>
          <Link to="#">About</Link>
          <Link to="#">Contact</Link>
        </div>

        {/* Account */}
        <div className="footer-links">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} CircleUp. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;