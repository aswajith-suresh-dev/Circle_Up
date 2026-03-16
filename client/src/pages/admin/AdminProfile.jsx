import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../css/AdminProfile.css";

const AdminProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await api.put("/auth/profile", {
        name,
        email,
      });

      updateUser(res.data.user);

      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="admin-profile-page">
      <h2 className="admin-profile-title">Admin Profile</h2>

      <div className="admin-profile-card">
        {/* NAME */}

        <div className="admin-profile-field">
          <label>Name</label>

          {editing ? (
            <input value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <p>{user.name}</p>
          )}
        </div>

        {/* EMAIL */}

        <div className="admin-profile-field">
          <label>Email</label>

          {editing ? (
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          ) : (
            <p>{user.email}</p>
          )}
        </div>

        {/* ACTION BUTTONS */}

        <div className="admin-profile-actions">
          {!editing ? (
            <button
              className="admin-profile-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              className="admin-profile-btn save"
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </button>
          )}

          <button
            className="admin-profile-btn password"
            onClick={() => navigate("/admin/change-password")}
          >
            Change Password
          </button>

          <button className="admin-profile-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
