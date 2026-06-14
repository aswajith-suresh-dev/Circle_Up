// src/pages/Home.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RightSidebar from "../components/layout/RightSidebar";
import TopBar from "../components/layout/TopBar";
import { formatDistanceToNow } from "date-fns";

import { FiMessageSquare, FiLink } from "react-icons/fi";

import { FaHeart } from "react-icons/fa";

import "../css/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("recent");

  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  /* FETCH FEED */

  const fetchFeed = async () => {
    try {
      const res = await api.get("/feed");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  /* LIKE POST */

  const handleLike = async (e, postId) => {
    e.stopPropagation();

    try {
      const res = await api.put(`/posts/like/${postId}`);

      const updatedPost = res.data;

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updatedPost : post)),
      );

      const liked = updatedPost.likes.some(
        (id) => id.toString() === userId.toString(),
      );

      setSnackbar(liked ? "Discussion liked ❤️" : "Like removed");

      setTimeout(() => {
        setSnackbar("");
      }, 2000);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  /* FILTER POSTS */

  const filteredPosts = posts.filter((post) => {
    if (filter === "recent") return true;

    if (filter === "discussion") {
      return post.type === "discussion";
    }

    if (filter === "doubt") {
      return post.type === "doubt";
    }

    return true;
  });

  return (
    <div className="home-layout">
      <div className="feed-container">
        <TopBar filter={filter} setFilter={setFilter} />

        {filteredPosts.length === 0 && <p>No posts found</p>}

        {filteredPosts.map((post) => (
          <div
            key={post._id}
            className="post-card"
            onClick={() => navigate(`/posts/${post._id}`)}
          >
            {/* POST HEADER */}

            <div className="post-header">
              {/* AVATAR WITH ROLE BORDER */}

              <div
                className={`post-avatar
                ${post.author?.role === "mentor" ? "mentor-avatar" : ""}
                ${
                  post.author?.role === "contributor"
                    ? "contributor-avatar"
                    : ""
                }`}
              >
                {post.author?.photo ? (
                  <img
                    src={`https://circle-up-sfx3.onrender.com${post.author.photo}`}
                    alt="avatar"
                    className="avatar-img"
                  />
                ) : (
                  <span>{post.author?.name?.charAt(0)}</span>
                )}
              </div>

              {/* AUTHOR INFO */}

              <div className="post-meta">
                <div className="post-author">
                  {post.author?.name}

                  <span className="circle-name">
                    {" > "} {post.circle?.name}
                  </span>

                  <span className="post-time">
                    •{" "}
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
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
                  src={`https://circle-up-sfx3.onrender.com${post.images[0]}`}
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
                onClick={(e) => e.stopPropagation()}
              >
                <FiLink className="link-icon" />

                <span>Link {i + 1}</span>
              </a>
            ))}

            {/* ACTIONS */}

            <div className="post-actions">
              {post.type === "discussion" && (
                <button
                  className={`like-btn
                  ${
                    post.likes?.some(
                      (id) => id?.toString() === userId?.toString(),
                    )
                      ? "liked"
                      : ""
                  }`}
                  onClick={(e) => handleLike(e, post._id)}
                >
                  <FaHeart className="action-icon" />

                  <span>{post.likes?.length || 0}</span>
                </button>
              )}

              <button
                className="reply-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  navigate(`/posts/${post._id}`);
                }}
              >
                <FiMessageSquare className="action-icon" />

                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <RightSidebar />

      {/* SNACKBAR */}

      {snackbar && <div className="snackbar">{snackbar}</div>}
    </div>
  );
};

export default Home;
