import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";
import "../../css/CTA.css";

const CTA = () => {
  return (
    <section className="cta-section">

      <div className="cta-card">

        {/* Small top-left ring */}
        <div className="cta-left-circle">
          <div className="cta-small-ring"></div>
        </div>

        {/* Big right ring */}
        <div className="cta-right">

          <div className="cta-ring">

            {/* 3 person icons */}<FiUser className="ring-person person-top" />
<FiUser className="ring-person person-middle" />
<FiUser className="ring-person person-bottom" />
<HiAcademicCap className="ring-person person-center" />

          </div>

        </div>

        {/* CTA Content */}
        <div className="cta-left">

          <h2>
            Start learning today <br />
            with your circle
          </h2>

          <p>
            Join circles, ask doubts, participate in challenges,
            and grow together with mentors and contributors.
          </p>

          <Link to="/signup" className="cta-btn">
            Join CircleUp
          </Link>

        </div>

      </div>

    </section>
  );
};

export default CTA;