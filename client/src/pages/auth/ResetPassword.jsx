import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

import "../../css/Auth.css";

const ResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    /* PASSWORD VALIDATION */

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number and symbol."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      const res = await api.put(
        `/auth/reset-password/${token}`,
        { newPassword: password }
      );

      setSuccess(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Reset failed"
      );

    }

  };



  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>Reset Password</h2>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* NEW PASSWORD */}

          <div className="auth-field">

            <label>New Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />

              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>

            </div>

            <small className="password-hint">
              Password must contain uppercase, lowercase, number and symbol (min 8 characters)
            </small>

          </div>



          {/* CONFIRM PASSWORD */}

          <div className="auth-field">

            <label>Confirm Password</label>

            <div className="password-wrapper">

              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />

              <span
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </span>

            </div>

          </div>


          <button className="auth-btn">
            Reset Password
          </button>

        </form>

        {/* ERROR MESSAGE */}

        {error && (
          <p className="auth-error">{error}</p>
        )}

        {/* SUCCESS MESSAGE */}

        {success && (
          <p className="auth-success">{success}</p>
        )}

      </div>

    </div>

  );

};

export default ResetPassword;