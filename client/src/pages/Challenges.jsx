import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  FiUsers,
  FiUser,
  FiBookOpen,
  FiBarChart2,
  FiTrendingUp,
  FiGrid,
  FiTarget
} from "react-icons/fi";

import "../css/Challenges.css";

const Challenges = () => {

  const [allChallenges, setAllChallenges] = useState([]);
  const [myProgress, setMyProgress] = useState([]);
  const [myCircles, setMyCircles] = useState([]);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {

      const allRes = await api.get("/challenges/all");
      const myRes = await api.get("/challenges/my");
      const circlesRes = await api.get("/circles/my");

      setAllChallenges(allRes.data || []);
      setMyProgress(myRes.data || []);
      setMyCircles(circlesRes.data || []);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoin = async (challengeId) => {

    try {

      await api.post(`/challenges/${challengeId}/join`);
      fetchData();

    } catch (err) {
      console.error(err);
    }

  };

  const isJoined = (challengeId) => {
    return myProgress.find(
      (p) =>
        p?.challenge &&
        p.challenge._id === challengeId
    );
  };

  const isCircleMember = (circleId) => {
    return myCircles.find(
      (circle) => circle?._id === circleId
    );
  };

  const filteredChallenges =
    filter === "all"
      ? allChallenges
      : myProgress
          .filter((p) => p?.challenge)
          .map((p) => p.challenge);

  return (

    <div className="challenges-page">
<h2 className="challenge-title">
 Challenges
</h2>

      {/* FILTER */}

      <div className="challenge-filter">

        <button
          className={filter === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("all")}
        >
          <FiGrid /> All
        </button>

        <button
          className={filter === "my" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("my")}
        >
          <FiTarget /> My Challenges
        </button>

      </div>

      {filteredChallenges.length === 0 && (
        <p className="empty-text">
          No challenges found
        </p>
      )}

      <div className="challenge-grid">

        {filteredChallenges.map((challenge) => {

          if (!challenge) return null;

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
              className="challenge-card"
            >

              {/* TITLE */}

              <div className="challenge-header">

                <h3>{challenge.title}</h3>

                <span
                  className={
                    challenge.type === "free"
                      ? "badge-free"
                      : "badge-paid"
                  }
                >
                  {challenge.type === "free"
                    ? "Free"
                    : `₹${challenge.price}`}
                </span>

              </div>

              {/* META */}

              <div className="challenge-meta">

                <p>
                  <FiBarChart2 />
                  {challenge.level}
                </p>

                <p>
                  <FiUsers />
                  {challenge.participants || 0} participants
                </p>

                <p>
                  <FiBookOpen />
                  {challenge.circle?.name || "N/A"}
                </p>

                <p>
                  <FiUser />
                  {challenge.mentor?.name || "Unknown"}
                </p>

              </div>

              {/* PROGRESS */}

              {progress && (

                <div className="challenge-progress">

                  <div className="progress-bg">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="progress-text">
                    {progress.completedDays.length} /
                    {challenge.totalDays} days
                  </p>

                </div>

              )}

              {/* BUTTONS */}

              {!progress &&
                filter === "all" &&
                circleMember &&
                challenge.type === "free" && (

                  <button
                    className="btn-join"
                    onClick={() =>
                      handleJoin(challenge._id)
                    }
                  >
                    Join Challenge
                  </button>

              )}

              {!progress &&
                filter === "all" &&
                circleMember &&
                challenge.type === "paid" && (

                  <button
                    className="btn-join"
                    onClick={() =>
                      navigate(`/payment/${challenge._id}`)
                    }
                  >
                    Purchase ₹{challenge.price}
                  </button>

              )}

              {!circleMember && !progress && (

                <p className="note">
                  Join the circle first
                </p>

              )}

              {progress && !isCompleted && (

                <button
                  className="btn-continue"
                  onClick={() =>
                    navigate(`/challenges/${challenge._id}`)
                  }
                >
                  Continue
                </button>

              )}

              {isCompleted && (

                <button
                  className="btn-completed"
                  onClick={() =>
                    navigate(`/challenges/${challenge._id}`)
                  }
                >
                  Completed ✔
                </button>

              )}

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default Challenges;