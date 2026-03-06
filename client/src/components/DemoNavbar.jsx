import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DemoNavbar = () => {
  const { user } = useAuth();

  if (!user) return null;

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