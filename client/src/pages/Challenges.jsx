// src/pages/Challenges.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Challenges = () => {
  const [allChallenges, setAllChallenges] = useState([]);
  const [myProgress, setMyProgress] = useState([]);
  const [myCircles, setMyCircles] = useState([]);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRes = await api.get("/challenges/all");
        const myRes = await api.get("/challenges/my");
        const circlesRes = await api.get("/circles/my");

        setAllChallenges(allRes.data);
        setMyProgress(myRes.data);
        setMyCircles(circlesRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleJoin = async (challengeId) => {
    try {
      await api.post(`/challenges/${challengeId}/join`);
      const myRes = await api.get("/challenges/my");
      setMyProgress(myRes.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const isJoined = (challengeId) => {
    return myProgress.find(
      (p) => p.challenge._id === challengeId
    );
  };

  const isCircleMember = (circleId) => {
    return myCircles.find(
      (circle) => circle._id === circleId
    );
  };

  const filteredChallenges =
    filter === "all"
      ? allChallenges
      : myProgress.map((p) => p.challenge);

  return (
    <div style={{ padding: "20px", maxWidth: "750px" }}>
      <h2>Challenges</h2>

      {/* Filter */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            marginRight: "10px",
            background:
              filter === "all" ? "#3b82f6" : "#e5e7eb",
            color: filter === "all" ? "white" : "black",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
          }}
        >
          All
        </button>

        <button
          onClick={() => setFilter("my")}
          style={{
            background:
              filter === "my" ? "#3b82f6" : "#e5e7eb",
            color: filter === "my" ? "white" : "black",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
          }}
        >
          My Challenges
        </button>
      </div>

      {filteredChallenges.map((challenge) => {
        const progress = isJoined(challenge._id);
        const isCompleted =
          progress &&
          progress.completedDays.length >=
            challenge.totalDays;

        const circleMember = isCircleMember(
          challenge.circle?._id || challenge.circle
        );

        const progressPercent = progress
          ? Math.floor(
              (progress.completedDays.length /
                challenge.totalDays) *
                100
            )
          : 0;

        return (
          <div
            key={challenge._id}
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "10px",
              background: "#fafafa",
            }}
          >
            {/* Title + Badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>{challenge.title}</h3>

              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  background:
                    challenge.type === "free"
                      ? "#dcfce7"
                      : "#fde68a",
                  color:
                    challenge.type === "free"
                      ? "#065f46"
                      : "#92400e",
                }}
              >
                {challenge.type === "free"
                  ? "Free"
                  : "Paid"}
              </span>
            </div>

            <p style={{ color: "#6b7280", marginBottom: "4px" }}>
  Circle: {challenge.circle?.name}
</p>
<p style={{ color: "#6b7280", fontSize: "14px" }}>
  👨‍🏫 Mentor: <strong>{challenge.mentor?.name}</strong>
</p>

            <p>{challenge.description}</p>
            <p>Total Days: {challenge.totalDays}</p>

            {/* Progress Bar */}
            {progress && (
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    height: "8px",
                    background: "#e5e7eb",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: "8px",
                      background: "#3b82f6",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>
                  {progress.completedDays.length} /{" "}
                  {challenge.totalDays} days completed
                </p>
              </div>
            )}

            {/* Buttons */}
            {!progress && filter === "all" && (
              <>
                <button
                  onClick={() =>
                    handleJoin(challenge._id)
                  }
                  disabled={!circleMember}
                  style={{
                    marginTop: "10px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: circleMember
                      ? "#3b82f6"
                      : "#9ca3af",
                    color: "white",
                    cursor: circleMember
                      ? "pointer"
                      : "not-allowed",
                  }}
                >
                  Join Challenge
                </button>

                {!circleMember && (
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "4px",
                      color: "#6b7280",
                    }}
                  >
                    *To join this challenge, you must join the circle first.
                  </p>
                )}
              </>
            )}

            {progress && !isCompleted && (
              <button
                onClick={() =>
                  navigate(
                    `/challenges/${challenge._id}`
                  )
                }
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#10b981",
                  color: "white",
                }}
              >
                Continue
              </button>
            )}

            {isCompleted && (
              <button
                onClick={() =>
                  navigate(
                    `/challenges/${challenge._id}`
                  )
                }
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#dcfce7",
                  color: "#065f46",
                }}
              >
                Completed ✔
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Challenges;