import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  FiUsers,
  FiUser,
  FiBookOpen,
  FiBarChart2,
  FiGrid,
  FiTarget,
} from "react-icons/fi";

import "../css/Challenges.css";

const Challenges = () => {

  const [allChallenges,setAllChallenges] = useState([]);
  const [myProgress,setMyProgress] = useState([]);
  const [myCircles,setMyCircles] = useState([]);

  const [filter,setFilter] = useState("all");

  // NEW FILTER STATES
  const [typeFilter,setTypeFilter] = useState("all");
  const [ratingFilter,setRatingFilter] = useState("all");

  const navigate = useNavigate();

  const fetchData = async () => {

    try{

      const allRes = await api.get("/challenges/all");
      const myRes = await api.get("/challenges/my");
      const circlesRes = await api.get("/circles/my");

      setAllChallenges(allRes.data || []);
      setMyProgress(myRes.data || []);
      setMyCircles(circlesRes.data || []);

    }catch(err){

      console.error(err);

    }

  };

  useEffect(()=>{
    fetchData();
  },[]);


  const handleJoin = async (challengeId) => {

    try{

      await api.post(`/challenges/${challengeId}/join`);
      fetchData();

    }catch(err){

      console.error(err);

    }

  };


  const isJoined = (challengeId) => {

    return myProgress.find(
      (p)=>p?.challenge && p.challenge._id === challengeId
    );

  };


  const isCircleMember = (circleId) => {

    return myCircles.find(
      (circle)=>circle?._id === circleId
    );

  };


  /* ---------- BASE FILTER (ALL / MY) ---------- */

  let filteredChallenges =
    filter === "all"
      ? allChallenges
      : myProgress
          .map((p)=>
            allChallenges.find(
              (c)=>c._id === p.challenge?._id
            )
          )
          .filter(Boolean);


  /* ---------- TYPE FILTER ---------- */

  if(typeFilter !== "all"){

    filteredChallenges =
      filteredChallenges.filter(
        (c)=>c.type === typeFilter
      );

  }


  /* ---------- RATING FILTER ---------- */

  if(ratingFilter !== "all"){

    filteredChallenges =
      filteredChallenges.filter(
        (c)=>(c.avgRating || 0) >= ratingFilter
      );

  }


  return (

    <div className="challengehub-page">

      <h2 className="challengehub-title">
        Challenges
      </h2>


      {/* MAIN FILTER */}

      <div className="challengehub-filter">

        <button
          className={
            filter === "all"
              ? "challengehub-filter-btn active"
              : "challengehub-filter-btn"
          }
          onClick={()=>setFilter("all")}
        >
          <FiGrid/> All
        </button>

        <button
          className={
            filter === "my"
              ? "challengehub-filter-btn active"
              : "challengehub-filter-btn"
          }
          onClick={()=>setFilter("my")}
        >
          <FiTarget/> My Challenges
        </button>

      </div>


      {/* EXTRA FILTERS */}

      <div className="challengehub-extra-filters">

        <select
          value={typeFilter}
          onChange={(e)=>setTypeFilter(e.target.value)}
        >
          <option value="all">
            All Types
          </option>

          <option value="free">
            Free
          </option>

          <option value="paid">
            Paid
          </option>

        </select>


        <select
          value={ratingFilter}
          onChange={(e)=>
            setRatingFilter(
              e.target.value === "all"
                ? "all"
                : Number(e.target.value)
            )
          }
        >

          <option value="all">
            All Ratings
          </option>

          <option value="4">
            ⭐ 4+
          </option>

          <option value="3">
            ⭐ 3+
          </option>

          <option value="2">
            ⭐ 2+
          </option>

        </select>

      </div>


      {filteredChallenges.length === 0 && (
        <p className="challengehub-empty">
          No challenges found
        </p>
      )}


      <div className="challengehub-grid">

        {filteredChallenges.map((challenge)=>{

          if(!challenge) return null;

          const progress = isJoined(challenge._id);

          const isCompleted =
            progress &&
            progress.completedDays.length >= challenge.totalDays;

          const circleMember = isCircleMember(
            challenge.circle?._id || challenge.circle
          );

          const progressPercent = progress
            ? Math.floor(
                (progress.completedDays.length /
                  challenge.totalDays) * 100
              )
            : 0;


          return (

            <div
              key={challenge._id}
              className="challengehub-card"
            >

              <div className="challengehub-header">

                <div>

                  <h3>
                    {challenge.title}
                  </h3>

                  <div className="challengehub-rating">

                    <span className="rating-stars">
                      ⭐ {challenge.avgRating?.toFixed(1) || "0"}
                    </span>

                    <span className="rating-count">
                      ({challenge.reviewCount || 0} reviews)
                    </span>

                  </div>

                </div>


                <span
                  className={
                    challenge.type === "free"
                      ? "challengehub-badge-free"
                      : "challengehub-badge-paid"
                  }
                >
                  {challenge.type === "free"
                    ? "Free"
                    : `₹${challenge.price}`}
                </span>

              </div>


              <div className="challengehub-meta">

                <p>
                  <FiBarChart2/>
                  {challenge.level}
                </p>

                <p>
                  <FiUsers/>
                  {challenge.participants || 0} participants
                </p>

                <p>
                  <FiBookOpen/>
                  {challenge.circle?.name || "N/A"}
                </p>

                <p>
                  <FiUser/>
                  {challenge.mentor?.name || "Unknown"}
                </p>

              </div>


              {progress && (

                <div className="challengehub-progress">

                  <div className="challengehub-progress-bg">

                    <div
                      className="challengehub-progress-fill"
                      style={{width:`${progressPercent}%`}}
                    />

                  </div>

                  <p className="challengehub-progress-text">

                    {progress.completedDays.length} /
                    {challenge.totalDays} days

                  </p>

                </div>

              )}


              {/* REVIEW PAGE */}

              <button
                className="challengehub-btn-reviews"
                onClick={() =>
                  navigate(
                    `/challenges/${challenge._id}/all-reviews`
                  )
                }
              >
                All Reviews
              </button>


              {!progress &&
                filter === "all" &&
                circleMember &&
                challenge.type === "free" && (

                <button
                  className="challengehub-btn-join"
                  onClick={()=>handleJoin(challenge._id)}
                >
                  Join Challenge
                </button>

              )}


              {!progress &&
                filter === "all" &&
                circleMember &&
                challenge.type === "paid" && (

                <button
                  className="challengehub-btn-join"
                  onClick={() =>
                    navigate(`/payment/${challenge._id}`)
                  }
                >
                  Purchase ₹{challenge.price}
                </button>

              )}


              {!circleMember && !progress && (

                <p className="challengehub-note">
                  Join the circle first
                </p>

              )}


              {progress && !isCompleted && (

                <button
                  className="challengehub-btn-continue"
                  onClick={() =>
                    navigate(`/challenges/${challenge._id}`)
                  }
                >
                  Continue
                </button>

              )}


              {isCompleted && (

                <button
                  className="challengehub-btn-completed"
                  onClick={() =>
                    navigate(`/challenges/${challenge._id}`)
                  }
                >
                  Completed ✔
                </button>

              )}

            </div>

          );

        })}

      </div>

    </div>

  );

};

export default Challenges;