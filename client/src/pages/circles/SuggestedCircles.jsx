import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
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
      fetchSuggestions(); // 🔥 refetch after join
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Suggested Circles</h2>

      {circles.length === 0 && <p>No suggestions available.</p>}

      {circles.map((circle) => (
        <div
          key={circle._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <h4>{circle.name}</h4>

          <button
            disabled={circle.isMember}
            onClick={() => handleJoin(circle._id)}
          >
            {circle.isMember ? "Joined" : "Join"}
          </button>
        </div>
      ))}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
  <button
    onClick={() => navigate("/")}
    style={{
      padding: "10px 20px",
      background: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Continue to Home
  </button>
</div>
    </div>
  );
};

export default SuggestedCircles;