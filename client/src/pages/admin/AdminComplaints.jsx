import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../css/AdminComplaints.css";

const AdminComplaints = () => {

  const { user } = useAuth();

  const [complaints,setComplaints] = useState([]);
  const [replyText,setReplyText] = useState({});
  const [loading,setLoading] = useState(false);

  if(user?.role !== "admin"){
    return(
      <div className="admin-complaints-denied">
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  const fetchComplaints = async () => {
    try{

      const res = await api.get("/support/complaints");

const sorted = res.data.sort((a, b) => {
  if (a.status === "pending" && b.status !== "pending") return -1;
  if (a.status !== "pending" && b.status === "pending") return 1;
  return 0;
});

setComplaints(sorted);
    }catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchComplaints();
  },[]);

const handleReply = async (complaintId) => {

  const reply = replyText[complaintId]?.trim();

  // ❌ prevent empty reply
  if (!reply) {
    alert("Please enter a reply before submitting.");
    return;
  }

  // ⚠️ confirmation (important since no edit option)
  const confirmReply = window.confirm(
    "Are you sure you want to send this reply?\nYou cannot edit it later."
  );

  if (!confirmReply) return;

  try {

    setLoading(true);

    await api.put(
      `/support/complaint/reply/${complaintId}`,
      { reply }
    );

    // ✅ success alert
    alert("Reply sent successfully ✅");

    // clear textarea
    setReplyText(prev => ({
      ...prev,
      [complaintId]: ""
    }));

    // refresh data
    fetchComplaints();

  } catch (err) {

    console.error(
      err.response?.data?.message || err.message
    );

    // ❌ error alert
    alert(
      err.response?.data?.message || "Failed to send reply ❌"
    );

  } finally {
    setLoading(false);
  }
};


  return(

    <div className="admin-complaints-page">

      <h2 className="admin-complaints-title">
        User Complaints
      </h2>

      {complaints.length === 0 && (
        <p className="admin-complaints-empty">
          No complaints found
        </p>
      )}

      <div className="admin-complaints-grid">

        {complaints.map(complaint => (

          <div
            key={complaint._id}
            className="admin-complaints-card"
          >

            <p>
              <strong>User:</strong> {complaint.user?.name}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <p className="admin-complaints-message">
              {complaint.message}
            </p>

            <p>
              <strong>Status:</strong> {complaint.status}
            </p>

            {complaint.adminReply && (

              <div className="admin-complaints-reply-box">

                <strong>Admin Reply</strong>

                <p>{complaint.adminReply}</p>

              </div>

            )}

            {complaint.status === "pending" && (

              <div className="admin-complaints-reply-section">

                <textarea
                  rows="3"
                  placeholder="Write reply..."
                  value={replyText[complaint._id] || ""}
                  onChange={(e)=>
                    setReplyText(prev=>({
                      ...prev,
                      [complaint._id]:e.target.value
                    }))
                  }
                />

                <button
                  className="admin-complaints-reply-btn"
                  onClick={()=>handleReply(complaint._id)}
                  disabled={loading}
                >
                  Reply
                </button>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>

  );

};

export default AdminComplaints;