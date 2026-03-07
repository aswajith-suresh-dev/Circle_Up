import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";
const DemoNavbar = () => {
  const { user } = useAuth();
const [count, setCount] = useState(0);
  if (!user) return null;
const fetchUnread = async () => {
  try {
    const res = await api.get("/notifications/unread-count");
    setCount(res.data.count);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchUnread();
}, []);
  return (
    <div
      style={{
        background: "#111827",
        padding: "10px",
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
      }}
    >
      {/* 🔹 Common User Links */}
      <Link style={linkStyle} to="/">Home</Link>
      <Link style={linkStyle} to="/search">Search</Link>
      <Link style={linkStyle} to="/my-circles">My Circles</Link>
      <Link style={linkStyle} to="/challenges">Challenges</Link>
      <Link style={linkStyle} to="/personal">Personal Space</Link>
      <Link style={linkStyle} to="/profile">Profile</Link>
      <Link style={linkStyle} to="/mentors">Mentors</Link>
      <Link style={linkStyle} to="/apply-mentor">Apply Mentor</Link>
      <Link style={linkStyle} to="/notifications">
  🔔 {count > 0 && `(${count})`}
</Link>

      {/* 🔹 User Support */}
      <Link style={linkStyle} to="/complaint">Submit Complaint</Link>
      <Link style={linkStyle} to="/feedback">Submit Feedback</Link>

      {/* 🔹 Admin Only */}
      {user.role === "admin" && (
        <>  

          <Link style={linkStyle} to="/admin">Admin Panel</Link>
          <Link to="/admin/mentor-requests">Mentor Requests</Link>
          <Link style={linkStyle} to="/admin/complaints">Admin Complaints</Link>
          <Link style={linkStyle} to="/admin/feedback">Admin Feedback</Link>
        </>
      )}
    </div>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
};

export default DemoNavbar;