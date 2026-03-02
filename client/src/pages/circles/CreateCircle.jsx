// src/pages/circles/CreateCircle.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreateCircle = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");

  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !topic) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/circles", {
        name,
        description,
        topic,
        level,
      });

      // After success → go to circle page
      navigate(`/circles/${res.data._id}`);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create circle"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h2>Create New Circle</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <input
          type="text"
          placeholder="Circle Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={inputStyle}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          style={{
            ...inputStyle,
            height: "80px",
          }}
        />

        {/* Topic */}
        <input
          type="text"
          placeholder="Topic (e.g. React, DSA)"
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
          style={inputStyle}
        />

        {/* Level */}
        <select
          value={level}
          onChange={(e) =>
            setLevel(e.target.value)
          }
          style={inputStyle}
        >
          <option value="beginner">
            Beginner
          </option>
          <option value="intermediate">
            Intermediate
          </option>
          <option value="advanced">
            Advanced
          </option>
        </select>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading
            ? "Creating..."
            : "Create Circle"}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
};

export default CreateCircle;