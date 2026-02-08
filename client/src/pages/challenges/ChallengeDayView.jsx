// src/pages/challenges/ChallengeList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await api.get("/challenges");
        setChallenges(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h2>Challenges</h2>

      {challenges.length === 0 && <p>No challenges yet</p>}

      {challenges.map((challenge) => (
        <div
          key={challenge._id}
          onClick={() => navigate(`/challenges/${challenge._id}`)}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "8px",
            cursor: "pointer",
          }}
        >
          <h3>{challenge.title}</h3>
          <p>{challenge.totalDays} days</p>
          <small>Mentor: {challenge.mentor?.name}</small>
        </div>
      ))}
    </div>
  );
};

export default ChallengeList;