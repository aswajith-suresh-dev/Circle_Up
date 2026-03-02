import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
const AdminFeedback = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
if (user?.role !== "admin") {
  return (
    <div style={{ padding: "20px",textAlign: "center" }}>
      <h2>Access Denied</h2>
      <p>You are not authorized to view this page.</p>
    </div>
  );
}
  const fetchFeedback = async () => {
    try {
      const res = await api.get("/support/feedback");
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Feedback</h2>

      {feedbacks.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        feedbacks.map((fb) => (
          <div
            key={fb._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p>{"⭐".repeat(fb.rating)}</p>
            <p>{fb.message}</p>
            <small>
              — {fb.user?.name} ({fb.user?.email})
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminFeedback;
