import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../css/Feedback.css";

const Feedback = () => {

  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState("");

  const showSnackbar = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(""), 2500);
  };

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

    if (!message.trim()) {
      showSnackbar("Please write feedback");
      return;
    }

    try {

      await api.post("/support/feedback", {
        message,
        rating,
      });

      showSnackbar("Feedback submitted");

      setIsEditing(false);
      fetchMyFeedback();

    } catch (err) {

      showSnackbar(
        err.response?.data?.message || "Something went wrong"
      );

    }

  };

  return (

    <div className="feedback-page">

      <div className="feedback-card">

        <h2>Feedback</h2>

        {existingFeedback && !isEditing ? (

          <>
            <div className="rating-view">
              {"⭐".repeat(existingFeedback.rating)}
            </div>

            <p className="feedback-text">
              {existingFeedback.message}
            </p>

            <button
              className="btn-secondary"
              onClick={() => setIsEditing(true)}
            >
              Edit Feedback
            </button>
          </>

        ) : (

          <>

            {/* Rating */}

            <div className="rating-select">

              {[1,2,3,4,5].map((num) => (

                <button
                  key={num}
                  onClick={() => setRating(num)}
                  className={`star-btn ${rating >= num ? "active" : ""}`}
                >
                  ⭐
                </button>

              ))}

            </div>

            {/* Message */}

            <textarea
              rows="4"
              value={message}
              placeholder="Share your experience..."
              onChange={(e) => setMessage(e.target.value)}
              className="feedback-textarea"
            />

            <button
              onClick={handleSubmit}
              className="btn-secondary"
            >
              {existingFeedback
                ? "Update Feedback"
                : "Submit Feedback"}
            </button>

          </>

        )}

      </div>

      {/* Snackbar */}

      {snackbar && (

        <div className="snackbar">
          {snackbar}
        </div>

      )}

    </div>

  );
};

export default Feedback;