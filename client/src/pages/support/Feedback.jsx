import { useEffect, useState } from "react";
import api from "../../api/axios";

const Feedback = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchMyFeedback = async () => {
    try {
      const res = await api.get("/support/my-feedback");

      if (res.data) {
        setExistingFeedback(res.data);
        setMessage(res.data.message);
        setRating(res.data.rating);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const handleSubmit = async () => {
    try {
      await api.post("/support/feedback", {
        message,
        rating,
      });

      setIsEditing(false);
      fetchMyFeedback();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Feedback</h2>

      {existingFeedback && !isEditing ? (
        <>
          <p><strong>Your Rating:</strong></p>
          <p>{"⭐".repeat(existingFeedback.rating)}</p>

          <p><strong>Your Feedback:</strong></p>
          <p>{existingFeedback.message}</p>

          <button onClick={() => setIsEditing(true)}>
            Edit Feedback
          </button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: "10px" }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setRating(num)}
                style={{
                  marginRight: "5px",
                  background: rating >= num ? "#facc15" : "#e5e7eb",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                }}
              >
                ⭐
              </button>
            ))}
          </div>

          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <button onClick={handleSubmit}>
            {existingFeedback ? "Update Feedback" : "Submit Feedback"}
          </button>
        </>
      )}
    </div>
  );
};

export default Feedback;