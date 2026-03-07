import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminMentorRequests = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/mentor/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
  try {
    await api.put(`/mentor/approve/${id}`);

    // remove approved application from UI instantly
    setApplications((prev) =>
      prev.filter((app) => app._id !== id)
    );
  } catch (err) {
    console.error(err.response?.data?.message || err.message);
  }
};

 const handleReject = async (id) => {
  try {
    await api.put(`/mentor/reject/${id}`);

    setApplications((prev) =>
      prev.filter((app) => app._id !== id)
    );
  } catch (err) {
    console.error(err.response?.data?.message || err.message);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mentor Applications</h2>

{applications.length === 0 ? (
  <p>No pending applications.</p>
) : (
  applications.map((app) => (
    <div
      key={app._id}
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        marginBottom: "10px",
        borderRadius: "6px",
      }}
    >
      <h4>{app.user.name}</h4>
      <p>Email: {app.user.email}</p>
      <p>Role: {app.user.role}</p>

      <button onClick={() => handleApprove(app._id)}>
        Approve
      </button>

      <button
        onClick={() => handleReject(app._id)}
        style={{ marginLeft: "10px" }}
      >
        Reject
      </button>
    </div>
  ))
)}
    </div>
  );
};

export default AdminMentorRequests;