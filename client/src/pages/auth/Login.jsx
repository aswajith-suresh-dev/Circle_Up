import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import LandingNavbar from "../../components/landing/LandingNavbar";
import Footer from "../../components/landing/Footer";

import "../../css/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      login(user, token);

      navigate("/home", { replace: true });

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
                onChange={(e)=>setEmail(e.target.value)}
                required
                placeholder="Enter Email"
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required placeholder="Enter Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
<p className="auth-switch">
  Don't have an account? 
  <Link to="/signup">Sign Up</Link>
</p>
        </div>

      </div>

      <Footer />
    </>
  );
};

export default Login;