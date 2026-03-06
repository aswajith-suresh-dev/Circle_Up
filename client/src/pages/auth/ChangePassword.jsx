import { useState } from "react";
import api from "../../api/axios";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await api.put(
        "/auth/change-password",
        { currentPassword, newPassword }
      );

      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) =>
          setCurrentPassword(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(e.target.value)
        }
      />

      <button onClick={handleSubmit}>
        Change Password
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;