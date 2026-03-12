// src/pages/challenges/ChallengeDays.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "../../css/ChallengeDays.css";
import { FiCheckCircle, FiLock, FiBookOpen } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

const ChallengeDays = () => {
  const { challengeId } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [progress, setProgress] = useState(null);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const fetchProgress = async () => {
    try {
      const res = await api.get(`/challenges/${challengeId}/progress`);

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

  const completionPercent = Math.floor(
    (progress.completedDays.length / challenge.totalDays) * 100,
  );

  const currentDayData = challenge.days.find(
    (d) => d.dayNumber === selectedDay,
  );

  return (
    <div className="challenge-page">
      <div className="challenge-header">
        <h2 className="challenge-title">{challenge.title}</h2>

        <div className="challenge-meta">
          {isCompleted ? (
            <p className="challenge-status success">
              ✔ All {challenge.totalDays} days completed
            </p>
          ) : (
            <>
            <p className="challenge-status">
              Completed {progress.completedDays.length} of {challenge.totalDays}{" "}
              days
            </p>
            
            </>
          )}

          {/* <p className="challenge-streak">🔥 {progress.streak} day streak</p> */}
        </div>

        {progress.isBroken && !isCompleted && (
          <p className="streak-warning">
            ⚠️ Your streak is broken. Keep going!
          </p>
        )}
      </div>
      <div className="streak-card">
        <div className="streak-header">
          <span className="streak-fire">🔥</span>

          <div>
            <p className="streak-label">STREAK</p>
            <h2>{progress.streak} DAYS</h2>
          </div>
        </div>

        <div className="streak-days">
          {challenge.days.slice(0, 7).map((day) => {
            const completed = progress.completedDays.includes(day.dayNumber);

            return (
              <div
                key={day.dayNumber}
                className={`streak-circle ${completed ? "done" : ""}`}
              >
                {completed ? "✔" : ""}
              </div>
            );
          })}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="progress-card">
        <div className="progress-top">
          <div className="progress-info">
            <p className="progress-label">Progress</p>
            <p className="progress-days">
              {progress.completedDays.length} / {challenge.totalDays} days
            </p>
          </div>

          <div className="progress-percent">{completionPercent}%</div>
        </div>

        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Completion Summary */}

      {isCompleted && (
        <div className="completion-card">
          <h3>
            <HiOutlineSparkles /> Challenge Completed
          </h3>

          <p>
            🔥 Final Streak: <strong>{progress.streak}</strong>
          </p>

          <p>
            📊 Completion Rate: <strong>{completionPercent}%</strong>
          </p>
        </div>
      )}

      {/* Day Tabs */}

      <div className="day-tabs">
        {challenge.days.map((day) => {
          const isCompletedDay = progress.completedDays.includes(day.dayNumber);

          const isLocked = isCompleted || day.dayNumber > progress.currentDay;

          return (
            <button
              key={day.dayNumber}
              disabled={isLocked}
              onClick={() => setSelectedDay(day.dayNumber)}
              className={`day-button 
        ${isCompletedDay ? "done" : ""}
        ${isLocked ? "locked" : ""}`}
            >
              Day {day.dayNumber}
              {isCompletedDay && <FiCheckCircle />}
              {isLocked && !isCompletedDay && <FiLock />}
            </button>
          );
        })}
      </div>

      {/* Day Content */}

      <div className="day-content">
        <h3>Day {selectedDay}</h3>

        <p className="day-text">{currentDayData?.content}</p>

        {/* Study Materials */}

        {challenge.type === "paid" && currentDayData?.resources?.length > 0 && (
          <div className="study-materials">
            <h4>
              <FiBookOpen /> Study Materials
            </h4>

            {currentDayData.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="resource-link"
              >
                {resource.title}
              </a>
            ))}
          </div>
        )}

        {/* Check-in Button */}

        {selectedDay === progress.currentDay && canCheckIn && !isCompleted && (
          <button onClick={handleCheckIn} className="checkin-button">
            <FiCheckCircle />
            Mark Today as Done
          </button>
        )}

        {!canCheckIn && selectedDay === progress.currentDay && !isCompleted && (
          <p className="checkin-info">You’ve already checked in today</p>
        )}
      </div>
    </div>
  );
};

export default ChallengeDays;
