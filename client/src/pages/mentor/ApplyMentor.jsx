import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

import "../../css/ApplyMentor.css";

const ApplyMentor = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [bio,setBio] = useState("");
  const [expertise,setExpertise] = useState("");
  const [portfolioLink,setPortfolioLink] = useState("");

  const [eligible,setEligible] = useState(null);
  const [status,setStatus] = useState("none");

  const [message,setMessage] = useState("");

  /* restrict page */

  useEffect(()=>{

    if(!user) return;

    if(user.role === "mentor"){
      setStatus("approved");
    }

    if(user.role !== "contributor" && user.role !== "mentor"){
      navigate("/");
    }

  },[user]);

  /* check eligibility */

  const checkEligibility = async () => {

    try{

      const res = await api.get("/mentor/check-eligibility");

      setEligible(res.data.eligible);
      setStatus(res.data.status || "none");

    }catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{

    if(user){
      checkEligibility();
    }

  },[user]);

  /* submit application */
const handleSubmit = async () => {

try{

await api.post("/mentor/apply",{
bio,
expertise,
portfolioLink
});

navigate("/mentor-status");

}catch(err){

setMessage(
err.response?.data?.message || "Error submitting application"
);

}

};

  if(eligible === null){

    return (
      <div className="mentor-loading">
        Checking eligibility...
      </div>
    );

  }

  return(

  <div className="mentor-apply-page">

    <div className="mentor-apply-card">

      <h2>Apply for Mentor</h2>

      {/* NOT ELIGIBLE */}

      {!eligible && status === "none" && (

        <div className="mentor-status">

          <p className="mentor-error">
            ❌ You do not meet the mentor eligibility criteria yet.
          </p>

        </div>

      )}

      {/* APPLICATION FORM */}

      {eligible && status === "none" && (

        <>

          <textarea
            rows="4"
            placeholder="Write your bio..."
            value={bio}
            onChange={(e)=>setBio(e.target.value)}
            className="mentor-input"
          />

          <input
            type="text"
            placeholder="Your expertise"
            value={expertise}
            onChange={(e)=>setExpertise(e.target.value)}
            className="mentor-input"
          />

          <input
            type="text"
            placeholder="Portfolio link (optional)"
            value={portfolioLink}
            onChange={(e)=>setPortfolioLink(e.target.value)}
            className="mentor-input"
          />

          <button
            onClick={handleSubmit}
            className="mentor-submit-btn"
          >
            Submit Application
          </button>

        </>

      )}

      {/* PENDING */}

      {status === "pending" && (

        <div className="mentor-status">

          <h3>Application Submitted</h3>

          <p>
            Your mentor request is currently waiting for admin approval.
          </p>

        </div>

      )}

      {/* APPROVED */}

      {status === "approved" && (

        <div className="mentor-status">

          <h3>🎉 You are now a Mentor</h3>

          <p>
            Your application has been approved. You can now create circles and challenges.
          </p>

          <button
            className="mentor-submit-btn"
            onClick={()=>navigate("/mentor/dashboard")}
          >
            Go to Dashboard
          </button>

        </div>

      )}

      {message && (
        <p className="mentor-message">{message}</p>
      )}

    </div>

  </div>

  );

};

export default ApplyMentor;