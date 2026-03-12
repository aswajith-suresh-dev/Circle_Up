import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../css/Notifications.css";

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

    <div className="notifications-page">

      <div className="notifications-container">

        <div className="notifications-header">

          <h2>Notifications</h2>

          <button
            onClick={markAllAsRead}
            className="mark-read-btn"
          >
            Mark All as Read
          </button>

        </div>

        {notifications.length === 0 && (
          <p className="empty-text">
            No notifications yet.
          </p>
        )}

        {notifications.map((n) => (

          <div
            key={n._id}
            onClick={() => handleClick(n)}
            className={`notification-card ${
              n.isRead ? "" : "unread"
            }`}
          >

            <p className="notification-message">
              {n.message}
            </p>

            <span className="notification-time">
              {formatTimeAgo(n.createdAt)}
            </span>

          </div>

        ))}

      </div>

    </div>

  );

};

export default Notifications;