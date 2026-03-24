import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import LandingNavbar from "../../components/landing/LandingNavbar";
import Footer from "../../components/landing/Footer";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../../css/Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  /* PASSWORD VALIDATION */

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    setError(
      "Password must be at least 8 characters and include uppercase, lowercase, number and symbol."
    );
    return;
  }

  try {
    const res = await api.post("/auth/signup", {
      name,
      email,
      password,
    });

    login(res.data.user, res.data.token);

    if (!res.data.user.topics || res.data.user.topics.length === 0) {
      navigate("/select-topics");
    } else {
      navigate("/");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Signup failed");
  }
};

  return (
    <>
      <LandingNavbar />

      <div className="auth-container">

        <div className="auth-card">

          <h2>Create your account</h2>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="auth-field">
              <label>Name</label>
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
<div className="auth-field">
  <label>Password</label>

  <div className="password-wrapper">

    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <span
      className="password-toggle"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FiEyeOff /> : <FiEye />}
    </span>

  </div>

  <small className="password-hint">
    Password must contain uppercase, lowercase, number and symbol
  </small>

</div>

            <button type="submit" className="auth-btn">
              Sign Up
            </button>
<p className="auth-switch">
  Already have an account?
  <Link to="/login">Login</Link>
</p>
          </form>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Signup;