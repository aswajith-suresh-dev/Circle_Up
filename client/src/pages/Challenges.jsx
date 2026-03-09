import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
      await fetchData();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handlePurchase = async (challengeId) => {
    try {
      await api.post(`/challenges/${challengeId}/purchase`);
      await fetchData();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  // ✅ SAFE JOIN CHECK (fix for null error)
  const isJoined = (challengeId) => {
    return myProgress.find(
      (p) =>
        p?.challenge &&
        p.challenge._id === challengeId
    );
  };

  // ✅ SAFE CIRCLE CHECK
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
    <div style={{ padding: "20px", maxWidth: "750px" }}>
      <h2>Challenges</h2>

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setFilter("all")}
          style={filterButton(filter === "all")}
        >
          All
        </button>

        <button
          onClick={() => setFilter("my")}
          style={filterButton(filter === "my")}
        >
          My Challenges
        </button>
      </div>

      {filteredChallenges.length === 0 && (
        <p>No challenges found</p>
      )}

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
            style={cardStyle}
          >
            {/* TITLE + PRICE BADGE */}
            <div style={titleRow}>
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
                  : `₹${challenge.price}`}
              </span>
            </div>

            {/* META INFO */}
            <p style={metaText}>
Level: {challenge.level}
</p>

<p style={metaText}>
👥 {challenge.participants || 0} participants
</p>

<p style={metaText}>
Circle: {challenge.circle?.name || "N/A"}
</p>

<p style={metaText}>
👨‍🏫 Mentor: <strong>{challenge.mentor?.name || "Unknown"}</strong>
</p>            {/* PROGRESS BAR */}
            {progress && (
              <div style={{ marginTop: "10px" }}>
                <div style={progressBarBg}>
                  <div
                    style={{
                      ...progressBarFill,
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>
                <p style={{ fontSize: "12px" }}>
                  {progress.completedDays.length} /{" "}
                  {challenge.totalDays} days completed
                </p>
              </div>
            )}

            {/* BUTTON LOGIC */}

            {/* FREE JOIN */}
            {!progress &&
              filter === "all" &&
              circleMember &&
              challenge.type === "free" && (
                <button
                  onClick={() =>
                    handleJoin(challenge._id)
                  }
                  style={buttonStyle("#3b82f6")}
                >
                  Join Challenge
                </button>
              )}

            {/* PAID PURCHASE */}
            {!progress &&
              filter === "all" &&
              circleMember &&
              challenge.type === "paid" && (
                <button
                 onClick={() => navigate(`/payment/${challenge._id}`)}
                >
                  Purchase ₹{challenge.price}
                </button>
              )}

            {/* NOT CIRCLE MEMBER */}
            {!circleMember && !progress && (
              <p style={noteStyle}>
                *You must join the circle first.
              </p>
            )}

            {/* CONTINUE */}
            {progress && !isCompleted && (
              <button
                onClick={() =>
                  navigate(
                    `/challenges/${challenge._id}`
                  )
                }
                style={buttonStyle("#10b981")}
              >
                Continue
              </button>
            )}

            {/* COMPLETED */}
            {isCompleted && (
              <button
                onClick={() =>
                  navigate(
                    `/challenges/${challenge._id}`
                  )
                }
                style={buttonStyle("#16a34a")}
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

/* -------- STYLES -------- */

const cardStyle = {
  border: "1px solid #ddd",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "10px",
  background: "#fafafa",
};

const titleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const metaText = {
  color: "#6b7280",
  fontSize: "14px",
};

const progressBarBg = {
  height: "8px",
  background: "#e5e7eb",
  borderRadius: "4px",
};

const progressBarFill = {
  height: "8px",
  background: "#3b82f6",
  borderRadius: "4px",
};

const buttonStyle = (bg) => ({
  marginTop: "10px",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  background: bg,
  color: "white",
  cursor: "pointer",
});

const filterButton = (active) => ({
  marginRight: "10px",
  background: active ? "#3b82f6" : "#e5e7eb",
  color: active ? "white" : "black",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
});

const noteStyle = {
  fontSize: "12px",
  marginTop: "8px",
  color: "#6b7280",
};

export default Challenges;