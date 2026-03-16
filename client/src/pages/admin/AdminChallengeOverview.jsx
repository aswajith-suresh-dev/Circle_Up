import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

import "../../css/AdminChallengeOverview.css";

const AdminChallengeOverview = () => {

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



  if(!data){
    return <p>Loading...</p>;
  }



  return(

    <div className="admin-overview-page">

      <h2 className="admin-overview-title">
        Challenge Overview
      </h2>


      <div className="admin-overview-grid">


        <div className="admin-overview-card">
          <h3>{data.participants}</h3>
          <p>Total Participants</p>
        </div>


        <div className="admin-overview-card">
          <h3>{data.active}</h3>
          <p>Active Users</p>
        </div>


        <div className="admin-overview-card">
          <h3>{data.completed}</h3>
          <p>Completed Users</p>
        </div>


        <div className="admin-overview-card">
          <h3>{data.completionRate}%</h3>
          <p>Completion Rate</p>
        </div>


        <div className="admin-overview-card">
          <h3>⭐ {data.avgRating}</h3>
          <p>Average Rating</p>
        </div>


        <div className="admin-overview-card">
          <h3>{data.reviewCount}</h3>
          <p>Total Reviews</p>
        </div>


      </div>

    </div>

  );

};

export default AdminChallengeOverview;