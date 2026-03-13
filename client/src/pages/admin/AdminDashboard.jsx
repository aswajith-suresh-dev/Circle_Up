import { useEffect, useState } from "react";
import api from "../../api/axios";

import WelcomeCard from "../../components/admin/WelcomeCard";
import StatsCards from "../../components/admin/StatsCards";
import TopTabs from "../../components/admin/TopTabs";

const AdminDashboard = () => {

  const [stats,setStats] = useState(null);
  const [topData,setTopData] = useState(null);

  useEffect(()=>{

    const fetchDashboard = async () => {

      try{

        const statsRes = await api.get("/admin/dashboard");
        const topRes = await api.get("/admin/top-data");
console.log("STATS:", statsRes.data);
    console.log("TOP DATA:", topRes.data);
        setStats(statsRes.data);
        setTopData(topRes.data);

      }catch(err){
        console.error(err);
      }

    };

    fetchDashboard();

  },[]);

  if(!stats || !topData){
    return <p>Loading dashboard...</p>;
  }

  return(

    <div className="admin-dashboard">

      <WelcomeCard />

      <StatsCards stats={stats} />

      <TopTabs data={topData} />

    </div>

  );

};

export default AdminDashboard;