import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const MyCircles = () => {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCircles = async () => {
      try {
        const res = await api.get("/circles/my");
        setCircles(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCircles();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading your circles...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <h2>My Circles</h2>

      {circles.length === 0 ? (
        <p>You haven’t joined any circles yet.</p>
      ) : (
        circles.map((circle) => (
          <div
            key={circle._id}
            onClick={() => navigate(`/circles/${circle._id}`)}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#fafafa",
            }}
          >
            <h3>{circle.name}</h3>

            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              {circle.description}
            </p>

            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              📚 {circle.topic} · 📊 {circle.level}
            </p>

            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              👨‍🏫 Mentor: {circle.mentor?.name}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyCircles;