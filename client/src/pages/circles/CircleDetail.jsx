// src/pages/circles/CircleDetail.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CircleDetail = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();

  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCircle = async () => {
    try {
      const res = await api.get(`/circles/${circleId}`);
      setCircle(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts/circle/${circleId}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCircle();
      await fetchPosts();
      setLoading(false);
    };

    loadData();
  }, [circleId]);

  const handleLike = async (postId) => {
    try {
      await api.put(`/posts/like/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const getPostTag = (post) => {
    return post.type === "doubt" ? "Doubt" : "Discussion";
  };

  if (loading) return <p>Loading circle...</p>;
  if (!circle) return <p>Circle not found</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "750px" }}>
      
      {/* 🔵 Circle Header */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "25px",
          background: "#fafafa",
        }}
      >
        <h2>{circle.name}</h2>
        <p>{circle.description}</p>

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          📚 Topic: {circle.topic}
        </p>

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          📊 Level: {circle.level}
        </p>

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          👨‍🏫 Mentor: {circle.mentor?.name}
        </p>

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          👥 Members: {circle.members.length}
        </p>
      </div>

      {/* 🔵 Posts Section */}
      <div>
        <h3>Posts</h3>

        <button
          onClick={() =>
            navigate(`/circles/${circleId}/create-post`)
          }
          style={{
            marginBottom: "15px",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
            background: "#3b82f6",
            color: "white",
            cursor: "pointer",
          }}
        >
          Create Post
        </button>

        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(`/posts/${post._id}`)
                }
              >
                {post.title}

                <span
                  style={{
                    fontSize: "12px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background:
                      post.type === "doubt"
                        ? "#eee"
                        : "#dbeafe",
                  }}
                >
                  {getPostTag(post)}
                </span>

                {post.type === "doubt" &&
                  post.isSolved && (
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "2px 6px",
                        background: "green",
                        color: "white",
                        borderRadius: "4px",
                      }}
                    >
                      Solved
                    </span>
                  )}
              </h3>

              <p>{post.description}</p>

              {post.type === "discussion" && (
                <button
                  onClick={() =>
                    handleLike(post._id)
                  }
                  style={{ marginTop: "6px" }}
                >
                  👍 {post.likes.length}
                </button>
              )}

              <div style={{ marginTop: "6px" }}>
                <small>
                  By {post.author?.name}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CircleDetail;