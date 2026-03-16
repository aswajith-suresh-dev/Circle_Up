import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

import "../../css/ChallengeOverview.css";

const ChallengeOverview = () => {

  const { challengeId } = useParams();

  const [data,setData] = useState(null);

  const fetchOverview = async () => {

    try{

      const res = await api.get(
        `/challenges/${challengeId}/overview`
      );

      setData(res.data);

    }catch(err){

      console.error(err);

    }

  };

  useEffect(()=>{
    fetchOverview();
  },[]);


  if(!data) return <p>Loading...</p>;

  return(

    <div className="overview-page">

      <h2>Challenge Overview</h2>

      <div className="overview-grid">

        <div className="overview-card">

          <h3>{data.participants}</h3>

          <p>Participants</p>

        </div>

        <div className="overview-card">

          <h3>{data.active}</h3>

          <p>Active Users</p>

        </div>

        <div className="overview-card">

          <h3>{data.completed}</h3>

          <p>Completed</p>

        </div>

        <div className="overview-card">

          <h3>{data.completionRate}%</h3>

          <p>Completion Rate</p>

        </div>

        <div className="overview-card">

          <h3>⭐ {data.avgRating}</h3>

          <p>Average Rating</p>

        </div>

        <div className="overview-card">

          <h3>{data.reviewCount}</h3>

          <p>Reviews</p>

        </div>

      </div>

    </div>

  );

};

export default ChallengeOverview;