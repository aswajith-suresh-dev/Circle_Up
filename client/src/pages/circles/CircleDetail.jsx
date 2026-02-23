// src/pages/circles/CircleDetail.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CircleDetail = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();

  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Circle
  const fetchCircle = async () => {
    try {
      const res = await api.get(`/circles/${circleId}`);
      setCircle(res.data);
      setIsMember(res.data.isMember);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch Posts (only if member)
  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts/circle/${circleId}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch Challenges (only if member)
  const fetchChallenges = async () => {
    try {
      const res = await api.get(
        `/challenges/circle/${circleId}`
      );
      setChallenges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Load Data
  useEffect(() => {
    const loadData = async () => {
      await fetchCircle();

      // Only load posts/challenges if member
      if (isMember) {
        await fetchPosts();
        await fetchChallenges();
      }

      setLoading(false);
    };

    loadData();
  }, [circleId, isMember]);

  // 🔹 Join Circle
  const handleJoin = async () => {
    try {
      await api.post(`/circles/${circleId}/join`);
      await fetchCircle(); // refresh membership
    } catch (err) {
      console.error(
        err.response?.data?.message || err.message
      );
    }
  };

  // 🔹 Like Post
  const handleLike = async (postId) => {
    try {
      await api.put(`/posts/like/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const getPostTag = (post) =>
    post.type === "doubt" ? "Doubt" : "Discussion";

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
        <p>👥 Members: {circle.members.length}</p>

        {/* 🔥 Join Button */}
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

      {/* 🔒 If NOT Member */}
      {!isMember ? (
        <div
          style={{
            padding: "20px",
            border: "1px dashed #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>🔒 Members Only</h3>
          <p>
            You must join this circle to access
            posts and challenges.
          </p>
        </div>
      ) : (
        <>
          {/* 🔵 Posts Section */}
          <div>
            <h3>Posts</h3>

            <button
              onClick={() =>
                navigate(
                  `/circles/${circleId}/create-post`
                )
              }
              style={{
                marginBottom: "15px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#3b82f6",
                color: "white",
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
                    onClick={() =>
                      navigate(`/posts/${post._id}`)
                    }
                  >
                    {post.title}
                  </h3>

                  <p>{post.description}</p>

                  {post.type ===
                    "discussion" && (
                    <button
                      onClick={() =>
                        handleLike(post._id)
                      }
                    >
                      👍 {post.likes.length}
                    </button>
                  )}

                  <small>
                    By {post.author?.name}
                  </small>
                </div>
              ))
            )}
          </div>

          <hr style={{ margin: "30px 0" }} />

          {/* 🔵 Challenges */}
          <h3>Challenges</h3>

          {challenges.length === 0 ? (
            <p>
              No challenges in this circle yet.
            </p>
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
                  <button
                    onClick={() =>
                      navigate("/challenges")
                    }
                  >
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