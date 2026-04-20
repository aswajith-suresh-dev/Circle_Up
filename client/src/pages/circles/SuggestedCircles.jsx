import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../css/SuggestedCircles.css";

const SuggestedCircles = () => {
  const [circles, setCircles] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/circles/suggestions");
      setCircles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleJoin = async (circleId) => {
    try {
      await api.post(`/circles/${circleId}/join`);
      fetchSuggestions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="suggested-page">
      <div className="suggested-container">
        <p className="step">Step 2 of 2</p>

        <h2>Suggested Circles</h2>

        <p className="subtitle">
          Join circles related to your interests to start learning together.
        </p>

        {circles.length === 0 && (
          <p className="no-circles">No suggestions available.</p>
        )}

        <div className="circles-grid">
          {circles.map((circle) => (
            <div key={circle._id} className="circle-card">

  <div className="circle-avatar">
    {circle.name.charAt(0).toUpperCase()}
  </div>

  <h4 className="circle-name">{circle.name}</h4>

  <button
    disabled={circle.isMember}
    onClick={() => handleJoin(circle._id)}
    className={`join-btn ${circle.isMember ? "joined" : ""}`}
  >
    {circle.isMember ? "Joined" : "Join"}
  </button>

</div>
          ))}
        </div>

        <div className="continue-wrapper">
          <button className="continue-btn" onClick={() => navigate("/home")}>
            Continue to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedCircles;
