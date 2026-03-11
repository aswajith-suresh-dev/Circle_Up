import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../css/RightSidebar.css";

const RightSidebar = () => {

  const [circles,setCircles] = useState([]);
  const [challenges,setChallenges] = useState([]);

  const fetchData = async () => {

    try{

      const circlesRes = await api.get("/circles/top");
      const challengesRes = await api.get("/challenges/popular");

      setCircles(circlesRes.data);
      setChallenges(challengesRes.data);

    }catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{
    fetchData();
  },[]);

  return(

<div className="right-sidebar">

  <h3 className="right-title">Explore</h3>

  {/* Top Circles */}

  <div className="right-card">

    <h4>🔥 Top Circles</h4>

    {circles.map(circle => (

      <div key={circle._id} className="right-card-item">
        {circle.name}
      </div>

    ))}

  </div>

  {/* Popular Challenges */}

  <div className="right-card">

    <h4>🏆 Popular Challenges</h4>

    {challenges.map(ch => (

      <div key={ch._id} className="right-card-item">
        {ch.title}
      </div>

    ))}

  </div>

</div>

);

};

export default RightSidebar;