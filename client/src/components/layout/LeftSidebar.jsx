// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FiHome,
//   FiSearch,
//   FiUsers,
//   FiAward,
//   FiBell,
//   FiUser,
//   FiFolder,
//   FiBarChart2,
// } from "react-icons/fi";
// import { BsPin } from "react-icons/bs";
// import "../../css/LeftSidebar.css";
// import { useAuth } from "../../context/AuthContext";
// import { useMemo } from "react";

// const LeftSidebar = () => {
//   const [collapsed, setCollapsed] = useState(true);
//   const [pinned, setPinned] = useState(false);
//   const [hovering, setHovering] = useState(false);
//   const location = useLocation();
//   const { user } = useAuth();

//   const photoUrl = useMemo(() => {
//     if (!user?.photo) return "/profile.png";
//     return `https://circle-up-sfx3.onrender.com${user.photo}`;
//   }, [user?.photo]);
//   const handleMouseEnter = () => {
//     setHovering(true);
//     if (!pinned) setCollapsed(false);
//   };

//   const handleMouseLeave = () => {
//     setHovering(false);
//     if (!pinned) setCollapsed(true);
//   };

//   const togglePin = () => {
//     const newPinned = !pinned;
//     setPinned(newPinned);
//     setCollapsed(!newPinned ? true : false);
//   };

//   const isActive = (path) => location.pathname === path;
//   console.log(user);
//   return (
//     <div
//       className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       {/* Pin Icon (shows only when hovering) */}
//       {(hovering || pinned) && (
//         <div className="sidebar-pin" onClick={togglePin}>
//           <BsPin className={pinned ? "pinned" : ""} size={16} />
//         </div>
//       )}

//       {/* Top Section */}
//       <div>
//         {/* Profile */}
//         {/* CircleUp Logo */}
// {/* Logo Only */}
// <div className="sidebar-logo-box">
//   <img
//     src="/logo.png"
//     className="sidebar-logo-img"
//     alt="CircleUp"
//   />
// </div>

//         {/* Navigation */}
//         <nav className="sidebar-nav">
//           <Link
//             to="/"
//             className={`sidebar-link ${isActive("/") ? "active" : ""}`}
//           >
//             <FiHome />
//             {!collapsed && <span>Home</span>}
//           </Link>

//           <Link
//             to="/search"
//             className={`sidebar-link ${isActive("/search") ? "active" : ""}`}
//           >
//             <FiSearch />
//             {!collapsed && <span>Search</span>}
//           </Link>
//           {user?.role === "mentor" && (
//             <Link
//               to="/mentor"
//               className={`sidebar-link ${isActive("/mentor") ? "active" : ""}`}
//             >
//               <FiBarChart2 />
//               {!collapsed && <span>Dashboard</span>}
//             </Link>
//           )}
//           <Link
//             to="/my-circles"
//             className={`sidebar-link ${isActive("/my-circles") ? "active" : ""}`}
//           >
//             <FiUsers />
//             {!collapsed && <span>My Circles</span>}
//           </Link>

//           <Link
//             to="/challenges"
//             className={`sidebar-link ${isActive("/challenges") ? "active" : ""}`}
//           >
//             <FiAward />
//             {!collapsed && <span>Challenges</span>}
//           </Link>

//           <Link
//             to="/notifications"
//             className={`sidebar-link ${isActive("/notifications") ? "active" : ""}`}
//           >
//             <FiBell />
//             {!collapsed && <span>Notifications</span>}
//           </Link>

//           <Link
//             to="/profile"
//             className={`sidebar-link ${isActive("/profile") ? "active" : ""}`}
//           >
//             <FiUser />
//             {!collapsed && <span>Profile</span>}
//           </Link>

//           <Link
//             to="/personal"
//             className={`sidebar-link ${isActive("/personal") ? "active" : ""}`}
//           >
//             <FiFolder />
//             {!collapsed && <span>Personal Space</span>}
//           </Link>
//         </nav>
//       </div>

//       {/* Bottom Logo */}
//       {/* <div className="sidebar-logo">{collapsed ? "CU" : "CircleUp"}</div> */}
//     </div>
//   );
// };

// export default LeftSidebar;

import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiUsers,
  FiAward,
  FiBell,
  FiUser,
  FiFolder,
  FiBarChart2,
} from "react-icons/fi";
import { BsPin } from "react-icons/bs";
import "../../css/LeftSidebar.css";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const LeftSidebar = () => {

  const [collapsed, setCollapsed] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0); // 🔥 NEW

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  /* PROFILE IMAGE */

  const photoUrl = useMemo(() => {
    if (!user?.photo) return "/profile.png";
    return `https://circle-up-sfx3.onrender.com${user.photo}`;
  }, [user?.photo]);

  /* FETCH NOTIFICATIONS */

useEffect(() => {

  const fetchNotifications = async () => {
    try {

      const res = await api.get("/notifications");

      const unread = res.data.filter(n => !n.isRead).length;

      setUnreadCount(unread);

    } catch (err) {
      console.error(err);
    }
  };

  fetchNotifications();

  const interval = setInterval(fetchNotifications, 5000);

  return () => clearInterval(interval);

}, []);

  /* SIDEBAR BEHAVIOUR */

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

  return (

    <div
      className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* PIN ICON */}

      {(hovering || pinned) && (
        <div className="sidebar-pin" onClick={togglePin}>
          <BsPin className={pinned ? "pinned" : ""} size={16} />
        </div>
      )}

      {/* TOP SECTION */}

      <div>

        {/* LOGO */}

        <div className="sidebar-logo-box">
          <img
            src="/logo.png"
            className="sidebar-logo-img"
            alt="CircleUp"
          />
        </div>

        {/* NAVIGATION */}

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

          {user?.role === "mentor" && (
            <Link
              to="/mentor"
              className={`sidebar-link ${isActive("/mentor") ? "active" : ""}`}
            >
              <FiBarChart2 />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          )}

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

          {/* 🔥 NOTIFICATIONS WITH BADGE */}
<Link
  to="/notifications"
  className={`sidebar-link ${isActive("/notifications") ? "active" : ""}`}
>
  <div className="notif-icon-container">
    <FiBell className="notif-icon" />

    {unreadCount > 0 && (
      <div className="notif-badge">
        {unreadCount}
      </div>
    )}
  </div>

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

    </div>
  );
};

export default LeftSidebar;