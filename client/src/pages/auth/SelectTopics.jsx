import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TOPICS = [
  "react",
  "node",
  "javascript",
  "python",
  "mongodb",
  "dsa",
];

const SelectTopics = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  // ✅ MOVE HOOK INSIDE COMPONENT
  const { user, login } = useAuth();

  const toggleTopic = (topic) => {
    if (selected.includes(topic)) {
      setSelected(selected.filter((t) => t !== topic));
    } else {
      setSelected([...selected, topic]);
    }
  };

 const handleSubmit = async () => {
  try {
    const res = await api.post("/auth/onboarding", {
      topics: selected,
    });

    login(
      { ...user, topics: selected },
      localStorage.getItem("token")
    );

    navigate("/suggested-circles", {
      state: { circles: res.data.circles },
    });

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Your Interests</h2>

      {TOPICS.map((topic) => (
        <button
          key={topic}
          onClick={() => toggleTopic(topic)}
          style={{
            margin: "5px",
            padding: "8px 12px",
            background: selected.includes(topic)
              ? "#3b82f6"
              : "#e5e7eb",
            color: selected.includes(topic)
              ? "white"
              : "black",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {topic}
        </button>
      ))}

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectTopics;    