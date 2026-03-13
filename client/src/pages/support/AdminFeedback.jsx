import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../css/AdminFeedback.css";

const AdminFeedback = () => {

  const { user } = useAuth();
  const [feedbacks,setFeedbacks] = useState([]);

  if (user?.role !== "admin") {
    return (
      <div className="admin-feedback-denied">
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  const fetchFeedback = async () => {
    try {

      const res = await api.get("/support/feedback");

      setFeedbacks(res.data);

    } catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchFeedback();
  },[]);

  return (

    <div className="admin-feedback-page">

      <h2 className="admin-feedback-title">
        All Feedback
      </h2>

      {feedbacks.length === 0 ? (

        <p className="admin-feedback-empty">
          No feedback yet
        </p>

      ) : (

        <div className="admin-feedback-grid">

          {feedbacks.map(fb => (

            <div
              key={fb._id}
              className="admin-feedback-card"
            >

              <p className="admin-feedback-stars">
                {"⭐".repeat(fb.rating)}
              </p>

              <p className="admin-feedback-message">
                {fb.message}
              </p>

              <div className="admin-feedback-user">

                <span>{fb.user?.name}</span>

                <small>{fb.user?.email}</small>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default AdminFeedback;