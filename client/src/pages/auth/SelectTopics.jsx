import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../css/SelectTopics.css";
import reactIcon from "../../assets/topic-icons/react.svg";
import nodeIcon from "../../assets/topic-icons/node.svg";
import jsIcon from "../../assets/topic-icons/javascript.svg";
import pythonIcon from "../../assets/topic-icons/python.svg";
import mongoIcon from "../../assets/topic-icons/mongodb.svg";
import dsaIcon from "../../assets/topic-icons/dsa.svg";
const TOPICS = [
  { name: "React", image: reactIcon },
  { name: "Node", image: nodeIcon },
  { name: "JavaScript", image: jsIcon },
  { name: "Python", image: pythonIcon },
  { name: "MongoDB", image: mongoIcon },
  { name: "DSA", image: dsaIcon }
];
const SelectTopics = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
    const { user, updateUser } = useAuth();


  const toggleTopic = (topic) => {
    if (selected.includes(topic)) {
      setSelected(selected.filter((t) => t !== topic));
    } else {
      setSelected([...selected, topic]);
    }
  };


const handleSubmit = async () => {
  try {
    await api.post("/auth/onboarding", {
      topics: selected,
    });

    updateUser({
      ...user,
      topics: selected,
    });

    navigate("/suggested-circles");

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="topics-page">

      <div className="topics-container">

        <p className="topics-step">Step 1 of 2</p>

        <h2>Select your interests</h2>

        <p className="topics-subtitle">
          Choose topics to personalize your learning feed.
        </p>
<div className="topics-grid">

  {TOPICS.map((topic) => (
    <div
      key={topic.name}
      onClick={() => toggleTopic(topic.name)}
      className={`topic-card ${
        selected.includes(topic.name) ? "active" : ""
      }`}
    >

      <img src={topic.image} alt={topic.name} className="topic-avatar" />

      <span>{topic.name}</span>

      {selected.includes(topic.name) && (
        <div className="checkmark">✓</div>
      )}

    </div>
  ))}

</div>

        <p className="topics-count">
          {selected.length} topics selected
        </p>

        <button
          className="topics-btn"
          onClick={handleSubmit}
          disabled={selected.length === 0}
        >
          Continue
        </button>

      </div>

    </div>
  );
};

export default SelectTopics;