import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiX } from "react-icons/fi";
import "../../css/Profile.css";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const [mentorStatus, setMentorStatus] = useState("none");
  const [eligible, setEligible] = useState(false);

  const [approvedBannerClosed, setApprovedBannerClosed] = useState(
    localStorage.getItem("mentorApprovedBannerClosed") === "true",
  );
  const [rejectedBannerClosed, setRejectedBannerClosed] = useState(
    localStorage.getItem("mentorRejectedBannerClosed") === "true",
  );
  const { logout, updateUser } = useAuth();
  const navigate = useNavigate();

  /* FETCH PROFILE */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");

        setData(res.data);

        setName(res.data.user.name || "");
        setDescription(res.data.user.description || "");

        updateUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  /* FETCH MENTOR STATUS */

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/mentor/application-status");

        setMentorStatus(res.data.status || "none");
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
  }, []);

  /* CHECK ELIGIBILITY */

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const res = await api.get("/mentor/check-eligibility");

        setEligible(res.data.eligible);
      } catch (err) {
        console.error(err);
      }
    };

    checkEligibility();
  }, []);

  if (!data) return <p>Loading...</p>;

  const { user, stats } = data;

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await api.put("/auth/profile", formData);

      const updatedUser = res.data.user;

      setData((prev) => ({
        ...prev,
        user: updatedUser,
      }));

      updateUser(updatedUser);

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

  const closeApprovedBanner = () => {
    localStorage.setItem("mentorApprovedBannerClosed", "true");
    setApprovedBannerClosed(true);
  };

  const closeRejectedBanner = () => {
    localStorage.setItem("mentorRejectedBannerClosed", "true");
    setRejectedBannerClosed(true);
  };
  return (
    <div className="profile-page">
      {/* Banner */}

      <div className="profile-banner"></div>

      {/* Profile Card */}

      <div className="profile-card">
        {!isEditing && (
          <div className="edit-icon" onClick={() => setIsEditing(true)}>
            <FiEdit2 />
          </div>
        )}

        <img
          className="profile-avatar"
          src={
            user.photo
              ? `http://localhost:5000${user.photo}`
              : "https://via.placeholder.com/150"
          }
          alt="profile"
        />

        {!isEditing ? (
          <>
            <h2>{user.name}</h2>

            <p className="profile-role">{user.role}</p>

            <p className="profile-desc">
              {user.description || "Add a profile description"}
            </p>
          </>
        ) : (
          <div className="edit-section">
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />

            <div className="edit-buttons">
              <button onClick={handleSave}>Save</button>

              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* APPLY MENTOR BANNER */}

      {user.role === "contributor" && mentorStatus === "none" && eligible && (
        <div className="profile-mentor-banner">
          <div>
            <h3>Become a Mentor</h3>
            <p>Share knowledge by creating circles and challenges 🎉</p>
          </div>

          <button onClick={() => navigate("/apply-mentor")}>Apply</button>
        </div>
      )}

      {/* PENDING BANNER */}

      {user.role === "contributor" && mentorStatus === "pending" && (
        <div className="profile-mentor-banner">
          <div>
            <h3>Mentor Application Pending</h3>
            <p>Waiting for admin approval</p>
          </div>

          <button onClick={() => navigate("/mentor-status")}>
            View Status
          </button>
        </div>
      )}
      {/* REJECTED BANNER */}

      {user.role === "contributor" &&
        mentorStatus === "rejected" &&
        !rejectedBannerClosed && (
          <div className="profile-mentor-banner rejected-banner">
            <FiX
              className="mentor-banner-close"
              onClick={closeRejectedBanner}
            />

            <div>
              <h3>Mentor Application Rejected</h3>
              <p>Your application was not approved.</p>
            </div>

            <button onClick={() => navigate("/mentor-status")}>
              View Status
            </button>
          </div>
        )}

      {/* APPROVED BANNER */}

      {user.role === "mentor" && !approvedBannerClosed && (
        <div className="profile-mentor-banner">
          <FiX className="mentor-banner-close" onClick={closeApprovedBanner} />

          <div>
            <h3>🎉 You are now a Mentor</h3>
            <p>Manage circles and challenges from your dashboard</p>
          </div>

          <button onClick={() => navigate("/mentor")}>Open Dashboard</button>
        </div>
      )}

      {/* TABS */}

      <div className="profile-tabs">
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </button>

        <button
          className={activeTab === "reputation" ? "active" : ""}
          onClick={() => setActiveTab("reputation")}
        >
          Reputation
        </button>

        <button
          className={activeTab === "account" ? "active" : ""}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>

        <button
          className={activeTab === "support" ? "active" : ""}
          onClick={() => setActiveTab("support")}
        >
          Support
        </button>
      </div>

      {/* CONTENT */}

      <div className="profile-content">
        {activeTab === "stats" && (
          <div className="stats-grid">
            <div className="stat-card">
              <span>{stats.circlesJoined}</span>
              <p>Circles Joined</p>
            </div>

            <div className="stat-card">
              <span>{stats.postsCreated}</span>
              <p>Posts Created</p>
            </div>

            <div className="stat-card">
              <span>{stats.challengesJoined}</span>
              <p>Challenges Joined</p>
            </div>
          </div>
        )}

        {activeTab === "reputation" && (
          <div className="stats-grid">
            <div className="stat-card">
              <span>{user.replyUpvotesCount}</span>
              <p>Reply Upvotes</p>
            </div>

            <div className="stat-card">
              <span>{user.solvedRepliesCount}</span>
              <p>Solutions Given</p>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="account-buttons">
            <button onClick={() => navigate("/change-password")}>
              Change Password
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        {activeTab === "support" && (
          <div className="account-buttons">
            <button onClick={() => navigate("/complaint")}>Complaint</button>

            <button onClick={() => navigate("/feedback")}>Feedback</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
