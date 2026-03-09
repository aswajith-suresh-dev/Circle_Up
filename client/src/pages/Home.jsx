// src/pages/Home.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RightSidebar from "../components/layout/RightSidebar";
import TopBar from "../components/layout/TopBar";
import "../css/Home.css";

const Home = () => {

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("recent");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // 🔹 Fetch Feed
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

  // 🔹 Like
  const handleLike = async (e, postId) => {
    e.stopPropagation();

    try {
      const res = await api.put(`/posts/like/${postId}`);

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

  // 🔹 Filter posts
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

      {/* Feed */}
      <div className="feed-container">

        <TopBar
  filter={filter}
  setFilter={setFilter}
/>

        <h2>Home Feed</h2>

        {filteredPosts.length === 0 && (
          <p>No posts found</p>
        )}

        {filteredPosts.map((post) => (

          <div
            key={post._id}
            className="feed-card"
            onClick={() => navigate(`/posts/${post._id}`)}
          >

            {/* Title */}
            <h3>
              {post.title}

              {post.type === "doubt" && post.isSolved && (
                <span className="solved-tag">
                  ✔ Solved
                </span>
              )}

            </h3>

            {/* Meta */}
            <p className="post-meta">
              {post.type?.toUpperCase()} · {post.circle?.name}
            </p>

            {/* Links */}
            {post.links && post.links.length > 0 && (
              <div className="post-links">

                {post.links.map((link, index) => (
                  <div key={index}>

                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔗 Visit Link {index + 1}
                    </a>

                  </div>
                ))}

              </div>
            )}

            {/* Like */}
            {post.type === "discussion" && (

              <button
                className="like-btn"
                onClick={(e) => handleLike(e, post._id)}
              >
                👍 {post.likes?.length || 0}
              </button>

            )}

            {/* Author */}
            <div className="post-author">

              <small>
                By {post.author?.name}
              </small>

            </div>

          </div>

        ))}

        <button
          className="my-circles-btn"
          onClick={() => navigate("/my-circles")}
        >
          My Circles
        </button>

      </div>

      {/* Right Sidebar */}
      <RightSidebar />

    </div>

  );
};

export default Home;