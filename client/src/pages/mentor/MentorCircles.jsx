import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const MentorCircles = () => {

  const [circles, setCircles] = useState([]);
  const navigate = useNavigate();

  const fetchCircles = async () => {
    try {
      const res = await api.get("/circles/mentor");
      setCircles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCircles();
  }, []);

  const deleteCircle = async (id) => {
    if (!window.confirm("Delete this circle?")) return;

    try {
      await api.delete(`/circles/${id}`);
      fetchCircles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Created Circles</h2>

      {/* EMPTY STATE */}
      {circles.length === 0 && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#6b7280" }}>
            You haven't created any circles yet.
          </p>

          <button
            onClick={() => navigate("/create-circle")}
            style={createButton}
          >
            Create Circle
          </button>
        </div>
      )}

      {/* CIRCLES LIST */}
      {circles.map((circle) => (
        <div key={circle._id} style={card}>
          <h3>{circle.name}</h3>

          <p>{circle.description}</p>

          <p>
            Topic: <strong>{circle.topic}</strong>
          </p>

          <p>
            Level: <strong>{circle.level}</strong>
          </p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            
            <button
              onClick={() => navigate(`/edit-circle/${circle._id}`)}
              style={editButton}
            >
              Edit
            </button>

            <button
              onClick={() => deleteCircle(circle._id)}
              style={deleteButton}
            >
              Delete
            </button>

          </div>
        </div>
      ))}
    </div>
  );
};

const card = {
  border: "1px solid #ddd",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
};

const deleteButton = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
};

const editButton = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
};

const createButton = {
  marginTop: "10px",
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  background: "#10b981",
  color: "white",
  cursor: "pointer",
};

export default MentorCircles;