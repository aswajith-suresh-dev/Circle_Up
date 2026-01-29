import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      const res = await api.get("/feed");
      setPosts(res.data);
    };
    fetchFeed();
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h2>Home Feed</h2>

      {posts.length === 0 && <p>No posts yet</p>}

      {posts.map(post => (
        <div
          key={post._id}
          onClick={() => navigate(`/posts/${post._id}`)}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "8px",
            cursor: "pointer",
          }}
        >
          <h3>
            {post.title}{" "}
            {post.type === "doubt" && post.isSolved && (
              <span style={{ color: "green", fontSize: "12px" }}>✔ Solved</span>
            )}
          </h3>

          <p>
            {post.type.toUpperCase()} · {post.circle.name}
          </p>

          <small>By {post.author.name}</small>
        </div>
      ))}
    </div>
  );
};

export default Home;