import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "../../css/ChallengeReviews.css";

const ChallengeAllReviews = () => {

  const { challengeId } = useParams();
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {

    try {

      const res = await api.get(`/reviews/${challengeId}`);
      setReviews(res.data);

    } catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {
    fetchReviews();
  }, [challengeId]);

  return (

    <div className="challenge-review-page">

      <h2>All Reviews</h2>

      {reviews.length === 0 && (
        <p className="no-reviews">
          No reviews yet
        </p>
      )}

      <div className="challenge-review-list">

        {reviews.map((r) => (

          <div
            key={r._id}
            className="challenge-review-card"
          >

            <h4>{r.user?.name}</h4>

            <p className="review-stars">
              {"⭐".repeat(r.rating)}
            </p>

            <p>{r.review}</p>

          </div>

        ))}

      </div>

    </div>

  );

};

export default ChallengeAllReviews;