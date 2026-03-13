import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../css/AdminMentorRequests.css";

const AdminMentorRequests = () => {

  const [applications,setApplications] = useState([]);

  const fetchApplications = async () => {
    try{

      const res = await api.get("/mentor/applications");

      setApplications(res.data);

    }catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchApplications();
  },[]);


  const handleApprove = async (id) => {

    try{

      await api.put(`/mentor/approve/${id}`);

      setApplications(prev =>
        prev.filter(app => app._id !== id)
      );

    }catch(err){
      console.error(err.response?.data?.message || err.message);
    }

  };


  const handleReject = async (id) => {

    try{

      await api.put(`/mentor/reject/${id}`);

      setApplications(prev =>
        prev.filter(app => app._id !== id)
      );

    }catch(err){
      console.error(err.response?.data?.message || err.message);
    }

  };


  return(

    <div className="admin-mentor-page">

      <h2 className="admin-mentor-title">
        Mentor Applications
      </h2>

      {applications.length === 0 ? (

        <p className="admin-mentor-empty">
          No pending applications
        </p>

      ) : (

        <div className="admin-mentor-grid">

          {applications.map(app => (

            <div
              key={app._id}
              className="admin-mentor-card"
            >

              <h3>{app.user.name}</h3>

              <p>Email: {app.user.email}</p>

              <p>Role: {app.user.role}</p>

              <p>
                Bio: {app.bio || "No bio provided"}
              </p>

              <p>
                Expertise: {app.expertise}
              </p>

              {app.portfolioLink && (
                <p>
                  Portfolio:
                  <a
                    href={app.portfolioLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                </p>
              )}

              <div className="admin-mentor-actions">

                <button
                  className="admin-mentor-btn approve"
                  onClick={()=>handleApprove(app._id)}
                >
                  Approve
                </button>

                <button
                  className="admin-mentor-btn reject"
                  onClick={()=>handleReject(app._id)}
                >
                  Reject
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default AdminMentorRequests;