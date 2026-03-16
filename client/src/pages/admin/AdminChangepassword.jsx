import { useState } from "react";
import api from "../../api/axios";
import "../../css/AdminChangePassword.css";

const AdminChangePassword = () => {

  const [currentPassword,setCurrentPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [showCurrent,setShowCurrent] = useState(false);
  const [showNew,setShowNew] = useState(false);
  const [showConfirm,setShowConfirm] = useState(false);

  const [message,setMessage] = useState("");
  const [error,setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if(newPassword !== confirmPassword){
      setError("Passwords do not match");
      return;
    }

    try{

      const res = await api.put("/auth/change-password",{
        currentPassword,
        newPassword,
        confirmPassword
      });

      setMessage(res.data.message || "Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    }catch(err){

      setError(
        err.response?.data?.message || "Failed to change password"
      );

    }

  };


  return(

    <div className="admin-change-password-page">

      <h2 className="admin-change-password-title">
        Change Password
      </h2>

      <form
        className="admin-change-password-card"
        onSubmit={handleSubmit}
      >

        {/* CURRENT PASSWORD */}

        <label>Current Password</label>

        <div className="admin-password-field">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e)=>setCurrentPassword(e.target.value)}
            required
          />

          <span
            className="admin-password-toggle"
            onClick={()=>setShowCurrent(!showCurrent)}
          >
            {showCurrent ? "🙈" : "👁️"}
          </span>
        </div>


        {/* NEW PASSWORD */}

        <label>New Password</label>

        <div className="admin-password-field">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            required
          />

          <span
            className="admin-password-toggle"
            onClick={()=>setShowNew(!showNew)}
          >
            {showNew ? "🙈" : "👁️"}
          </span>
        </div>


        {/* CONFIRM PASSWORD */}

        <label>Confirm Password</label>

        <div className="admin-password-field">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
          />

          <span
            className="admin-password-toggle"
            onClick={()=>setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>


        <button type="submit">
          Update Password
        </button>

        {message && (
          <p className="admin-password-success">
            {message}
          </p>
        )}

        {error && (
          <p className="admin-password-error">
            {error}
          </p>
        )}

      </form>

    </div>

  );

};

export default AdminChangePassword;