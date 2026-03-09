import { useState } from "react";
import api from "../../api/axios";
import "../../css/Auth.css";

const ForgotPassword = () => {

  const [email,setEmail] = useState("");
  const [message,setMessage] = useState("");
  const [resetLink,setResetLink] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{

      const res = await api.post("/auth/forgot-password",{ email });

      setMessage(res.data.message);
      setResetLink(res.data.resetURL);

    }catch(err){

      setMessage(
        err.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  return(

    <div className="auth-container">

      <div className="auth-card">

        <h2>Forgot Password</h2>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="auth-field">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

          </div>

          <button className="auth-btn">
            Send Reset Link
          </button>

        </form>

        {message && (
          <p className="auth-error">{message}</p>
        )}

        {resetLink && (
          <p className="auth-switch">
            <a href={resetLink} target="_blank">
              Open Reset Page
            </a>
          </p>
        )}

      </div>

    </div>

  );

};

export default ForgotPassword;