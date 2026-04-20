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
          <h4>Platform</h4>
          <a href="/#why">Why CircleUp</a>
          <a href="/#features">Features</a>
          <a href="/#how">How It Works</a>
          <a href="/#testimonials">Testimonials</a>
        </div>

        {/* Company Links */}
        <div className="footer-links">
          <h4>Community</h4>
          <a href="#why">About</a>
<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=support@circleup.com&su=Support&body=Hello",
      "_blank"
    );
  }}
>
  Contact
</a>        </div>

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