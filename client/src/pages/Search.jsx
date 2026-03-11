// src/pages/Search.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import "../css/Search.css";
import { FiFilter, FiX, FiUser } from "react-icons/fi";

const Search = () => {

  const navigate = useNavigate();

  const [showFilters,setShowFilters] = useState(false);

  const [query,setQuery] = useState("");
  const [searchResults,setSearchResults] = useState([]);
  const [myCircles,setMyCircles] = useState([]);

  const [loading,setLoading] = useState(false);
  const [hasSearched,setHasSearched] = useState(false);

  const [topic,setTopic] = useState("");
  const [level,setLevel] = useState("");

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

  useEffect(()=>{
    const fetchMyCircles = async () =>{
      try{
        const res = await api.get("/circles/my");
        setMyCircles(res.data);
      }catch(err){
        console.error(err);
      }
    };

    fetchMyCircles();

  },[]);


  useEffect(()=>{
    if(topic || level){
      handleSearch();
    }
  },[topic,level]);


  const handleSearch = async () => {

    if(!query && !topic && !level) return;

    try{

      setLoading(true);
      setHasSearched(true);

      const params = new URLSearchParams();

      if(query) params.append("query",query);
      if(topic) params.append("topic",topic);
      if(level) params.append("level",level);

      const res = await api.get(`/circles/search?${params}`);

      setSearchResults(res.data);

    }catch(err){
      console.error(err);
    }
    finally{
      setLoading(false);
    }

  };


  const clearFilters = () =>{
    setQuery("");
    setTopic("");
    setLevel("");
    setSearchResults([]);
    setHasSearched(false);
  };


  const isJoined = (circleId) =>{
    return myCircles.some(circle => circle._id === circleId);
  };


  const handleJoin = async(circleId)=>{
    try{

      await api.post(`/circles/${circleId}/join`);

      const res = await api.get("/circles/my");

      setMyCircles(res.data);

    }catch(err){
      console.error(err.response?.data?.message || err.message);
    }
  };


  return(

    <div className="search-page">

      <div className="search-card">

        <h2 className="search-title">Explore Circles</h2>

        {/* Search bar */}

        <div className="search-bar">

          <input
            type="text"
            placeholder="Search circles..."
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                handleSearch();
              }
            }}
          />

          <button onClick={handleSearch}>
            Search
          </button>

          <button
            className="filter-toggle"
            onClick={()=>setShowFilters(!showFilters)}
          >
            <FiFilter/>
          </button>

        </div>


        {/* Filters */}

        {showFilters && (

          <div className="search-filters">

            {/* Topics */}

            <div className="topic-section">

              <h4>Topics</h4>

              <div className="topic-grid">

                {topics.map((t)=>(
                  <div
                    key={t}
                    className={`topic-tile ${topic===t ? "active" : ""}`}
                    onClick={()=>setTopic(t)}
                  >
                    {t}
                  </div>
                ))}

              </div>

            </div>


            {/* Levels */}

            <div className="level-section">

              <h4>Level</h4>

              {levels.map((l)=>(
                <button
                  key={l}
                  className={`level-btn ${level===l ? "active" : ""}`}
                  onClick={()=>setLevel(l)}
                >
                  {l}
                </button>
              ))}

            </div>


            <button
              className="clear-btn"
              onClick={clearFilters}
            >
              <FiX/> Clear Filters
            </button>

          </div>

        )}

      </div>


      {/* RESULTS */}

      <div className="search-results">

        {loading && <p>Searching...</p>}

        {searchResults.map(circle => (

          <div
            key={circle._id}
            className="circle-result"
            onClick={()=>navigate(`/circles/${circle._id}`)}
          >

            <h3>{circle.name}</h3>

            <p>{circle.description}</p>
<span className="mentor">
  <span className="mentor-icon-box">
    <FiUser className="mentor-icon" />
  </span>
  Mentor: {circle.mentor?.name}
</span>

            {isJoined(circle._id) ? (

              <button className="joined-btn">
                Joined ✔
              </button>

            ) : (

              <button
                className="join-btn"
                onClick={(e)=>{
                  e.stopPropagation();
                  handleJoin(circle._id);
                }}
              >
                Join Circle
              </button>

            )}

          </div>

        ))}

        {searchResults.length===0 && !loading && hasSearched && (
          <p>No circles found</p>
        )}

      </div>

    </div>

  );

};

export default Search;