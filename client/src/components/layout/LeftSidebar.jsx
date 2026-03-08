import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiUsers,
  FiAward,
  FiBell,
  FiUser,
  FiFolder,
} from "react-icons/fi";
import { BsPin } from "react-icons/bs";
import "../../css/LeftSidebar.css";
import { useAuth } from "../../context/AuthContext";
import { useMemo } from "react";

const LeftSidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

const photoUrl = useMemo(() => {
  if (!user?.photo) return "/profile.png";
  return `http://localhost:5000${user.photo}`;
}, [user?.photo]);
  const handleMouseEnter = () => {
    setHovering(true);
    if (!pinned) setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (!pinned) setCollapsed(true);
  };

  const togglePin = () => {
    const newPinned = !pinned;
    setPinned(newPinned);
    setCollapsed(!newPinned ? true : false);
  };

  const isActive = (path) => location.pathname === path;
console.log(user);
  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Pin Icon (shows only when hovering) */}
      {(hovering || pinned) && (
  <div className="sidebar-pin" onClick={togglePin}>
    <BsPin className={pinned ? "pinned" : ""} size={16} />
  </div>
)}

      {/* Top Section */}
      <div>
        {/* Profile */}
        <div className="sidebar-profile">
  <img
  src={
    user?.photo
      ? `http://localhost:5000${user.photo}`
      : "/profile.png"
  }
  className="avatar"
  alt="profile"
/>

          <p className={`username ${collapsed ? "hidden" : ""}`}>
            {user?.name}
          </p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          <Link
            to="/"
            className={`sidebar-link ${isActive("/") ? "active" : ""}`}
          >
            <FiHome />
            {!collapsed && <span>Home</span>}
          </Link>

          <Link
            to="/search"
            className={`sidebar-link ${isActive("/search") ? "active" : ""}`}
          >
            <FiSearch />
            {!collapsed && <span>Search</span>}
          </Link>

          <Link
            to="/my-circles"
            className={`sidebar-link ${isActive("/my-circles") ? "active" : ""}`}
          >
            <FiUsers />
            {!collapsed && <span>My Circles</span>}
          </Link>

          <Link
            to="/challenges"
            className={`sidebar-link ${isActive("/challenges") ? "active" : ""}`}
          >
            <FiAward />
            {!collapsed && <span>Challenges</span>}
          </Link>

          <Link
            to="/notifications"
            className={`sidebar-link ${isActive("/notifications") ? "active" : ""}`}
          >
            <FiBell />
            {!collapsed && <span>Notifications</span>}
          </Link>

          <Link
            to="/profile"
            className={`sidebar-link ${isActive("/profile") ? "active" : ""}`}
          >
            <FiUser />
            {!collapsed && <span>Profile</span>}
          </Link>

          <Link
            to="/personal"
            className={`sidebar-link ${isActive("/personal") ? "active" : ""}`}
          >
            <FiFolder />
            {!collapsed && <span>Personal Space</span>}
          </Link>

        </nav>
      </div>

      {/* Bottom Logo */}
      <div className="sidebar-logo">
        {collapsed ? "CU" : "CircleUp"}
      </div>
    </div>
  );
};

export default LeftSidebar;