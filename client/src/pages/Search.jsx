// src/pages/Search.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

const Search = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [myCircles, setMyCircles] = useState([]);
  const [loading, setLoading] = useState(false);
const [hasSearched, setHasSearched] = useState(false);
const navigate = useNavigate();
  // 🔹 Fetch joined circles on page load
  useEffect(() => {
    const fetchMyCircles = async () => {
      try {
        const res = await api.get("/circles/my");
        setMyCircles(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyCircles();
  }, []);

  // 🔹 Search handler
  const handleSearch = async () => {
  if (!query.trim()) return;

  try {
    setLoading(true);
    setHasSearched(true); // mark that search happened

    const res = await api.get(
      `/circles/search?query=${query}`
    );

    setSearchResults(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // 🔹 Check if already joined
  const isJoined = (circleId) => {
    return myCircles.some(
      (circle) => circle._id === circleId
    );
  };

  // 🔹 Join circle
  const handleJoin = async (circleId) => {
    try {
      await api.post(`/circles/${circleId}/join`);

      // Refresh joined circles
      const res = await api.get("/circles/my");
      setMyCircles(res.data);

    } catch (err) {
      console.error(
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <h2>Search Circles</h2>

      {/* Search Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by circle name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "70%",
            marginRight: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#3b82f6",
            color: "white",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Searching...</p>}

      {/* Results */}
      {searchResults.map((circle) => (
       <div
  key={circle._id}
  onClick={() => navigate(`/circles/${circle._id}`)}
  style={{
    border: "1px solid #ddd",
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "8px",
    background: "#fafafa",
    cursor: "pointer",
  }}
>
          <h3>{circle.name}</h3>
          <p>{circle.description}</p>

          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            👨‍🏫 Mentor: {circle.mentor?.name}
          </p>

          {/* Button Logic */}
          {isJoined(circle._id) ? (
            <button
              disabled
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#dcfce7",
                color: "#065f46",
                cursor: "not-allowed",
              }}
            >
              Joined ✔
            </button>
          ) : (
            <button
  onClick={(e) => {
    e.stopPropagation();
    handleJoin(circle._id);
  }}
>
  Join Circle
</button>
          )}
        </div>
      ))}

      {searchResults.length === 0 &&
  !loading &&
  hasSearched && (
    <p>No circles found</p>
)}
    </div>
  );
};

export default Search;