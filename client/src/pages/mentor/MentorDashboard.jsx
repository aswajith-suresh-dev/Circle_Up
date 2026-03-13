// src/pages/mentor/MentorDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { FiPlus, FiEdit2, FiUsers, FiTarget } from "react-icons/fi";

import "../../css/MentorDashboard.css";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/mentor/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}

      <div className="dashboard-header">
        <h1>Welcome back{user?.name ? `, ${user.name}` : ""} 👋</h1>

        <p>Manage your circles, challenges and revenue</p>
      </div>

      {/* ================= CIRCLES ================= */}

      <div className="dashboard-section-title">My Circles</div>

      <div className="dashboard-circles-row">
        {/* IMAGE */}

        <div className="dashboard-circle-preview">
          <img src="https://picsum.photos/600/400" alt="preview" />
        </div>

        {/* CIRCLES */}

        <div className="dashboard-circle-container">
          <div className="dashboard-icons">
            <FiPlus onClick={() => navigate("/create-circle")} />
            <FiEdit2 onClick={() => navigate("/mentor/circles")} />
          </div>

          <div className="dashboard-circle-list">
            {data.circles.slice(0, 3).map((circle) => (
              <div
                key={circle._id}
                className="dashboard-circle-card"
                onClick={() => navigate(`/circles/${circle._id}`)}
              >
                <div className="dashboard-circle-header">
                  <div className="dashboard-circle-icon">
                    <FiUsers />
                  </div>

                  <h4>{circle.name}</h4>
                </div>

                <span className="dashboard-circle-level">{circle.level}</span>

                <p className="dashboard-circle-description">
                  {circle.description}
                </p>
              </div>
            ))}
          </div>

          <div
            className="dashboard-view-link"
            onClick={() => navigate("/mentor/circles")}
          >
            View all circles →
          </div>
        </div>
      </div>

      {/* ================= CHALLENGES ================= */}

      <div className="dashboard-section-title">My Challenges</div>

      <div className="dashboard-bottom-row">
        {/* CHALLENGES */}

        <div className="dashboard-challenge-container">
          <div className="dashboard-icons">
            <FiPlus onClick={() => navigate("/mentor/create-challenge")} />
            <FiEdit2 onClick={() => navigate("/mentor/challenges")} />
          </div>
          <div className="dashboard-challenge-grid">
            {data.challenges.slice(0, 3).map((challenge) => (

<div
  key={challenge._id}
  className="dashboard-challenge-card"
  onClick={() => navigate(`/edit-challenge/${challenge._id}`)}
>

  <div className="dashboard-challenge-header">

    <div className="dashboard-challenge-icon">
      <FiTarget />
    </div>

    <h4>{challenge.title}</h4>

  </div>

  <p className="dashboard-challenge-description">
    {challenge.description}
  </p>

</div>

))}
          </div>
          <div
            className="dashboard-view-link"
            onClick={() => navigate("/mentor/challenges")}
          >
            View all challenges →
          </div>
        </div>

        {/* ================= REVENUE ================= */}

        <div className="dashboard-revenue-container">
          <h3>Revenue</h3>

          <div className="dashboard-revenue-grid">
            <div className="dashboard-revenue-card">
              <span>Total Sales</span>
              <h2>{data.totalSales}</h2>
            </div>

            <div className="dashboard-revenue-card">
              <span>Total Income</span>
              <h2>₹{data.revenue}</h2>
            </div>

            <div className="dashboard-revenue-card">
              <span>This Month</span>
              <h2>₹{data.monthRevenue || 0}</h2>
            </div>

            <div className="dashboard-revenue-card">
              <span>Avg Sale</span>
              <h2>₹{data.avgSale || 0}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
