import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/Auth.css";

const ResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(password !== confirmPassword){
      setMessage("Passwords do not match");
      return;
    }

    try{

      const res = await api.put(
        `/auth/reset-password/${token}`,
        { newPassword: password }
      );

      setMessage(res.data.message);

      setTimeout(()=>{
        navigate("/login");
      },2000);

    }catch(err){

      setMessage(
        err.response?.data?.message ||
        "Reset failed"
      );

    }

  };

  return(

    <div className="auth-container">

      <div className="auth-card">

        <h2>Reset Password</h2>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="auth-field">

            <label>New Password</label>

            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required placeholder="enter new password"
            />

          </div>

          <div className="auth-field">

            <label>Confirm Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required placeholder="enter new password"
            />

          </div>

          <button className="auth-btn">
            Reset Password
          </button>

        </form>

        {message && (
          <p className="auth-error">{message}</p>
        )}

      </div>

    </div>

  );

};

export default ResetPassword;