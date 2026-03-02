import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
const Complaint = () => {
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [editingId, setEditingId] = useState(null);
const { user } = useAuth();

if (user?.role === "admin") {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Access Denied</h2>
      <p>Admins cannot submit complaints.</p>
    </div>
  );
}
  // 🔹 Fetch user's complaints
  const fetchMyComplaints = async () => {
    try {
      const res = await api.get("/support/my-complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  // 🔹 Submit OR Update complaint
  const handleSubmit = async () => {
    if (!message.trim()) {
      setStatusMessage("Please enter your complaint.");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // 🔥 Update complaint
        const res = await api.put(
          `/support/complaint/edit/${editingId}`,
          { message }
        );

        setStatusMessage(res.data.message);
        setEditingId(null);
      } else {
        // 🔥 Create complaint
        const res = await api.post("/support/complaint", {
          message,
        });

        setStatusMessage(res.data.message);
      }

      setMessage("");
      fetchMyComplaints();

    } catch (err) {
      setStatusMessage(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete complaint
  const handleDelete = async (id) => {
    try {
      await api.delete(`/support/complaint/${id}`);
      fetchMyComplaints();
    } catch (err) {
      console.error(
        err.response?.data?.message || err.message
      );
    }
  };

  // 🔹 Start editing
  const handleEdit = (complaint) => {
    setEditingId(complaint._id);
    setMessage(complaint.message);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <h2>Submit a Complaint</h2>

      <textarea
        rows="5"
        placeholder="Describe your issue..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "12px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "8px 16px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading
          ? editingId
            ? "Updating..."
            : "Submitting..."
          : editingId
          ? "Update Complaint"
          : "Submit Complaint"}
      </button>

      {editingId && (
        <button
          onClick={() => {
            setEditingId(null);
            setMessage("");
          }}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            background: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Cancel
        </button>
      )}

      {statusMessage && (
        <p style={{ marginTop: "10px" }}>
          {statusMessage}
        </p>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h3>My Complaints</h3>

      {complaints.length === 0 && (
        <p>No complaints submitted yet.</p>
      )}

      {complaints.map((complaint) => (
        <div
          key={complaint._id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <p><strong>Your Complaint:</strong></p>
          <p>{complaint.message}</p>

          <p style={{ marginTop: "8px" }}>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  complaint.status === "replied"
                    ? "green"
                    : "orange",
              }}
            >
              {complaint.status}
            </span>
          </p>

          {/* 🔥 Admin Reply */}
          {complaint.adminReply && (
            <div
              style={{
                marginTop: "10px",
                padding: "8px",
                background: "#f0f9ff",
                borderRadius: "6px",
              }}
            >
              <strong>Admin Reply:</strong>
              <p>{complaint.adminReply}</p>
            </div>
          )}

          {/* 🔥 Edit/Delete only if NOT replied */}
          {complaint.status !== "replied" && (
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => handleEdit(complaint)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(complaint._id)}
                style={{
                  marginLeft: "10px",
                  padding: "6px 12px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Complaint;