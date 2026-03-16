import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiAward,
  FiCircle,
  FiAlertCircle,
  FiMessageSquare,
  FiDollarSign,
  FiClipboard,
  FiUser,
  FiLogOut
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  return (

    <div className="admin-sidebar">

      <h2 className="admin-logo">Admin</h2>

      <nav className="admin-nav">

        {/* DASHBOARD */}

        <NavLink to="/admin">
          <FiGrid /> Dashboard
        </NavLink>

        {/* MANAGEMENT */}

        <NavLink to="/admin/users">
          <FiUsers /> Users
        </NavLink>

        <NavLink to="/admin/mentors">
          <FiAward /> Mentors
        </NavLink>

        <NavLink to="/admin/circles">
          <FiCircle /> Circles
        </NavLink>

        <NavLink to="/admin/challenges">
          <FiAward /> Challenges
        </NavLink>

        {/* REQUESTS */}

        <NavLink to="/admin/mentor-requests">
          <FiClipboard /> Mentor Applications
        </NavLink>

        <NavLink to="/admin/complaints">
          <FiAlertCircle /> Complaints
        </NavLink>

        <NavLink to="/admin/feedback">
          <FiMessageSquare /> Feedback
        </NavLink>

        {/* FINANCE */}

        <NavLink to="/admin/revenue">
          <FiDollarSign /> Revenue
        </NavLink>

      </nav>


      {/* BOTTOM SECTION */}

      <div className="admin-sidebar-bottom">
{/* 
        <NavLink to="/profile">
          <FiUser /> Profile
        </NavLink>

        <button
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          <FiLogOut /> Logout
        </button> */}
        <NavLink to="/admin/profile">
  <FiUser /> Profile
</NavLink>

      </div>

    </div>

  );

};

export default AdminSidebar;