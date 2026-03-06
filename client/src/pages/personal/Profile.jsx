import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import "../../css/Profile.css"
import { useAuth } from "../../context/AuthContext";
const Profile = () => {
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
const { logout } = useAuth();
  const navigate = useNavigate();

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setData(res.data);

        // ✅ Set initial editable values correctly
        setDescription(res.data.user.description || "");
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!data) return <p>Loading...</p>;

  const { user, stats } = data;

  // 🔹 Save profile changes
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("description", description);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setData((prev) => ({
        ...prev,
        user: res.data.user,
      }));

      setIsEditing(false);
      setPhotoFile(null);
    } catch (err) {
      console.error(err);
    }
  };
const handleLogout = () => {
  logout();
  navigate("/login");
};
  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>My Profile</h2>

      

      {/* Identity Section */}
      {/* Identity Card */}
<div
  style={{
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "30px",
    position: "relative",
  }}
>
  {/* Edit Icon */}
{/* Edit Icon */}
{!isEditing && (
  <div className="profile-edit-icon" onClick={() => setIsEditing(true)}>
    <FiEdit2 size={18} />
    <span className="profile-tooltip">Edit Profile</span>
  </div>
)}
  <div style={{ textAlign: "center" }}>
    <img
      src={
        user.photo
          ? `http://localhost:5000${user.photo}`
          : "https://via.placeholder.com/120"
      }
      alt="Profile"
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "10px",
      }}
    />

    <h3>{user.name}</h3>
    <p style={{ color: "#6b7280" }}>{user.role}</p>
    <p style={{ fontSize: "14px", color: "#6b7280" }}>
      Joined {new Date(user.createdAt).toLocaleDateString()}
    </p>
    <p>🔥 {user.activityStreak} day streak</p>
  </div>

  {/* Edit Mode */}
  {isEditing ? (
    <div style={{ marginTop: "15px" }}>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "8px",
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhotoFile(e.target.files[0])}
        style={{ marginBottom: "10px" }}
      />

      <div>
        <button
          onClick={handleSave}
          style={{ marginRight: "10px" }}
        >
          Save
        </button>

        <button onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div style={{ marginTop: "15px", textAlign: "center" }}>
      {user.description ? (
        <p>{user.description}</p>
      ) : (
        <p style={{ color: "gray" }}>
          Complete your profile to add description.
        </p>
      )}
    </div>
  )}
</div>
      {/* Stats Section */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Stats</h3>
        <p>Circles Joined: {stats.circlesJoined}</p>
        <p>Posts Created: {stats.postsCreated}</p>
        <p>Challenges Joined: {stats.challengesJoined}</p>
      </div>

      {/* Reputation Section */}
      <div>
        <h3>⭐ Reputation</h3>
        <p>Reply Upvotes: {user.replyUpvotesCount}</p>
        <p>Solutions Given: {user.solvedRepliesCount}</p>
      </div>
      {/* Account Section */}
<div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
  <h3>Account</h3>

  <button
    onClick={() => navigate("/change-password")}
    style={{
      padding: "8px 16px",
      cursor: "pointer",
    }}
  >
    Change Password
  </button>
</div>
<button
  onClick={handleLogout}
  style={{
    padding: "8px 16px",
    marginLeft: "10px",
    cursor: "pointer",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
  }}
>
  Logout
</button>
    </div>
  );
};

export default Profile;