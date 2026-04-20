import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "../../css/CircleMembers.css";
import { useAuth } from "../../context/AuthContext";
const CircleMembers = () => {
  const { circleId } = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/mentor/circle/${circleId}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRemove = async (userId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this user from the circle?",
    );

    if (!confirmRemove) return;

    try {
      await api.delete(`/mentor/circle/${circleId}/remove/${userId}`);

      setMembers((prev) => prev.filter((m) => m._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading members...</p>;

  return (
    <div className="members-page">
      <h2>Circle Members</h2>

      {members.length === 0 ? (
        <p>No members yet</p>
      ) : (
        <div className="members-list">
          {members.map((member) => (
            <div key={member._id} className="member-card">
              {/* Avatar */}
              <div className="member-avatar">
                {member.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="member-info">
                <h4>{member.name}</h4>
                <p>{member.email}</p>
              </div>

              {/* Remove Button */}
              {member._id !== user._id && (
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(member._id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CircleMembers;
