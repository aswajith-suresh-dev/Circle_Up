// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";

// const AdminPanel = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔒 Protect Admin Route
//   useEffect(() => {
//     if (!user || user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const fetchApplications = async () => {
//     try {
//       const res = await api.get("/mentor/applications");
//       setApplications(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   const handleApprove = async (id) => {
//     try {
//       await api.put(`/mentor/approve/${id}`);

//       // Remove approved from UI immediately
//       setApplications((prev) =>
//         prev.filter((app) => app._id !== id)
//       );

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       await api.put(`/mentor/reject/${id}`);

//       setApplications((prev) =>
//         prev.filter((app) => app._id !== id)
//       );

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <p>Loading applications...</p>;

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px" }}>
//       <h2>Admin Panel</h2>

//       <h3>Pending Mentor Applications</h3>

//       {applications.length === 0 && (
//         <p>No pending applications</p>
//       )}

//       {applications.map((app) => (
//         <div
//           key={app._id}
//           style={{
//             border: "1px solid #ddd",
//             padding: "16px",
//             marginBottom: "12px",
//             borderRadius: "8px",
//             background: "#fafafa",
//           }}
//         >
//           <h4>{app.user.name}</h4>
//           <p>Email: {app.user.email}</p>

//           <p>
//             <strong>Bio:</strong> {app.bio}
//           </p>

//           <p>
//             <strong>Expertise:</strong> {app.expertise}
//           </p>

//           {app.portfolioLink && (
//             <p>
//               <strong>Portfolio:</strong>{" "}
//               <a
//                 href={app.portfolioLink}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 {app.portfolioLink}
//               </a>
//             </p>
//           )}

//           <div style={{ marginTop: "10px" }}>
//             <button
//               onClick={() => handleApprove(app._id)}
//               style={{
//                 marginRight: "10px",
//                 padding: "6px 12px",
//                 background: "green",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "6px",
//                 cursor: "pointer",
//               }}
//             >
//               Approve
//             </button>

//             <button
//               onClick={() => handleReject(app._id)}
//               style={{
//                 padding: "6px 12px",
//                 background: "red",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "6px",
//                 cursor: "pointer",
//               }}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminPanel;
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        
        <button
          onClick={() => navigate("/admin/complaints")}
          style={btnStyle}
        >
          Manage Complaints
        </button>

        <button
          onClick={() => navigate("/admin/feedback")}
          style={btnStyle}
        >
          Manage Feedback
        </button>
<button
  onClick={() => navigate("/admin/mentor-applications")}
  style={btnStyle}
>
  Manage Mentor Applications
</button>
      </div>
    </div>
  );
};

const btnStyle = {
  padding: "12px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "none",
  background: "#1e40af",
  color: "white",
};

export default AdminPanel;