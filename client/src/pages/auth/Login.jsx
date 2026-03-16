import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import LandingNavbar from "../../components/landing/LandingNavbar";
import Footer from "../../components/landing/Footer";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../../css/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
      );
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      const fullUser = await login(user, token);

      console.log("Logged in user:", fullUser);

      /* ADMIN REDIRECT FIRST */

      if (fullUser.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      /* NORMAL USERS */

      if (!fullUser.topics || fullUser.topics.length === 0) {
        navigate("/select-topics", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <LandingNavbar />

      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter Email"
              />
            </div>
            <div className="auth-field">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Password"
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
                (min 8 characters)
              </small>
            </div>

            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="auth-switch">
            Don't have an account?
            <Link to="/signup">Sign Up</Link>
          </p>
          <p style={{ marginTop: "10px", textAlign: "center" }}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
