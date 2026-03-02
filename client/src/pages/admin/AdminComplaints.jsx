import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
const AdminComplaints = () => {
    const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
if (user?.role !== "admin") {
  return (
    <div style={{ padding: "20px",textAlign: "center" }}>
      <h2>Access Denied</h2>
      <p>You are not authorized to view this page.</p>
    </div>
  );
}
  const fetchComplaints = async () => {
    try {
      const res = await api.get("/support/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleReply = async (complaintId) => {
    try {
      setLoading(true);

      await api.put(
        `/support/complaint/reply/${complaintId}`,
        {
          reply: replyText[complaintId],
        }
      );

      setReplyText((prev) => ({
        ...prev,
        [complaintId]: "",
      }));

      fetchComplaints();

    } catch (err) {
      console.error(
        err.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h2>Admin - Complaints</h2>

      {complaints.length === 0 && (
        <p>No complaints found.</p>
      )}

      {complaints.map((complaint) => (
        <div
          key={complaint._id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>User:</strong>{" "}
            {complaint.user?.name}
          </p>

          <p>
            <strong>Message:</strong>
          </p>
          <p>{complaint.message}</p>

          <p>
            <strong>Status:</strong>{" "}
            {complaint.status}
          </p>

          {complaint.adminReply && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                background: "#e0f2fe",
                borderRadius: "6px",
              }}
            >
              <strong>Admin Reply:</strong>
              <p>{complaint.adminReply}</p>
            </div>
          )}

          {complaint.status === "pending" && (
            <>
              <textarea
                rows="3"
                placeholder="Write reply..."
                value={
                  replyText[complaint._id] || ""
                }
                onChange={(e) =>
                  setReplyText((prev) => ({
                    ...prev,
                    [complaint._id]:
                      e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "8px",
                }}
              />

              <button
                onClick={() =>
                  handleReply(complaint._id)
                }
                disabled={loading}
                style={{
                  marginTop: "8px",
                  padding: "6px 12px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Reply
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminComplaints;