import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";

const Hero = () => {
return (
<section
className="hero"
style={{ backgroundImage: `url(${heroImage})` }}
>
<div className="hero-content">

    <h1>
      Build Your Circle.<br />
      Learn Together.
    </h1>

    <p>
      Join circles, share knowledge, and grow together every day.
    </p>

    <div className="hero-buttons">

      <Link to="/signup" className="primary-btn">
        Join CircleUp
      </Link>

      <Link to="/login" className="secondary-btn">
        Explore Circles
      </Link>

    </div>

  </div>
</section>

);
};

export default Hero;