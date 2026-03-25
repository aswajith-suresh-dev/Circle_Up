// src/pages/circles/CircleDetail.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/CircleDetail.css";
import { formatDistanceToNow } from "date-fns";
import {
  FiGlobe,
  FiBarChart2,
  FiUser,
  FiUserPlus,
  FiMessageSquare,
  FiLink,
  FiUsers,
  FiBookOpen,
} from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const CircleDetail = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const [snackbar, setSnackbar] = useState("");
  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discussion");

  // Fetch circle
  const fetchCircle = async () => {
    try {
      const res = await api.get(`/circles/${circleId}`);

      setCircle(res.data);
      setIsMember(res.data.isMember);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts/circle/${circleId}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch challenges
  const fetchChallenges = async () => {
    try {
      const res = await api.get(`/challenges/circle/${circleId}`);
      setChallenges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load
  useEffect(() => {
    const load = async () => {
      await fetchCircle();
      setLoading(false);
    };
    load();
  }, [circleId]);

  // Load content if member
  useEffect(() => {
    if (isMember) {
      fetchPosts();
      fetchChallenges();
    }
  }, [isMember]);

  // Join circle
  const handleJoin = async () => {
    try {
      await api.post(`/circles/${circleId}/join`);
      await fetchCircle();
    } catch (err) {
      console.error(err);
    }
  };
  const handleLeave = async () => {
    const confirmLeave = window.confirm("Are you sure you want to leave?");
    if (!confirmLeave) return;

    try {
      await api.put(`/circles/${circleId}/leave`);
      await fetchCircle();
    } catch (err) {
      console.error(err);
    }
  };
  // Like post
  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/posts/like/${postId}`);

      const updatedPost = res.data;

      setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));

      const liked = updatedPost.likes.some(
        (id) => id.toString() === userId.toString(),
      );

      setSnackbar(liked ? "Liked the discussion ❤️" : "Like removed");

      setTimeout(() => {
        setSnackbar("");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        console.log(err.response.data.message);
      } else {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="circle-page-wrapper">Loading...</div>;
  if (!circle)
    return <div className="circle-page-wrapper">Circle not found</div>;

  return (
    <div className="circle-page-wrapper">
      <div className="circle-container">
        {/* Banner */}

        <div className="circle-banner">
          <div className="banner-content">
            <div className="circle-icon-large">
              <FiMessageSquare color="white" size={26} />
            </div>

            <div className="banner-info">
              <h1>{circle.name}</h1>

              <div className="banner-stats">
                <div className="banner-stat">
                  <FiGlobe />
                  <span>Public</span>
                </div>

                <div className="banner-stat">
                  <FiUsers />
                  <span>{circle.members?.length} members</span>
                </div>

                <div className="banner-stat">
                  <FiBookOpen />
                  <span>{circle.topic}</span>
                </div>

                <div className="banner-stat">
                  <FiUser />
                  <span>{circle.mentor?.name}</span>
                </div>
              </div>
            </div>
          </div>
          {/* LEAVE BUTTON (top right) */}
          {isMember && userId !== circle.mentor?._id && (
            <div
              className="leave-circle-btn"
              onClick={handleLeave}
              title="Leave Circle"
            >
              <FiLogOut />
            </div>
          )}
          {!isMember && (
            <button className="join-btn" onClick={handleJoin}>
              <FiUserPlus /> Join Circle
            </button>
          )}
        </div>

        {/* Tabs */}

        <div className="tabs-nav">
          <div
            className={`tab-item ${activeTab === "discussion" ? "active" : ""}`}
            onClick={() => setActiveTab("discussion")}
          >
            Discussion
          </div>

          <div
            className={`tab-item ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </div>

          <div
            className={`tab-item ${activeTab === "challenges" ? "active" : ""}`}
            onClick={() => setActiveTab("challenges")}
          >
            Challenges
          </div>
        </div>

        <div className="main-content-grid">
          {/* LEFT SIDEBAR */}
          <aside className="about-card">
            <h3>About this space</h3>

            <p>{circle.description}</p>

            {/* PUBLIC */}

            <div className="info-row">
              <div className="info-icon">
                <FiGlobe />
              </div>

              <div className="info-text">
                <div className="info-title">Public space</div>
                <div className="info-desc">Everyone can see posts</div>
              </div>
            </div>

            {/* LEVEL */}

            <div className="info-row">
              <div className="info-icon">
                <FiBarChart2 />
              </div>

              <div className="info-text">
                <div className="info-title">Level</div>
                <div className="info-desc">{circle.level}</div>
              </div>
            </div>

            {/* MENTOR */}

            <div className="info-row">
              <div className="info-icon">
                <FiUser />
              </div>

              <div className="info-text">
                <div className="info-title">Mentor</div>
                <div className="info-desc">{circle.mentor?.name}</div>
              </div>
            </div>
          </aside>

          {/* RIGHT FEED */}

          <main className="feed-container">
            {!isMember ? (
              <div className="post-card center">
                <h3>🔒 Members Only</h3>

                <p>Join this circle to participate.</p>

                <button className="join-btn" onClick={handleJoin}>
                  Join to Unlock
                </button>
              </div>
            ) : (
              <>
                {/* Discussion */}

                {activeTab === "discussion" && (
                  <>
                    <div
                      className="create-post-box"
                      onClick={() =>
                        navigate(`/circles/${circleId}/create-post`)
                      }
                    >
                      <div className="create-post-avatar">
                        {user?.photo ? (
                          <img
                            src={`http://localhost:5000${user.photo}`}
                            alt="avatar"
                          />
                        ) : (
                          <span>{user?.name?.charAt(0)}</span>
                        )}
                      </div>

                      <div className="create-post-input">
                        Ask something to the community...
                      </div>
                    </div>

                    {posts.length === 0 ? (
                      <p>No posts yet.</p>
                    ) : (
                      posts.map((post) => (
                        <div key={post._id} className="post-card">
                          {/* POST HEADER */}
                          <div className="post-header">
                            <div
                              className={`post-avatar
  ${
    post.author?._id === circle.mentor?._id
      ? "circle-mentor-avatar"
      : post.author?.role === "mentor"
        ? "mentor-avatar"
        : post.author?.role === "contributor"
          ? "contributor-avatar"
          : ""
  }
  `}
                            >
                              {post.author?.photo ? (
                                <img
                                  src={`http://localhost:5000${post.author.photo}`}
                                  alt="avatar"
                                  className="avatar-img"
                                />
                              ) : (
                                <span className="avatar-letter">
                                  {post.author?.name?.charAt(0)}
                                </span>
                              )}
                            </div>

                            <div className="post-meta">
                              <div className="post-author">
                                {post.author?.name}
                                <span className="post-time">
                                  •{" "}
                                  {formatDistanceToNow(
                                    new Date(post.createdAt),
                                    { addSuffix: true },
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* TYPE BADGE */}
                          <div className={`post-type-badge ${post.type}`}>
                            {post.type === "doubt" ? "Doubt" : "Discussion"}
                          </div>
                          {/* TITLE */}
                          <h4 className="post-title">{post.title}</h4>
                          {/* DESCRIPTION */}
                          <p className="post-description">{post.description}</p>
                          {/* IMAGE */}
                          {post.images && post.images.length > 0 && (
                            <div className="post-images">
                              <img
                                src={`http://localhost:5000${post.images[0]}`}
                                alt="post"
                                className="post-image"
                              />
                            </div>
                          )}
                          {/* LINKS */}
                          {post.links?.map((link, i) => (
                            <a
                              key={i}
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="post-link"
                            >
                              <FiLink className="link-icon" />
                              <span>Link {i + 1}</span>
                            </a>
                          ))}
                          {/* ACTIONS */}
                          <div className="post-actions">
                            {post.type === "discussion" && (
                              <button
                                className={`like-btn ${
                                  post.likes?.some(
                                    (id) =>
                                      id?.toString() === userId?.toString(),
                                  )
                                    ? "liked"
                                    : ""
                                }`}
                                onClick={() => handleLike(post._id)}
                              >
                                <FaHeart className="action-icon" />
                                <span>{post.likes?.length || 0}</span>
                              </button>
                            )}

                            <button
                              className="reply-btn"
                              onClick={() => navigate(`/posts/${post._id}`)}
                            >
                              <FiMessageSquare className="action-icon" />
                              <span>Reply</span>
                            </button>
                          </div>{" "}
                        </div>
                      ))
                    )}
                  </>
                )}

                {/* Challenges */}

                {activeTab === "challenges" && (
                  <div>
                    <h3 className="challenge-title">Available Challenges</h3>

                    {challenges.length === 0 ? (
                      <p>No challenges yet.</p>
                    ) : (
                      challenges.map((ch) => (
                        <div key={ch._id} className="challenge-card">
                          <h4>{ch.title}</h4>

                          <p>{ch.description}</p>

                          <button onClick={() => navigate("/challenges")}>
                            View Details
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* About */}

                {activeTab === "about" && (
                  <div className="circle-details-card">
                    <h3 className="details-title">Full Circle Details</h3>

                    <p className="details-description">{circle.description}</p>

                    <div className="details-row">
                      <span className="details-label">Topic</span>
                      <span className="details-value">{circle.topic}</span>
                    </div>

                    <div className="details-row">
                      <span className="details-label">Difficulty</span>
                      <span className="details-value">{circle.level}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      {snackbar && <div className="snackbar">{snackbar}</div>}
    </div>
  );
};

export default CircleDetail;
