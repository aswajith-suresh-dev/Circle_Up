// src/pages/circles/CircleDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CircleDetail = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts/circle/${circleId}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [circleId]);

  const handleLike = async (postId) => {
    try {
      await api.put(`/posts/like/${postId}`);
      fetchPosts(); // refresh list
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const getPostTag = (post) => {
    return post.type === "doubt" ? "Doubt" : "Discussion";
  };

  if (loading) return <p>Loading circle...</p>;

  return (
    <div style={{ padding: "16px" }}>
      <h2>Circle Posts</h2>

      <button onClick={() => navigate(`/circles/${circleId}/create-post`)}>
        Create Post
      </button>

      <hr />

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "8px",
            }}
          >
            {/* Title → navigation ONLY here */}
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/posts/${post._id}`)}
            >
              {post.title}

              {/* Type tag */}
              <span
                style={{
                  fontSize: "12px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background:
                    post.type === "doubt" ? "#eee" : "#dbeafe",
                  color: "#333",
                }}
              >
                {getPostTag(post)}
              </span>

              {/* Solved badge */}
              {post.type === "doubt" && post.isSolved && (
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

            {/* Like only for discussions */}
            {post.type === "discussion" && (
              <button
                onClick={() => handleLike(post._id)}
                style={{ marginTop: "6px" }}
              >
                👍 {post.likes.length}
              </button>
            )}

            <div style={{ marginTop: "6px" }}>
              <small>By {post.author?.name}</small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CircleDetail;