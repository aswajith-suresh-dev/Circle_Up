import { useState } from "react";
import api from "../../api/axios";

const ChangePassword = () => {

  const [currentPassword,setCurrentPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleSubmit = async () => {

    if(newPassword !== confirmPassword){
      setMessage("New passwords do not match");
      return;
    }

    try{

      const res = await api.put("/auth/change-password", {
  currentPassword,
  newPassword,
  confirmPassword
});

      setMessage(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    }catch(err){

      setMessage(
        err.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  return (

    <div style={{padding:"20px",maxWidth:"400px"}}>

      <h2>Change Password</h2>

      <input
      type="password"
      placeholder="Current Password"
      value={currentPassword}
      onChange={(e)=>setCurrentPassword(e.target.value)}
      style={input}
      />

      <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e)=>setNewPassword(e.target.value)}
      style={input}
      />

      <input
      type="password"
      placeholder="Confirm New Password"
      value={confirmPassword}
      onChange={(e)=>setConfirmPassword(e.target.value)}
      style={input}
      />

      <button
      onClick={handleSubmit}
      style={button}
      >
      Change Password
      </button>

      {message && (
        <p style={{marginTop:"10px"}}>
          {message}
        </p>
      )}

    </div>

  );

};

const input = {
  width:"100%",
  padding:"8px",
  marginBottom:"10px",
  border:"1px solid #ccc",
  borderRadius:"6px"
};

const button = {
  padding:"8px 16px",
  background:"#3b82f6",
  color:"white",
  border:"none",
  borderRadius:"6px",
  cursor:"pointer"
};

export default ChangePassword;