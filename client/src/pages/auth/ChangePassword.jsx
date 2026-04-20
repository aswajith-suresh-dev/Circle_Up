import { useState } from "react";
import api from "../../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setMessage("");
    setError("");

    /* PASSWORD REGEX VALIDATION */

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

      if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
  setError("All fields are required");
  return;
}
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number and symbol.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const res = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setMessage(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        logout(); // remove token and user

        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginBottom: "20px" }}>Change Password</h2>

        {error && <p style={errorStyle}>{error}</p>}
        {message && <p style={successStyle}>{message}</p>}

        {/* CURRENT PASSWORD */}

        <div style={fieldWrapper}>
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={input} required
          />

          <span style={eye} onClick={() => setShowCurrent(!showCurrent)}>
            {showCurrent ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* NEW PASSWORD */}

        <div style={fieldWrapper}>
          <input
            type={showNew ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={input} required
          />

          <span style={eye} onClick={() => setShowNew(!showNew)}>
            {showNew ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}

        <div style={fieldWrapper}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={input} required
          />

          <span style={eye} onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <small style={hint}>
          Password must contain uppercase, lowercase, number and symbol (min 8
          characters)
        </small>

        <button onClick={handleSubmit} style={button}>
          Update Password
        </button>
      </div>
    </div>
  );
};

/* STYLES */

const container = {
  display: "flex",
  justifyContent: "center",
  padding: "40px",
};

const card = {
  width: "420px",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};

const fieldWrapper = {
  position: "relative",
  marginBottom: "14px",
};

const input = {
  width: "100%",
  padding: "12px",
  paddingRight: "40px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
};

const eye = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  color: "#6b7280",
};

const hint = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "12px",
  display: "block",
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#373A7A",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  marginTop: "10px",
};

const errorStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "8px",
  borderRadius: "6px",
  marginBottom: "10px",
};

const successStyle = {
  background: "#ecfdf5",
  color: "#065f46",
  padding: "8px",
  borderRadius: "6px",
  marginBottom: "10px",
};

export default ChangePassword;
