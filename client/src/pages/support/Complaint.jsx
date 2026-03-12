import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "../../css/Complaint.css";

const Complaint = () => {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState("");

  const { user } = useAuth();

  if (user?.role === "admin") {
    return (
      <div className="complaint-page">
        <div className="complaint-card">
          <h2>Access Denied</h2>
          <p>Admins cannot submit complaints.</p>
        </div>
      </div>
    );
  }

  const showSnackbar = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(""), 2500);
  };

  // fetch complaints
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

  // submit or update complaint
  const handleSubmit = async () => {

    if (!message.trim()) {
      showSnackbar("Please enter your complaint");
      return;
    }

    try {

      setLoading(true);

      if (editingId) {

        await api.put(`/support/complaint/edit/${editingId}`, {
          message,
        });

        showSnackbar("Complaint updated");
        setEditingId(null);

      } else {

        await api.post("/support/complaint", {
          message,
        });

        showSnackbar("Complaint submitted");

      }

      setMessage("");
      fetchMyComplaints();

    } catch (err) {

      showSnackbar(
        err.response?.data?.message || "Something went wrong"
      );

    } finally {
      setLoading(false);
    }

  };

  // delete complaint
  const handleDelete = async (id) => {

    try {

      await api.delete(`/support/complaint/${id}`);

      showSnackbar("Complaint deleted");

      fetchMyComplaints();

    } catch (err) {

      showSnackbar("Delete failed");

    }

  };

  // edit complaint
  const handleEdit = (complaint) => {

    setEditingId(complaint._id);
    setMessage(complaint.message);

  };

  return (

    <div className="complaint-page">

      {/* Submit Complaint */}

      <div className="complaint-card">

        <h2>Submit a Complaint</h2>

        <textarea
          rows="5"
          placeholder="Describe your issue..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="complaint-textarea"
        />

        <div className="complaint-buttons">

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-secondary"
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
              className="btn-cancel"
            >
              Cancel
            </button>
          )}

        </div>

      </div>

      {/* My Complaints */}

      <h3 className="complaint-section-title">
        My Complaints
      </h3>

      {complaints.length === 0 && (
        <p className="empty-text">
          No complaints submitted yet
        </p>
      )}

      {complaints.map((complaint) => (

        <div
          key={complaint._id}
          className="complaint-item"
        >

          <p className="complaint-text">
            {complaint.message}
          </p>

          <div className="complaint-status">

            <span>Status:</span>

            <span
              className={`status-badge ${complaint.status}`}
            >
              {complaint.status}
            </span>

          </div>

          {complaint.adminReply && (

            <div className="admin-reply">

              <strong>Admin Reply</strong>

              <p>{complaint.adminReply}</p>

            </div>

          )}

          {complaint.status !== "replied" && (

            <div className="complaint-actions">

              <button
                onClick={() => handleEdit(complaint)}
                className="btn-secondary"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(complaint._id)
                }
                className="btn-danger"
              >
                Delete
              </button>

            </div>

          )}

        </div>

      ))}

      {/* Snackbar */}

      {snackbar && (

        <div className="snackbar">

          {snackbar}

        </div>

      )}

    </div>

  );

};

export default Complaint;