import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };
const markAllAsRead = async () => {
  try {
    await api.put("/notifications/read-all");

    // update UI instantly
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClick = async (notification) => {
    try {
      await api.put(`/notifications/${notification._id}/read`);
      navigate(notification.link);
    } catch (err) {
      console.error(err);
    }
  };
const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);

  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day ago`;
};
  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
<h2>Notifications</h2>

<button
  onClick={markAllAsRead}
  style={{
    marginBottom: "15px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  }}
>
  Mark All as Read
</button>
      {notifications.length === 0 && (
        <p>No notifications yet.</p>
      )}

      {notifications.map((n) => (
        <div
          key={n._id}
          onClick={() => handleClick(n)}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px",
            cursor: "pointer",
            background: n.isRead ? "#fff" : "#eef2ff",
          }}
        >
<div>
  <p style={{ marginBottom: "4px" }}>{n.message}</p>

  <small style={{ color: "#6b7280" }}>
    {formatTimeAgo(n.createdAt)}
  </small>
</div>        </div>
      ))}
    </div>
  );
};

export default Notifications;