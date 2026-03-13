// src/pages/mentor/MentorChallenges.jsx

import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import "../../css/MentorChallenges.css";

const MentorChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  const fetchChallenges = async () => {
    try {
      const res = await api.get("/mentor/challenges");

      setChallenges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleDelete = async (challengeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this challenge?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/mentor/challenges/${challengeId}`);

      fetchChallenges();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mentor-challenges-page">
      <h2 className="mentor-challenges-title">My Challenges</h2>

      {challenges.length === 0 && (
        <p className="no-challenges">No challenges created</p>
      )}

      {challenges.map((challenge) => (
        <div key={challenge._id} className="challenge-card">
          <div className="challenge-header">
            <h3>{challenge.title}</h3>

            <span
              className={`challenge-type ${
                challenge.type === "free" ? "free" : "paid"
              }`}
            >
              {challenge.type === "free" ? "FREE" : "PAID"}
            </span>
          </div>

          <p className="challenge-info">{challenge.totalDays} Days</p>

          <p className="challenge-info">
            Participants: {challenge.participantsCount || 0}
          </p>

          <p className="challenge-info">Earnings: ₹{challenge.revenue || 0}</p>

          <p className="challenge-status">Status: {challenge.approvalStatus}</p>

          <div className="challenge-actions">
            <button
              className="btn-edit"
              onClick={() => navigate(`/edit-challenge/${challenge._id}`)}
            >
              Edit
            </button>

            <button
              className="btn-delete"
              onClick={() => handleDelete(challenge._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MentorChallenges;
