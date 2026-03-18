import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/RightSidebar.css";

const RightSidebar = () => {

  const [circles, setCircles] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const circlesRes = await api.get("/circles/top");
      const challengesRes = await api.get("/challenges/popular");

      setCircles(circlesRes.data);
      setChallenges(challengesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="right-sidebar">

      <div className="right-title">Explore</div>

      {/* Top Circles */}
      <div className="right-card">
        <h4>🔥 Top Circles</h4>

        {circles.slice(0, 3).map(circle => (
          <div
            key={circle._id}
            className="right-card-item"
            onClick={() => navigate(`/circles/${circle._id}`)}
          >
            <div className="item-content">
              <span className="item-title">{circle.name}</span>
              <span className="item-meta">
                {circle.membersCount || circle.members?.length || 0} members
              </span>
            </div>
          </div>
        ))}

        <div
          className="right-card-footer"
          onClick={() => navigate("/search")}
        >
          Discover Circles →
        </div>
      </div>

      {/* Popular Challenges */}
      <div className="right-card">
        <h4>🏆 Popular Challenges</h4>

        {challenges.slice(0, 3).map(ch => (
          <div
            key={ch._id}
            className="right-card-item"
            onClick={() => navigate(`/challenges/${ch._id}`)}
          >
            <div className="item-content">
              <span className="item-title">{ch.title}</span>
              <span className="item-meta">
                {ch.participantsCount || ch.participants?.length || 0} joined
              </span>
            </div>
          </div>
        ))}

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