import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/RightSidebar.css";

const RightSidebar = () => {
  const [circles, setCircles] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH DATA ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const [circlesRes, challengesRes] = await Promise.all([
        api.get("/circles/top"),
        api.get("/challenges/popular"),
      ]);

      setCircles(circlesRes.data || []);
      setChallenges(challengesRes.data || []);
    } catch (err) {
      console.error("Sidebar fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= NAVIGATION ================= */

  const handleChallengeClick = (ch) => {
    console.log("Clicked challenge:", ch);

    if (!ch?._id) {
      console.warn("Invalid challenge ID");
      return;
    }

    navigate(`/challenges/${ch._id}`);
  };

  const handleCircleClick = (circle) => {
    if (!circle?._id) return;
    navigate(`/circles/${circle._id}`);
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="right-sidebar">Loading...</div>;
  }

  return (
    <div className="right-sidebar">

      <div className="right-title">Explore</div>

      {/* ================= TOP CIRCLES ================= */}
      <div className="right-card">
        <h4>🔥 Top Circles</h4>

        {circles.length === 0 ? (
          <p className="empty-text">No circles found</p>
        ) : (
          circles.slice(0, 3).map((circle) => (
            <div
              key={circle._id}
              className="right-card-item"
              onClick={() => handleCircleClick(circle)}
            >
              <div className="item-content">
                <span className="item-title">{circle.name}</span>
                <span className="item-meta">
                  {circle.membersCount || circle.members?.length || 0} members
                </span>
              </div>
            </div>
          ))
        )}

        <div
          className="right-card-footer"
          onClick={() => navigate("/search")}
        >
          Discover Circles →
        </div>
      </div>

      {/* ================= POPULAR CHALLENGES ================= */}
      <div className="right-card">
        <h4>🏆 Popular Challenges</h4>

        {challenges.length === 0 ? (
          <p className="empty-text">No challenges found</p>
        ) : (
          challenges.slice(0, 3).map((ch) => (
            <div
              key={ch._id}
              className="right-card-item"
              onClick={() => handleChallengeClick(ch)}
            >
              <div className="item-content">
                <span className="item-title">{ch.title}</span>
                <span className="item-meta">
                  {ch.participantsCount || 0} joined
                </span>
              </div>
            </div>
          ))
        )}

        <div
          className="right-card-footer"
          onClick={() => navigate("/challenges")}
        >
          Explore challenges →
        </div>
      </div>

    </div>
  );
};

export default RightSidebar;