import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const ApplyMentor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  const [eligible, setEligible] = useState(false);
  const [message, setMessage] = useState("");

  // 🔒 Only contributors can access
  useEffect(() => {
    if (!user || user.role !== "contributor") {
      navigate("/");
    }
  }, [user, navigate]);

  // 🔍 Check eligibility from backend
  const checkEligibility = async () => {
    try {
      const res = await api.get("/mentor/check-eligibility");
      setEligible(res.data.eligible);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkEligibility();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await api.post("/mentor/apply", {
        bio,
        expertise,
        portfolioLink,
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error submitting"
      );
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Apply for Mentor</h2>

      {!eligible ? (
        <p>
          ❌ You do not meet the mentor eligibility criteria yet.
        </p>
      ) : (
        <>
          <textarea
            rows="4"
            placeholder="Write your bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <input
            type="text"
            placeholder="Your expertise..."
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <input
            type="text"
            placeholder="Portfolio link (optional)"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <button onClick={handleSubmit}>
            Submit Application
          </button>
        </>
      )}

      {message && (
        <p style={{ marginTop: "10px" }}>{message}</p>
      )}
    </div>
  );
};

export default ApplyMentor;