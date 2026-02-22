// src/pages/challenges/ChallengeDays.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const ChallengeDays = () => {
  const { challengeId } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [progress, setProgress] = useState(null);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const fetchProgress = async () => {
    try {
      const res = await api.get(
        `/challenges/${challengeId}/progress`
      );

      setChallenge(res.data.challenge);
      setProgress(res.data.progress);
      setCanCheckIn(res.data.canCheckIn);
      setIsCompleted(res.data.isCompleted);

      setSelectedDay(res.data.progress.currentDay);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [challengeId]);

  const handleCheckIn = async () => {
    try {
      await api.post(`/challenges/${challengeId}/checkin`);
      await fetchProgress();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  if (!challenge || !progress) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>{challenge.title}</h2>

      {/* Current Day / Completion Status */}
      {isCompleted ? (
        <p style={{ fontWeight: "bold" }}>
          All {challenge.totalDays} days completed
        </p>
      ) : (
        <p>
          Current Day: {progress.currentDay} /{" "}
          {challenge.totalDays}
        </p>
      )}

      {/* Streak */}
      <p>🔥 Streak: {progress.streak}</p>

      {progress.isBroken && !isCompleted && (
        <p style={{ color: "red" }}>
          ⚠️ Streak Broken
        </p>
      )}

      {/* Completion Box */}
      {isCompleted && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            background: "#dcfce7",
            borderRadius: "8px",
            border: "1px solid #86efac"
          }}
        >
          <h3>🎉 Challenge Completed!</h3>
          <p>🔥 Final Streak: {progress.streak}</p>
        </div>
      )}

      {/* Day Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "20px",
          marginBottom: "16px",
          flexWrap: "wrap"
        }}
      >
        {challenge.days.map((day) => {
          const isCompletedDay =
            progress.completedDays.includes(day.dayNumber);

          const isLocked =
            isCompleted ||
            day.dayNumber > progress.currentDay;

          return (
            <button
              key={day.dayNumber}
              disabled={isLocked}
              onClick={() =>
                setSelectedDay(day.dayNumber)
              }
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: isCompletedDay
                  ? "#dcfce7"
                  : "#f3f4f6",
                cursor: isLocked
                  ? "not-allowed"
                  : "pointer",
                opacity: isLocked ? 0.6 : 1
              }}
            >
              Day {day.dayNumber}
              {isCompletedDay && " ✔"}
              {isLocked && !isCompletedDay && " 🔒"}
            </button>
          );
        })}
      </div>

      {/* Day Content */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "16px",
          borderRadius: "6px",
          background: "#fafafa"
        }}
      >
        <h3>Day {selectedDay}</h3>

        <p>
          {
            challenge.days.find(
              (d) =>
                d.dayNumber === selectedDay
            )?.content
          }
        </p>

        {/* Check-in Button */}
        {selectedDay === progress.currentDay &&
          canCheckIn &&
          !isCompleted && (
            <button
              onClick={handleCheckIn}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "#3b82f6",
                color: "white",
                cursor: "pointer"
              }}
            >
              Mark Today as Done ✔
            </button>
          )}

        {!canCheckIn &&
          selectedDay === progress.currentDay &&
          !isCompleted && (
            <p
              style={{
                marginTop: "10px",
                color: "gray"
              }}
            >
              You’ve already checked in today
            </p>
          )}
      </div>
    </div>
  );
};

export default ChallengeDays;