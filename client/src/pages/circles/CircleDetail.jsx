// src/pages/circles/CircleDetail.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CircleDetail = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  console.log("Circle ID from URL:", circleId);
}, [circleId]);
  // 🔹 Fetch Circle Info
  const fetchCircle = async () => {
    try {
      const res = await api.get(`/circles/${circleId}`);
      setCircle(res.data);
      setIsMember(res.data.isMember);
      
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch Posts
  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts/circle/${circleId}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch Challenges
  const fetchChallenges = async () => {
    try {
      const res = await api.get(`/challenges/circle/${circleId}`);
      setChallenges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Initial Load
  useEffect(() => {
    const load = async () => {
      await fetchCircle();
      setLoading(false);
    };
    load();
  }, [circleId]);

  // 🔹 Load content only when member
  useEffect(() => {
    if (isMember) {
      fetchPosts();
      fetchChallenges();
    }
  }, [isMember]);

  // 🔹 Join Circle
  const handleJoin = async () => {
    try {
      await api.post(`/circles/${circleId}/join`);
      await fetchCircle(); // refresh membership
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  // 🔹 Toggle Like (SYNC WITH BACKEND)
  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/posts/like/${postId}`);

      // Backend must return updated full post
      const updatedPost = res.data.post;

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? updatedPost : p))
      );
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
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
        <p>📚 Topic: {circle.topic}</p>
        <p>📊 Level: {circle.level}</p>
        <p>👨‍🏫 Mentor: {circle.mentor?.name}</p>
        <p>👥 Members: {circle.members?.length}</p>

        {!isMember && (
          <button
            onClick={handleJoin}
            style={{
              marginTop: "15px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: "#3b82f6",
              color: "white",
              cursor: "pointer",
            }}
          >
            Join Circle
          </button>
        )}
      </div>

      {/* 🔒 Restricted Section */}
      {!isMember ? (
        <div
          style={{
            padding: "20px",
            border: "1px dashed #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>🔒 Members Only</h3>
          <p>You must join this circle to access posts and challenges.</p>
        </div>
      ) : (
        <>
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
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/posts/${post._id}`)}
                  >
                    {post.title}
                  </h3>

                  <p>{post.description}</p>

                  {/* 🔗 Optional Link */}
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
)}                  {/* 👍 Like Button (Discussion Only) */}
                  {post.type === "discussion" && (
                    <button
                      onClick={() => handleLike(post._id)}
                      style={{
                        marginTop: "6px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        background: post.likes?.some(
                          (id) => id.toString() === userId
                        )
                          ? "#dbeafe"
                          : "#f3f4f6",
                        cursor: "pointer",
                      }}
                    >
                      👍 {post.likes?.length || 0}
                    </button>
                  )}

                  <div style={{ marginTop: "6px" }}>
                    <small>By {post.author?.name}</small>
                  </div>
                </div>
              ))
            )}
          </div>

          <hr style={{ margin: "30px 0" }} />

          {/* 🔵 Challenges Section */}
          <h3>Challenges</h3>

          {challenges.length === 0 ? (
            <p>No challenges in this circle yet.</p>
          ) : (
            challenges.map((challenge) => (
              <div
                key={challenge._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <h4>{challenge.title}</h4>
                <p>{challenge.description}</p>

                <span>
                  {challenge.type === "free"
                    ? "Free"
                    : `Paid ₹${challenge.price}`}
                </span>

                <div style={{ marginTop: "8px" }}>
                  <button onClick={() => navigate("/challenges")}>
                    View in Challenges
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default CircleDetail;