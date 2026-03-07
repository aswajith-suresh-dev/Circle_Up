// src/pages/Search.jsx

import { FiFilter, FiX, FiTag, FiLayers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

const Search = () => {

  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [myCircles, setMyCircles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");

  const topics = [
    "react",
    "node",
    "express",
    "mongodb",
    "javascript",
    "python",
    "css"
  ];

  const levels = [
    "beginner",
    "intermediate",
    "advanced"
  ];

  // Fetch joined circles
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

  // Auto search when filters change
  useEffect(() => {
    if (topic || level) {
      handleSearch();
    }
  }, [topic, level]);

  // Search function
  const handleSearch = async () => {

    if (!query && !topic && !level) return;

    try {

      setLoading(true);
      setHasSearched(true);

      const params = new URLSearchParams();

      if (query) params.append("query", query);
      if (topic) params.append("topic", topic);
      if (level) params.append("level", level);

      const res = await api.get(`/circles/search?${params}`);

      setSearchResults(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setQuery("");
    setTopic("");
    setLevel("");
    setSearchResults([]);
    setHasSearched(false);
  };

  // Check if already joined
  const isJoined = (circleId) => {
    return myCircles.some(
      (circle) => circle._id === circleId
    );
  };

  // Join circle
  const handleJoin = async (circleId) => {
    try {

      await api.post(`/circles/${circleId}/join`);

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

      {/* Search Bar */}

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>

        <input
          type="text"
          placeholder="Search by circle name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          style={{
            padding: "8px",
            flex: 1,
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

        {/* Filter Button */}

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#f3f4f6",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <FiFilter size={18} />
        </button>

      </div>

      {/* Filters */}

      {showFilters && (
        <>

          {/* Topics */}

          <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FiTag /> Topics
          </h3>

          <div style={{ marginBottom: "20px" }}>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                style={{
                  marginRight: "8px",
                  marginBottom: "8px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: topic === t ? "#3b82f6" : "#f3f4f6",
                  color: topic === t ? "white" : "black",
                  cursor: "pointer"
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Levels */}

          <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FiLayers /> Level
          </h3>

          <div style={{ marginBottom: "20px" }}>
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                style={{
                  marginRight: "8px",
                  marginBottom: "8px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: level === l ? "#3b82f6" : "#f3f4f6",
                  color: level === l ? "white" : "black",
                  cursor: "pointer"
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Clear Filters */}

          <button
            onClick={clearFilters}
            style={{
              marginBottom: "20px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <FiX /> Clear Filters
          </button>

        </>
      )}

      {/* Loading */}

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
            cursor: "pointer"
          }}
        >
          <h3>{circle.name}</h3>
          <p>{circle.description}</p>

          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            👨‍🏫 Mentor: {circle.mentor?.name}
          </p>

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
                cursor: "not-allowed"
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
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#3b82f6",
                color: "white",
                cursor: "pointer"
              }}
            >
              Join Circle
            </button>
          )}

        </div>
      ))}

      {/* No results */}

      {searchResults.length === 0 &&
        !loading &&
        hasSearched && (
          <p>No circles found</p>
      )}

    </div>
  );
};

export default Search;