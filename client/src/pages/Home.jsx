// src/pages/Home.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // 🔹 Fetch Feed
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get("/feed");
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeed();
  }, []);

  // 🔹 Toggle Like (Backend is source of truth)
  const handleLike = async (e, postId) => {
    e.stopPropagation(); // prevent card click

    try {
      const res = await api.put(`/posts/like/${postId}`);

      // Replace entire updated post
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? res.data : post
        )
      );
    } catch (err) {
      console.error(
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div style={{ padding: "16px", maxWidth: "700px" }}>
      <h2>Home Feed</h2>

      {posts.length === 0 && <p>No posts yet</p>}

      {posts.map((post) => (
        <div
          key={post._id}
          onClick={() => navigate(`/posts/${post._id}`)}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {/* 🔹 Title */}
          <h3>
            {post.title}{" "}
            {post.type === "doubt" &&
              post.isSolved && (
                <span
                  style={{
                    color: "green",
                    fontSize: "12px",
                  }}
                >
                  ✔ Solved
                </span>
              )}
          </h3>

          {/* 🔹 Meta */}
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            {post.type?.toUpperCase()} ·{" "}
            {post.circle?.name}
          </p>

          {/* 🔗 Links (Array Support) */}
          {post.links && post.links.length > 0 && (
            <div style={{ marginTop: "6px" }}>
              {post.links.map((link, index) => (
                <div key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      color: "#2563eb",
                      textDecoration: "underline",
                      fontSize: "14px",
                    }}
                  >
                    🔗 Visit Link {index + 1}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* 👍 Like (Discussion Only) */}
          {post.type === "discussion" && (
            <button
              onClick={(e) => handleLike(e, post._id)}
              style={{
                marginTop: "8px",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: post.likes?.some(
                  (id) =>
                    id.toString() === userId
                )
                  ? "#dbeafe"
                  : "#f3f4f6",
                cursor: "pointer",
              }}
            >
              👍 {post.likes?.length || 0}
            </button>
          )}

          {/* 🔹 Author */}
          <div style={{ marginTop: "6px" }}>
            <small>
              By {post.author?.name}
            </small>
          </div>
        </div>
      ))}

      {/* 🔹 Navigation */}
      <button
        onClick={() => navigate("/my-circles")}
        style={{
          marginTop: "20px",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "none",
          background: "#3b82f6",
          color: "white",
          cursor: "pointer",
        }}
      >
        My Circles
      </button>
    </div>
  );
};

export default Home;